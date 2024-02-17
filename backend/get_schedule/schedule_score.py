from math import pi, sqrt, cos

class ScheduleOverlapException(Exception):
    # When a schedule is not possible because 2 classes overlap time-wise
    pass

weights = {
    "distance": 25,
    "back_to_back": 15,
    "time": 50,
    "section": 10,
    "lunch": 7.5
}

def convert_to_time_based(list_of_sections):
    schedule_slots = {
        'W': [None]*23,
        'R': [None]*23,
        'F': [None]*23,
        'T': [None]*23,
        'M': [None]*23,
    }

    for section in list_of_sections:
        if section['start_time'] is None or section['end_time'] is None:
            continue

        start_hour = section['start_time'].hour
        end_hour = section['end_time'].hour

        for day in section['days'].strip():
            for hour in range(start_hour, end_hour+1):
                if schedule_slots[day][hour] is not None:
                    raise ScheduleOverlapException(f"Schedule overlap detected for {section['class']['code']} {section['class']['number']} and {schedule_slots[day][hour]['class']['code']} {schedule_slots[day][hour]['class']['number']}")
                schedule_slots[day][hour] = section

    return schedule_slots


def pythagorian_distance(coords1, coords2):
    lat1 = coords1[0]  
    lon1 = coords1[1]  
    lat2 = coords2[0] 
    lon2 = coords1[1] 

    avgLatDeg = (lat1 + lat2) / 2
    avgLat = avgLatDeg * (pi/180)

    d_ew = (lon2 - lon1) * cos(avgLat)
    d_ns = (lat2 - lat1)
    approxDegreesSq = (d_ew * d_ew) + (d_ns * d_ns)
    d_degrees = sqrt(approxDegreesSq)
    EarthAvgMeterPerGreatCircleDegree = (6371000 * 2 * pi) / 360
    return d_degrees * EarthAvgMeterPerGreatCircleDegree

def list_of_successive_distances(schedule):

    list_of_distances = []
    for day in schedule:
        for hour in range(0, 23):
            if schedule[day][hour] is not None and schedule[day][hour + 1] is not None:
                coords1 = schedule[day][hour]['coordinates']
                coords2 = schedule[day][hour + 1]['coordinates']
                if coords1 is not None and coords2 is not None:
                    list_of_distances.append(pythagorian_distance(coords1, coords2))

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
    
    if user_preferences['max_distance'] > 10_000:
        ds = 0
    else :
        ds = distance_score(schedule, user_preferences["max_distance"])

    btb = back_to_back_score(schedule, user_preferences["back_to_back"])
    ts = time_score(schedule, user_preferences["pref_time"])
    ss = section_score(schedule, user_preferences["pref_sections"])
    ls = lunch_score(schedule, user_preferences["lunch"])
    return (ds + btb + ts + ss + ls), schedule

