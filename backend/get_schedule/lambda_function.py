import pymongo
from dotenv import load_dotenv
import os 
import itertools 
import haversine as hs
import json

load_dotenv()

mongodb_uri = os.environ.get("MONGODB_URI")
client = pymongo.MongoClient(mongodb_uri)
db = client["schedule"]
classes = db["classes"]
locations = db["locations"]

weights = {
    "distance" : 25,
    "back_to_back" : 15,
    "time" : 50,
    "section" : 10,
    "lunch" : 7.5
}

user_preferences = {
    'classes' : [{'code': 'ECE', 'number': '110', 'crn_list': ['36785', '36788', '36780', '36801', '36794', '55569', '36798', '55155', '36781', '55156', '36778', '36800', '36792', '36783', '36796', '62483', '55568', '36790', '36789', '62844', '59864', '59865', '59866', '59867', '59868', '59869', '59870', '59871', '59872', '59873', '59875', '59876', '59878', '59879', '59880', '62509']}, {'code': 'ECE', 'number': '120', 'crn_list': ['64596', '64597', '64598', '64599', '65253', '65254', '65255', '65256', '65257', '65258', '65260', '65261', '66763', '64595', '65733', '65734', '75613']}, {'code': 'PHYS', 'number': '211', 'crn_list': ['55650', '34564', '34566', '59136', '59140', '34590', '34569', '34598', '54863', '34592', '34624', '47717', '34595', '60539', '34601', '54864', '60540', '34608', '34611', '60541', '47577', '34630', '34709', '34604', '34613', '34616', '34619', '34586', '34621', '59137', '55008', '34625', '34727', '52599', '56971', '60543', '60544', '55801', '60546', '60545', '56990', '55007', '55802', '34657', '52600', '52601', '47578', '59143', '34706', '56981', '34659', '34661', '55800', '34665', '34667', '34670', '34673', '59144', '34693', '34689', '34700', '34703', '34698', '55006', '55118', '60535', '60536']}],
    'start_time' : 8,
    'end_time': 17,
    'open_sections_only' : False,
    'max_distance' : 500,
    'back_to_back' : True,
    'pref_time' : 12,
    'pref_sections': ['36785', '36788', '36780', '36801'],
    'lunch':  {
        "start" : 11,
        "end" : 14,
        "duration" : 1
    }
}

def check_for_no_section (classes_to_take) :
    for clas in classes_to_take :
        if len(clas["sections"]) == 0 :
            raise Exception("No sections found for " + clas["code"] + " " + clas["number"])
        
def fetch_section_data (class_list) :
    """
    Fetches the section data from the database
    """
    for class_ in class_list : 
        clas_mongo_object = classes.find_one({"code" : class_["code"], "number" : class_["number"]})
        class_["sections"] = []
        for section in clas_mongo_object["sections"] :
            if section["crn"] in class_["crn_list"] :
                section["class"] = {
                    "code" : class_["code"],
                    "number" : class_["number"]
                }
                class_["sections"].append(section)

    return class_list

def is_preferred_time (section, start_time, end_time) :
    earliest_meeting = section["meetings"][0]['start_time']
    latest_meeting = section["meetings"][0]['end_time']
    for meeting in section["meetings"] :
        if meeting['start_time'] < earliest_meeting :
            earliest_meeting = meeting['start_time']
        if meeting['end_time'] > latest_meeting :
            latest_meeting = meeting['end_time']

    return earliest_meeting.hour > start_time and latest_meeting.hour < end_time

def delete_unpreferred_sections (class_list, start_time, end_time) :
    for clas in class_list :
        clas["sections"] = [section for section in clas['sections'] if is_preferred_time(section, start_time, end_time)]
    return class_list

def delete_closed_sections (class_list, open_sections_only) :
    if open_sections_only :
        for clas in class_list :
            clas["sections"] = [section for section in clas['sections'] if section['enrollment_status'].lower() != 'closed']
    return class_list

def apply_hard_filters(user_preferences) :

    class_list = fetch_section_data(user_preferences["classes"])
    class_list = delete_unpreferred_sections(class_list, user_preferences["start_time"], user_preferences["end_time"])
    class_list = delete_closed_sections(class_list, user_preferences["open_sections_only"])

    check_for_no_section(class_list) # Check if any class has no sections

    return class_list

def generate_schedule_combinations (class_list) :
    """
    Generates all possible schedules
    """
    groups = {}

    for clas in class_list :
        base_group_name = f"{clas['code']}_{clas['number']}_"
        for section in clas['sections'] :
            list_of_meeting_types = [meeting['type_code'] for meeting in section['meetings']]
            group_key = base_group_name + "_".join([str(x) for x in list_of_meeting_types])
            groups[group_key] = groups.get(group_key, []) + [section]

    possible_schedules = list(itertools.product(*groups.values()))

    return possible_schedules

def convert_to_time_based (list_of_sections) : 
    schedule_slots = {
        'W': [None]*23,
        'R': [None]*23,
        'F': [None]*23,
        'T': [None]*23,
        'M': [None]*23,
    }

    for section in list_of_sections :
        for meeting in section['meetings'] :
            start_hour = meeting['start_time'].hour
            end_hour = meeting['end_time'].hour
            for day in list(meeting['days'].strip()) :
                for hour in range(start_hour, end_hour+1) :
                    section_copy = section  
                    section_copy['meetings'] = [meeting]
                    if schedule_slots[day][hour] is not None :
                        return None
                    schedule_slots[day][hour] = section_copy

    return schedule_slots


def list_of_successive_distances (schedule) :

    list_of_distances = []
    for day in schedule :
        for hour in range(0, 23) :
            if schedule[day][hour] is not None and schedule[day][hour + 1] is not None :
                coords1 = schedule[day][hour]['meetings'][0]['coordinates']
                coords2 = schedule[day][hour + 1]['meetings'][0]['coordinates']
                if coords1 is not None and coords2 is not None :
                    list_of_distances.append(hs.haversine(coords1, coords2, unit=hs.Unit.METERS))

    return [x for x in list_of_distances if x != 0.0]

def distance_score (list_of_sections, max_distance) -> float :
    # Returns a score between -distance_weight and distance_weight based on how far apart the classes are
    list_of_distances =  list_of_successive_distances(list_of_sections)

    if len(list_of_distances) == 0 :
        return 0
    
    mean_distance = sum(list_of_distances) / len(list_of_distances)
    
    # Find the distance score
    if mean_distance > max_distance :
        percent_over = (mean_distance - max_distance) / max_distance
        return -(percent_over * weights["distance"])
    elif mean_distance < max_distance :
        percent_under = (max_distance - mean_distance) / max_distance
        return percent_under * weights["distance"]
    else :
        return 0
    
def back_to_back_score (list_of_sections, back_to_back) -> float :
    back_to_back_count = 0
    total_count = 0

    for day in list_of_sections :
        for hour in range(0, 23) :
            if list_of_sections[day][hour] is not None and list_of_sections[day][hour + 1] is not None :
                total_count += 1
                if list_of_sections[day][hour]['crn'] != list_of_sections[day][hour + 1]['crn'] :
                    back_to_back_count += 1

    if total_count == 0 :
        return 0
    elif back_to_back :
        return (back_to_back_count / total_count) * weights["back_to_back"]
    else :
        return (-back_to_back_count / total_count) * weights["back_to_back"]
    
def time_score(list_of_sections, pref_time) :
    time_list = []

    for day in list_of_sections :
        for hour in range(0, 23) :
            if list_of_sections[day][hour] is not None :
                time_list.append(hour)

    if len(time_list) == 0 :
        return 0
    else :
        mean_time = sum(time_list) / len(time_list)
        return (1 - (abs(mean_time - pref_time) / pref_time)) * weights["time"]
    
def section_score (list_of_sections, pref_sections) :
    section_count = 0
    for day in list_of_sections :
        for hour in range(0, 23) :
            if list_of_sections[day][hour] is not None and list_of_sections[day][hour]['crn'] in pref_sections:
                section_count += 1

    return section_count * weights["section"]

def lunch_score (list_of_sections, lunch) :
    lunch_count = 0
    for day in list_of_sections :
        for hour in range(0, 23) :
            if list_of_sections[day][hour] is None and hour >= lunch['start'] and hour < lunch['end'] :
                duration_hours = [list_of_sections[day][x] is None for x in range(hour, hour + lunch['duration']) if x < 23]
                if all(duration_hours) :
                    lunch_count += 1
                    break
    return (lunch_count - 5) * weights["lunch"]

def compute_schedule_score (list_of_sections, user_preferences) -> float :
    schedule = convert_to_time_based(list_of_sections)
    if schedule is None :
        return None
    ds = distance_score(schedule, user_preferences["max_distance"])
    btb = back_to_back_score(schedule, user_preferences["back_to_back"])
    ts = time_score(schedule, user_preferences["pref_time"])
    ss = section_score(schedule, user_preferences["pref_sections"])
    ls = lunch_score(schedule, user_preferences["lunch"])
    return ds + btb + ts + ss + ls

def sort_schedules (possible_schedules, user_preferences) :
    sorted_schedules = []
    for schedule in possible_schedules :
        score = compute_schedule_score(schedule, user_preferences)
        if score is not None :
            sorted_schedules.append(
                {
                    "schedule" : schedule,
                    "score" : score
                }
            )

    sorted_schedules.sort(key=lambda x: x["score"], reverse=True)
    return sorted_schedules

def get_schedule (user_preferences) :
    """
    Returns the schedule for the user
    """
    class_list = apply_hard_filters(user_preferences)
    possible_schedules = generate_schedule_combinations(class_list)
    sorted_schedules = sort_schedules(possible_schedules, user_preferences)
    return sorted_schedules[:5]

def lambda_handler(event, context):
    print(event["queryStringParameters"])

    user_prefs = event["queryStringParameters"]
    return json.dumps(get_schedule(user_prefs), default=str)