import pymongo
from dotenv import load_dotenv
import json
import os

load_dotenv()

mongodb_uri = os.environ.get("MONGODB_URI")

client = pymongo.MongoClient(mongodb_uri)
db = client["schedule"]
classes = db["classes"]

def get_classes():
    class_list =  list(classes.find({'year':2024, "semester" : "spring"}, {"_id": 0, "number" : 1, "code" : 1}))
    return [f"{c['code']} {c['number']}" for c in class_list]

def lambda_handler(event, context):
    return json.dumps(get_classes())