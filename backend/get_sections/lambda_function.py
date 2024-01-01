import pymongo
from dotenv import load_dotenv
import os
import requests
from datetime import datetime
import xml.etree.ElementTree as ET  # for parsing XML
import json
from thefuzz import fuzz

load_dotenv()
mongodb_uri = os.environ.get("MONGODB_URI")
client = pymongo.MongoClient(mongodb_uri)
db = client[os.environ.get("MONGODB_DB")]

classes = db["classes"]
locations = db["locations"]
professors = db["professors"]

def get_rmp_info(first_initial, last_name, subject_code) :
    query = {
        'first_name' : {'$regex' : f"^{first_initial}", '$options' : "i"}, 
        'last_name' : {'$regex' : last_name, "$options" : "i"}     
    }

    possible_profs = list(professors.find(query))

    if len(possible_profs) == 0:
        return {}
    elif len(possible_profs) == 1 :
        return possible_profs[0]
    else :
        print("More than one possible prof")
        # Get full names of all subjects
        resp = requests.get("https://courses.illinois.edu/cisapp/explorer/schedule/2024/spring.xml", timeout=10)
        if resp.status_code == 404 :
            raise Exception("Error Link not found: full class list")
        if resp.status_code != 200 :
            raise Exception(f"Error: {resp.status_code} for full class list")
        
        subjects = ET.fromstring(resp.content).find('subjects')
        subject_dict = {ele.attrib['id'] : ele.text for ele in subjects.findall("subject")  }
        subject_name = subject_dict.get(subject_code, '')

        likely_profs = []
        for prof in possible_profs:
            if fuzz.token_sort_ratio(prof['department'], subject_name) > 80:
                likely_profs.append(prof)

        if len(likely_profs) == 1:
            return likely_profs[0]
        else : 
            return {}

def find_validate_xml (base, search) : 
    try :
        return base.find(search).text.strip()
    except :
        return None
    
def update_sections (clas):

    resp = requests.get(clas["api_link"] + "?mode=cascade", timeout=10)
    if resp.status_code == 404 :
        print("Error Link not found: " + clas["name"])
        raise Exception("Error Link not found: " + clas["name"])
    if resp.status_code != 200 :
        print("Error: " + clas["name"])
        print(clas["api_link"])
        raise Exception(f"Error: {resp.status_code} {clas['name']} {clas['api_link']}")
    
    clas_root = ET.fromstring(resp.content)
    sections = []

    for section_root in clas_root.find("detailedSections").findall("detailedSection") :
        
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

        meeting = section_root.find("meetings").find("meeting") 

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

        try :
            instructor_ele = meeting.find('instructors').find('instructor')
            instructor = None
            if instructor_ele is not None:
                instructor = instructor_ele.text
        except Exception as e :
            instructor = None
            print(f"Failed to get instructor with error {e}")

        rmp_info = {}
        if instructor is not None :
            rmp_info = get_rmp_info(instructor_ele.attrib.get('firstName',''), instructor_ele.attrib.get('lastName',''), clas['code'] )
        
        try : 
            type_code = meeting.find("type").attrib["code"]
        except :
            type_code = None
        
        try :
            building_name = find_validate_xml(meeting, "buildingName")
            coordinates = None
            if building_name is not None :
                coordinates = locations.find_one({"name": building_name}).get("coordinates", None)
        except Exception as e :
            print(f"Error finding coordinates for {building_name} with error {e} ")
            coordinates = None

        sections.append({
            'crn': section_root.attrib["id"],
            'section_number': section_number, 
            'status_code': status_code,
            'part_of_term': part_of_term,
            'section_status_code': section_status_code,
            'enrollment_status': enrollment_status,
            'section_text': section_text,
            'start_date': start_date,
            'end_date': end_date,
            'id': meeting.attrib["id"],
            'type' : find_validate_xml(meeting, "type"),
            'type_code' : type_code,
            'start_time' : start_time,
            'end_time' : end_time,
            'days' : find_validate_xml(meeting, "daysOfTheWeek"),
            'room_number' : find_validate_xml(meeting, "roomNumber"),
            'building_name' : find_validate_xml(meeting, "buildingName"),
            'coordinates' : coordinates,
            'instructor' : instructor,
            'rate_my_professor': rmp_info
        })
    
    if sections == [] :
        print("No sections found")
        raise Exception("No sections found")
    
    classes.update_one({'_id': clas['_id']}, {'$set': {'sections': sections, 'last_updated': datetime.now()}})
    return json.dumps(sections, default=str)

def get_sections (code, number) :
    print(f"Getting sections for {code} {number}")
    selected_class = classes.find_one({'code': code, 'number': number, 'year': 2024, 'semester': 'spring'})
    if selected_class is None :
        print("Class not found")
        return None
    #elif 'last_updated' not in selected_class :
    elif True:
        print("Updating sections")
        try : 
            return update_sections(selected_class)
        except Exception as e :
            print(f"Error updating sections with error {e}")
    elif (datetime.now() - selected_class['last_updated']).total_seconds() > 60 * 10 :
        print("Updating sections")
        try : 
            return update_sections(selected_class)
        except Exception as e :
            print(f"Error updating sections with error {e}")
    
    print("Using cached sections")
    return json.dumps(selected_class['sections'], default=str)

def lambda_handler(event, context):
    return get_sections(event['queryStringParameters']['code'], event['queryStringParameters']['number'])
