import pymongo
from dotenv import load_dotenv
import os
import itertools
import json

from section_filters import fetch_section_data, delete_unpreferred_sections, delete_closed_sections, check_for_no_section, ScheduleException
from schedule_score import compute_schedule_score, ScheduleOverlapException

load_dotenv()

mongodb_uri = os.environ.get("MONGODB_URI")
client = pymongo.MongoClient(mongodb_uri)
db = client[os.environ.get("MONGODB_DB")]

classes = db["classes"]
locations = db["locations"]


def apply_hard_filters(user_preferences):
    class_list = fetch_section_data(user_preferences["classes"])
    class_list = delete_unpreferred_sections(class_list, user_preferences["start_time"], user_preferences["end_time"])
    check_for_no_section(class_list, False)  # Check if any class has no sections

    class_list = delete_closed_sections(class_list, user_preferences["open_sections_only"])

    check_for_no_section(class_list, True)  # Check if any class has no sections

    return class_list


def remove_duplicates(grouped_sections, pref_sections):
    hash_list = set()
    new_list = []
    for section in grouped_sections:
        section_hash = f"{section['coordinates']}_{section['start_time']}_{section['end_time']}_{section['days']}"
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
            group_key = base_group_name + "_" + section['type_code']
            groups[group_key] = groups.get(group_key, []) + [section]

    un_duplicated_groups = {}

    # Remove groups with section which have the same days, times, and locations
    for key, value in groups.items():
        un_duplicated_groups[key] = remove_duplicates(value, user_preferences["pref_sections"])

    possible_schedules = itertools.product(*un_duplicated_groups.values())

    return possible_schedules


def sort_schedules(possible_schedules, user_preferences):
    sorted_schedules = []
    for schedule in possible_schedules:
        try :
            score, time_schedule = compute_schedule_score(schedule, user_preferences)
            sorted_schedules.append(
                {
                    "time_schedule": time_schedule,
                    "schedule": schedule,
                    "score": score
                }
            )
        except ScheduleOverlapException:
            continue
    if len(sorted_schedules) == 0:
        raise ScheduleException("No possible schedules found. Please try again with different preferences.")
    sorted_schedules.sort(key=lambda x: x["score"], reverse=True)
    print(f"Number of possible schedules: {len(sorted_schedules)}")
    return sorted_schedules


def is_full_semester_schedule(class_list):
    """
    Return true if 
    - every class in the list is a full semester class
    - all the half semester classes are in the same half semester
    """
    half_semester_classes = []

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

print("initialization complete!!")