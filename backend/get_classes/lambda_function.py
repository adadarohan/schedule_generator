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
    return list(classes.find({}, {"_id": 0, "name": 1, "number" : 1, "code" : 1}))

def lambda_handler(event, context):
    return json.dumps(get_classes())