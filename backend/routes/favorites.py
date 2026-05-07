from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.favorite import Favorite
from database import db  # ← Change this line

favorites_bp = Blueprint('favorites', __name__)

# Initialize Favorite model
favorite_model = Favorite(db)

# ... rest of your code stays the same

@favorites_bp.route('', methods=['POST'])
@jwt_required()
def add_favorite():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not all(k in data for k in ['recipe_id', 'recipe_title', 'recipe_image']):
            return {'error': 'Missing required fields'}, 400
        
        # ✅ Force convert to int regardless of what arrives
        try:
            recipe_id = int(data.get('recipe_id'))
        except (TypeError, ValueError):
            return {'error': 'Invalid recipe_id'}, 400
        
        recipe_title = data.get('recipe_title', '').strip()
        recipe_image = data.get('recipe_image', '').strip()
        
        if recipe_id < 1:
            return {'error': 'Invalid recipe_id'}, 400
        
        if not recipe_title:
            return {'error': 'Recipe title is required'}, 400
        
        result, status_code = favorite_model.add_favorite(
            user_id, recipe_id, recipe_title, recipe_image
        )
        
        return jsonify(result), status_code
    
    except Exception as e:
        return {'error': f'Failed to add favorite: {str(e)}'}, 500

@favorites_bp.route('/<int:recipe_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(recipe_id):
    """
    Remove a recipe from favorites
    
    Path parameter:
    - recipe_id: ID of recipe to remove
    
    Required headers:
    - Authorization: Bearer <token>
    """
    try:
        user_id = get_jwt_identity()
        
        # Validate recipe ID
        if recipe_id < 1:
            return {'error': 'Invalid recipe_id'}, 400
        
        result, status_code = favorite_model.remove_favorite(user_id, recipe_id)
        
        return jsonify(result), status_code
    
    except Exception as e:
        return {'error': f'Failed to remove favorite: {str(e)}'}, 500

@favorites_bp.route('', methods=['GET'])
@jwt_required()
def get_favorites():
    """
    Get user's favorite recipes
    
    Query parameters:
    - limit (optional): Results per page (default: 20)
    - offset (optional): Pagination offset (default: 0)
    
    Required headers:
    - Authorization: Bearer <token>
    """
    try:
        user_id = get_jwt_identity()
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Validate pagination parameters
        if limit < 1 or limit > 100:
            return {'error': 'Limit must be between 1 and 100'}, 400
        
        if offset < 0:
            return {'error': 'Offset must be non-negative'}, 400
        
        result, status_code = favorite_model.get_user_favorites(user_id, limit, offset)
        
        return jsonify(result), status_code
    
    except Exception as e:
        return {'error': f'Failed to fetch favorites: {str(e)}'}, 500

@favorites_bp.route('/<int:recipe_id>/check', methods=['GET'])
@jwt_required()
def check_favorite(recipe_id):
    """
    Check if a recipe is in user's favorites
    
    Path parameter:
    - recipe_id: ID of recipe to check
    
    Required headers:
    - Authorization: Bearer <token>
    """
    try:
        user_id = get_jwt_identity()
        
        is_favorited = favorite_model.is_favorited(user_id, recipe_id)
        
        return {
            'recipe_id': recipe_id,
            'is_favorited': is_favorited
        }, 200
    
    except Exception as e:
        return {'error': f'Failed to check favorite: {str(e)}'}, 500