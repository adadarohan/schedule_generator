import pymongo
from dotenv import load_dotenv
import os
import requests
from datetime import datetime
import xml.etree.ElementTree as ET  # for parsing XML
import json

load_dotenv()
mongodb_uri = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(mongodb_uri)
db = client["schedule"]
classes = db["classes"]

def find_validate_xml (base, search) : 
    try :
        return base.find(search).text
    except :
        return None
    
def update_sections (clas):

    resp = requests.get(clas["api_link"])
    if resp.status_code == 404 :
        print("Error Link not found: " + clas["name"])
        raise Exception("Error Link not found: " + clas["name"])
    if resp.status_code != 200 :
        print("Error: " + clas["name"])
        print(clas["api_link"])
        raise Exception(f"Error: {resp.status_code} {clas['name']} {clas['api_link']}")
    
    clas_root = ET.fromstring(resp.content)
    sections = []

    for section in clas_root.find("sections").findall("section") :
        resp = requests.get(section.attrib["href"])
        if resp.status_code == 404 :
            print("Error Link not found: " + section["name"])
            continue
        if resp.status_code != 200 :
            print("Error: " + section["name"])
            print(section["api_link"])
            continue
            
        try :
            section_root = ET.fromstring(resp.content)
        except :
            print("Error parsing XML: " + section["crn"])
            continue
        
        section_number = find_validate_xml(section_root, "sectionNumber")
        status_code = find_validate_xml(section_root, "statusCode")
        part_of_term = find_validate_xml(section_root, "partOfTerm")
        section_status_code = find_validate_xml(section_root, "sectionStatusCode")
        enrollment_status = find_validate_xml(section_root, "enrollmentStatus")
        section_text = find_validate_xml(section_root, "sectionText")

        try :
            start_date_string = section_root.find("startDate").text # 2023-08-21Z
            start_date = datetime.strptime(start_date_string, "%Y-%m-%dZ")
        except :
            start_date = None
        
        try : 
            end_date_string = section_root.find("endDate").text # 2023-12-09Z
            end_date = datetime.strptime(end_date_string, "%Y-%m-%dZ")
        except :
            end_date = None

        meetings = []
        for meeting in section_root.find("meetings").findall("meeting") :

            try :
                start_string = meeting.find("start").text # 09:00 AM
                start_time = datetime.strptime(start_string, "%I:%M %p")
            except:
                start_time = None

            try : 
                end_string = meeting.find("end").text # 09:50 AM
                end_time = datetime.strptime(end_string, "%I:%M %p")
            except :
                end_time = None

            instructors = []
            for instructor in meeting.find("instructors").findall("instructor") :
                instructors.append(instructor.text)

            try : 
                type_code = meeting.find("type").attrib["code"]
            except :
                type_code = None

            meetings.append({
                'id': meeting.attrib["id"],
                'type' : find_validate_xml(meeting, "type"),
                'type_code' : type_code,
                'start_time' : start_time,
                'end_time' : end_time,
                'days' : find_validate_xml(meeting, "days"),
                'room_number' : find_validate_xml(meeting, "roomNumber"),
                'building_name' : find_validate_xml(meeting, "buildingName"),

            })

        sections.append({
            'crn': section.attrib["id"],
            'api_link': section.attrib["href"],
            'section_number': section_number, 
            'status_code': status_code,
            'part_of_term': part_of_term,
            'section_status_code': section_status_code,
            'enrollment_status': enrollment_status,
            'section_text': section_text,
            'start_date': start_date,
            'end_date': end_date,
            'meetings': meetings,
        })
    
    classes.update_one({'_id': clas['_id']}, {'$set': {'sections': sections, 'last_updated': datetime.now()}})
    return json.dumps(sections, default=str)

def get_sections (code, number) :
    selected_class = classes.find_one({'code': code, 'number': number})
    if selected_class is None :
        print("Class not found")
        return None
    if 'last_updated' not in selected_class :
        print("Updating sections")
        return update_sections(selected_class)
    if (datetime.now() - selected_class['last_updated']).total_seconds() > 60 * 10 :
        print("Updating sections")
        return update_sections(selected_class)
    print("Using cached sections")
    return json.dumps(selected_class['sections'], default=str)
