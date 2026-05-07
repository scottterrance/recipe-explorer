import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    MONGODB_URI = os.getenv('MONGODB_URI')
    SPOONACULAR_API_KEY = os.getenv('SPOONACULAR_API_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    MONGODB_URI = 'mongodb://localhost:27017/recipe_explorer_test'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False