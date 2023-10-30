import pymongo
from dotenv import load_dotenv
import os
import itertools
import haversine as hs
import json
import datetime
import math

load_dotenv()

mongodb_uri = os.environ.get("MONGODB_URI")
client = pymongo.MongoClient(mongodb_uri)
db = client["schedule"]
classes = db["classes"]
locations = db["locations"]

weights = {
    "distance": 25,
    "back_to_back": 15,
    "time": 50,
    "section": 10,
    "lunch": 7.5
}


class ScheduleException(Exception):
    pass


def check_for_no_section(classes_to_take):
    for clas in classes_to_take:
        if len(clas["sections"]) == 0:
            raise ScheduleException(
                "No sections found for " + clas["code"] + " " + clas["number"])


def fetch_section_data(class_list):
    """
    Fetches the section data from the database
    """
    for class_ in class_list:
        clas_mongo_object = classes.find_one({"code": class_["code"], "number": class_[
                                             "number"], "year": 2024, "semester": "spring"})
        class_["sections"] = []
        for section in clas_mongo_object["sections"]:
            if section["crn"] in class_["crn_list"]:
                section["class"] = {
                    "code": class_["code"],
                    "number": class_["number"]
                }
                # Drop online lecture sections
                meeting_type_codes = [meeting["type_code"]
                                      for meeting in section["meetings"]]
                if ("OLC" in meeting_type_codes):
                    continue
                class_["sections"].append(section)

    return class_list


def is_preferred_time(section, start_time, end_time):
    earliest_meeting = start_time
    latest_meeting = end_time

    for meeting in section["meetings"]:
        if meeting['start_time'] is None or meeting['end_time'] is None:
            continue
        if meeting['start_time'].hour < earliest_meeting:
            earliest_meeting = meeting['start_time'].hour
        if meeting['end_time'].hour > latest_meeting:
            latest_meeting = meeting['end_time'].hour

    return earliest_meeting >= start_time and latest_meeting <= end_time


def delete_unpreferred_sections(class_list, start_time, end_time):
    for clas in class_list:
        clas["sections"] = [section for section in clas['sections'] if is_preferred_time(section, start_time, end_time)]
    return class_list


def delete_closed_sections(class_list, open_sections_only):
    if open_sections_only:
        for clas in class_list:
            clas["sections"] = [section for section in clas['sections']
                                if section['enrollment_status'].lower() != 'closed']
    return class_list


def apply_hard_filters(user_preferences):

    class_list = fetch_section_data(user_preferences["classes"])
    class_list = delete_unpreferred_sections(class_list, user_preferences["start_time"], user_preferences["end_time"])
    class_list = delete_closed_sections(
        class_list, user_preferences["open_sections_only"])

    check_for_no_section(class_list)  # Check if any class has no sections

    return class_list


def remove_duplicates(grouped_sections, pref_sections):
    hash_list = set()
    new_list = []
    for section in grouped_sections:
        section_hash = f"{section['meetings'][0]['coordinates']}_{section['meetings'][0]['start_time']}_{section['meetings'][0]['end_time']}_{section['meetings'][0]['days']}"
        if section_hash not in hash_list:
            hash_list.add(section_hash)
            new_list.append(section)
        elif section['crn'] in pref_sections:
            new_list.append(section)

    return new_list


def generate_schedule_combinations(class_list, user_preferences):
    """
    Generates all possible schedules
    """
    groups = {}

    # Split classes into groups based on meeting types
    for clas in class_list:
        base_group_name = f"{clas['code']}_{clas['number']}_"
        for section in clas['sections']:
            list_of_meeting_types = [meeting['type_code']
                                     for meeting in section['meetings']]
            group_key = base_group_name + \
                "_".join([str(x) for x in list_of_meeting_types])
            groups[group_key] = groups.get(group_key, []) + [section]

    un_duplicated_groups = {}


    # Remove groups with section which have the same days, times, and locations
    for key, value in groups.items():
        un_duplicated_groups[key] = remove_duplicates(value, user_preferences["pref_sections"])

    possible_schedules_length = math.prod([len(x) for x in un_duplicated_groups.values()])

    if possible_schedules_length > 1_000_000:
        raise ScheduleException("overflow")
    
    possible_schedules = itertools.product(*un_duplicated_groups.values())

    return possible_schedules


def convert_to_time_based(list_of_sections):
    schedule_slots = {
        'W': [None]*23,
        'R': [None]*23,
        'F': [None]*23,
        'T': [None]*23,
        'M': [None]*23,
    }

    for section in list_of_sections:
        for meeting in section['meetings']:

            if meeting['start_time'] is None or meeting['end_time'] is None:
                continue

            start_hour = meeting['start_time'].hour
            end_hour = meeting['end_time'].hour

            for day in list(meeting['days'].strip()):
                for hour in range(start_hour, end_hour+1):
                    section_copy = section
                    section_copy['meetings'] = [meeting]
                    if schedule_slots[day][hour] is not None:
                        return None
                    schedule_slots[day][hour] = section_copy

    return schedule_slots


def list_of_successive_distances(schedule):

    list_of_distances = []
    for day in schedule:
        for hour in range(0, 23):
            if schedule[day][hour] is not None and schedule[day][hour + 1] is not None:
                coords1 = schedule[day][hour]['meetings'][0]['coordinates']
                coords2 = schedule[day][hour + 1]['meetings'][0]['coordinates']
                if coords1 is not None and coords2 is not None:
                    list_of_distances.append(hs.haversine(coords1, coords2, unit=hs.Unit.METERS))

    return [x for x in list_of_distances if x != 0.0]


def distance_score(list_of_sections, max_distance) -> float:
    # Returns a score between -distance_weight and distance_weight based on how far apart the classes are
    list_of_distances = list_of_successive_distances(list_of_sections)

    if len(list_of_distances) == 0:
        return 0

    mean_distance = sum(list_of_distances) / len(list_of_distances)

    # Find the distance score
    if mean_distance > max_distance:
        percent_over = (mean_distance - max_distance) / max_distance
        return -(percent_over * weights["distance"])
    elif mean_distance < max_distance:
        percent_under = (max_distance - mean_distance) / max_distance
        return percent_under * weights["distance"]
    else:
        return 0


def back_to_back_score(list_of_sections, back_to_back) -> float:
    back_to_back_count = 0
    total_count = 0

    for day in list_of_sections:
        for hour in range(0, 23):
            if list_of_sections[day][hour] is not None and list_of_sections[day][hour + 1] is not None:
                total_count += 1
                if list_of_sections[day][hour]['crn'] != list_of_sections[day][hour + 1]['crn']:
                    back_to_back_count += 1

    if total_count == 0:
        return 0
    elif back_to_back:
        return (back_to_back_count / total_count) * weights["back_to_back"]
    else:
        return (-back_to_back_count / total_count) * weights["back_to_back"]


def time_score(list_of_sections, pref_time):
    time_list = []

    for day in list_of_sections:
        for hour in range(0, 23):
            if list_of_sections[day][hour] is not None:
                time_list.append(hour)

    if len(time_list) == 0:
        return 0
    else:
        mean_time = sum(time_list) / len(time_list)
        return (1 - (abs(mean_time - pref_time) / pref_time)) * weights["time"]


def section_score(list_of_sections, pref_sections):
    section_count = 0
    for day in list_of_sections:
        for hour in range(0, 23):
            if list_of_sections[day][hour] is not None and list_of_sections[day][hour]['crn'] in pref_sections:
                section_count += 1

    return section_count * weights["section"]


def lunch_score(list_of_sections, lunch):
    lunch_count = 0
    for day in list_of_sections:
        for hour in range(0, 23):
            if list_of_sections[day][hour] is None and hour >= lunch['start'] and hour < lunch['end']:
                duration_hours = [list_of_sections[day][x] is None for x in range(hour, hour + lunch['duration']) if x < 23]
                if all(duration_hours):
                    lunch_count += 1
                    break
    return (lunch_count - 5) * weights["lunch"]

def compute_schedule_score(list_of_sections, user_preferences) -> float:
    schedule = convert_to_time_based(list_of_sections)
    if schedule is None:
        return None, None
    
    if user_preferences['max_distance'] > 10_000:
        ds = 0
    else :
        ds = distance_score(schedule, user_preferences["max_distance"])

    btb = back_to_back_score(schedule, user_preferences["back_to_back"])
    ts = time_score(schedule, user_preferences["pref_time"])
    ss = section_score(schedule, user_preferences["pref_sections"])
    ls = lunch_score(schedule, user_preferences["lunch"])
    return (ds + btb + ts + ss + ls), schedule

def sort_schedules(possible_schedules, user_preferences):
    sorted_schedules = []
    for schedule in possible_schedules:
        score, time_schedule = compute_schedule_score(schedule, user_preferences)
        if score is not None:
            sorted_schedules.append(
                {
                    "time_schedule": time_schedule,
                    "schedule": schedule,
                    "score": score
                }
            )
    if len(sorted_schedules) == 0:
        raise ScheduleException("No possible schedules found. Please try again with different preferences.")
    sorted_schedules.sort(key=lambda x: x["score"], reverse=True)
    return sorted_schedules


def get_schedule(user_preferences):
    """
    Returns the schedule for the user
    """
    class_list = apply_hard_filters(user_preferences)
    print('Applied hard filters')
    possible_schedules = generate_schedule_combinations(class_list, user_preferences)
    print('Generated schedule combinations')
    sorted_schedules = sort_schedules(possible_schedules, user_preferences)
    print('Sorted schedules')
    return sorted_schedules[:5]


def lambda_handler(event, context):
    print(event["queryStringParameters"]['data'])

    try:
        user_prefs = json.loads(event["queryStringParameters"]['data'])
    except:
        return {
            'statusCode': 400,
            'body': json.dumps("Error parsing JSON")
        }

    try:
        return json.dumps(get_schedule(user_prefs), default=str)
    except ScheduleException as e:
        return {
            'statusCode': 400,
            'body': json.dumps(str(e))
        }
