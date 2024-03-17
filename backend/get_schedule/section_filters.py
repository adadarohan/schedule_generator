import pymongo
from dotenv import load_dotenv
import os

load_dotenv()

mongodb_uri = os.environ.get("MONGODB_URI")
client = pymongo.MongoClient(mongodb_uri)
db = client[os.environ.get("MONGODB_DB")]

classes = db["classes"]
locations = db["locations"]

class ScheduleException(Exception):
    pass


def fetch_section_data(class_list):
    """
    Fetches the section data from the database
    """
    for class_ in class_list:
        clas_mongo_object = classes.find_one({"code": class_["code"], "number": class_[
                                             "number"], "year": 2024, "semester": "fall"})
        class_["sections"] = []
        for section in clas_mongo_object["sections"]:
            if section["crn"] in class_["crn_list"]:

                if section["type_code"] == "OLC":
                    continue

                section["class"] = {
                    "code": class_["code"],
                    "number": class_["number"]
                }
                
                class_["sections"].append(section)

    return class_list
def is_preferred_time(section, start_time, end_time):
    earliest_meeting = start_time
    latest_meeting = end_time

    if section['start_time'] is None or section['end_time'] is None:
        return True
    if section['start_time'].hour < earliest_meeting:
        earliest_meeting = section['start_time'].hour
    if section['end_time'].hour > latest_meeting:
        latest_meeting = section['end_time'].hour

    return earliest_meeting >= start_time and latest_meeting <= end_time


def delete_unpreferred_sections(class_list, start_time, end_time):
    for clas in class_list:
        clas["sections"] = [section for section in clas['sections'] if is_preferred_time(section, start_time, end_time)]
    return class_list


def delete_closed_sections(class_list, open_sections_only):
    if open_sections_only:
        for clas in class_list:
            clas["sections"] = [section for section in clas['sections'] if section['enrollment_status'].lower() != 'closed']
    return class_list


def check_for_no_section(classes_to_take, open_sections_filter_applied):
    for clas in classes_to_take:
        if len(clas["sections"]) == 0:
            if (open_sections_filter_applied):
                raise ScheduleException(f"No open sections found for {clas['code']} {clas['number']} in your specified time range. Please try again with a different time range.")
            else:
                raise ScheduleException(f"No sections found for {clas['code']} {clas['number']} in your specified time range. Please try again with a different time range.")
