from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from database import db  # ← Change this line
import re
from bson.objectid import ObjectId

auth_bp = Blueprint('auth', __name__)

# Initialize User model
user_model = User(db)

# ... rest of your code stays the same

# Helper function: Validate email format
def is_valid_email(email):
    """Check if email format is valid"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    
    Request body:
    {
        "username": "string",
        "email": "string",
        "password": "string (min 6 chars)"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not all(k in data for k in ['username', 'email', 'password']):
            return {'error': 'Missing required fields'}, 400
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Validate input
        if len(username) < 3:
            return {'error': 'Username must be at least 3 characters'}, 400
        
        if not is_valid_email(email):
            return {'error': 'Invalid email format'}, 400
        
        if len(password) < 6:
            return {'error': 'Password must be at least 6 characters'}, 400
        
        # Create user
        result, status_code = user_model.create_user(username, email, password)
        return jsonify(result), status_code
    
    except Exception as e:
        return {'error': f'Registration failed: {str(e)}'}, 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user and return JWT token
    
    Request body:
    {
        "email": "string",
        "password": "string"
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not all(k in data for k in ['email', 'password']):
            return {'error': 'Missing email or password'}, 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Find user
        user = user_model.find_by_email(email)
        if not user:
            return {'error': 'Invalid email or password'}, 401
        
        # Verify password
        if not user_model.verify_password(password, user['password']):
            return {'error': 'Invalid email or password'}, 401
        
        # Create JWT token
        access_token = create_access_token(
            identity=str(user['_id']),
            expires_delta=False  # Token doesn't expire (can set expiration if needed)
        )
        
        return {
            'access_token': access_token,
            'user': {
                '_id': str(user['_id']),
                'username': user['username'],
                'email': user['email']
            }
        }, 200
    
    except Exception as e:
        return {'error': f'Login failed: {str(e)}'}, 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user info"""
    try:
        user_id = get_jwt_identity()
        user = user_model.collection.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return {'error': 'User not found'}, 404
        
        return {
            '_id': str(user['_id']),
            'username': user['username'],
            'email': user['email']
        }, 200
    
    except Exception as e:
        return {'error': f'Failed to fetch user: {str(e)}'}, 500

from bson.objectid import ObjectId