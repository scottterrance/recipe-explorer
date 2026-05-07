# from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

class User:
    """User model for authentication"""
    
    def __init__(self, db):
        self.db = db
        self.collection = db['users']
    
    def create_user(self, username, email, password):
        """
        Create a new user with hashed password
        
        Args:
            username (str): Username
            email (str): Email address (must be unique)
            password (str): Plain text password
        
        Returns:
            dict: Created user document or error
        """
        # Check if user already exists
        if self.collection.find_one({'email': email}):
            return {'error': 'User already exists'}, 409
        
        # Hash password (bcrypt adds salt automatically)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        user_doc = {
            'username': username,
            'email': email,
            'password': hashed_password,
            'created_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(user_doc)
        
        return {
            '_id': str(result.inserted_id),
            'username': username,
            'email': email
        }, 201
    
    def find_by_email(self, email):
        """Find user by email"""
        user = self.collection.find_one({'email': email})
        return user
    
    def verify_password(self, plain_password, hashed_password):
        """
        Verify plain password against hashed password
        
        Args:
            plain_password (str): User-provided password
            hashed_password (bytes): Stored hashed password
        
        Returns:
            bool: True if password matches, False otherwise
        """
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)