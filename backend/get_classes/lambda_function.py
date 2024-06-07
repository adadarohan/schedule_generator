import pymongo
from dotenv import load_dotenv
import json
import os
import datetime

load_dotenv()

mongodb_uri = os.environ.get("MONGODB_URI")

client = pymongo.MongoClient(mongodb_uri)
db = client[os.environ.get("MONGODB_DB")]

classes = db["classes"]
def myconverter(o):
    if isinstance(o, datetime):
        return o.__str__()
  
def get_classes_list():
    class_list =  list(classes.find({'year':2024, "semester" : "fall"}, {"_id": 0, "number" : 1, "code" : 1}))
    return [f"{c['code']} {c['number']}" for c in class_list]

def get_classes_dump():
    class_list =  list(classes.find({'year':2024, "semester" : "fall"}, {"_id": 0, 'number' :1, 'code' :1, "name" : 1, "gened" : 1, "grades" : 1}))
    return class_list

def lambda_handler(event, context):

    if event.get("queryStringParameters") and event["queryStringParameters"].get("dump") and event["queryStringParameters"]["dump"] == "true":
        return json.dumps(get_classes_dump(), default=str)
    else :
        return json.dumps(get_classes_list())