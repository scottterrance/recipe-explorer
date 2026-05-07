from pymongo import MongoClient
from dotenv import load_dotenv  # add this
import os

load_dotenv()  # add this

mongo_client = MongoClient(os.getenv('MONGODB_URI'))  # use os.getenv directly
db = mongo_client['recipe_explorer']

print("✓ MongoDB connected successfully")