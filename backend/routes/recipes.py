from flask import Blueprint, request, jsonify
from utils.spoonacular import SpoonacularClient

recipes_bp = Blueprint('recipes', __name__)

# ... rest of your code stays the same (no db import needed)

@recipes_bp.route('/search', methods=['GET'])
def search_recipes():
    """
    Search for recipes
    
    Query parameters:
    - query (required): Search term
    - number (optional): Number of results (default: 10, max: 100)
    - offset (optional): Pagination offset (default: 0)
    - cuisine (optional): Cuisine type
    - diet (optional): Diet type (vegetarian, vegan, etc.)
    
    Example: /api/recipes/search?query=pasta&number=5&cuisine=Italian
    """
    try:
        # Extract parameters
        query = request.args.get('query', '').strip()
        number = request.args.get('number', 10, type=int)
        offset = request.args.get('offset', 0, type=int)
        cuisine = request.args.get('cuisine', '').strip() or None
        diet = request.args.get('diet', '').strip() or None
        
        # Validate input
        if not query:
            return {'error': 'Query parameter is required'}, 400
        
        if len(query) < 2:
            return {'error': 'Query must be at least 2 characters'}, 400
        
        if number < 1 or number > 100:
            return {'error': 'Number must be between 1 and 100'}, 400
        
        if offset < 0:
            return {'error': 'Offset must be non-negative'}, 400
        
        # Call Spoonacular API
        result, status_code = SpoonacularClient.search_recipes(
            query=query,
            number=number,
            offset=offset,
            cuisine=cuisine,
            diet=diet
        )
        
        return jsonify(result), status_code
    
    except Exception as e:
        return {'error': f'Search failed: {str(e)}'}, 500

@recipes_bp.route('/<int:recipe_id>', methods=['GET'])
def get_recipe_details(recipe_id):
    """
    Get detailed information about a recipe
    
    Path parameter:
    - recipe_id: ID of the recipe
    
    Example: /api/recipes/716429
    """
    try:
        # Validate recipe ID
        if recipe_id < 1:
            return {'error': 'Invalid recipe ID'}, 400
        
        # Fetch recipe details
        result, status_code = SpoonacularClient.get_recipe_details(recipe_id)
        
        return jsonify(result), status_code
    
    except Exception as e:
        return {'error': f'Failed to fetch recipe: {str(e)}'}, 500

@recipes_bp.route('/search-by-ingredients', methods=['GET'])
def search_by_ingredients():
    """
    Search for recipes by ingredients
    
    Query parameters:
    - ingredients (required): Comma-separated ingredients (e.g., "tomato,basil")
    - number (optional): Number of results (default: 10)
    
    Example: /api/recipes/search-by-ingredients?ingredients=tomato,basil&number=5
    """
    try:
        ingredients = request.args.get('ingredients', '').strip()
        number = request.args.get('number', 10, type=int)
        
        # Validate input
        if not ingredients:
            return {'error': 'Ingredients parameter is required'}, 400
        
        if number < 1 or number > 100:
            return {'error': 'Number must be between 1 and 100'}, 400
        
        # Call API
        result, status_code = SpoonacularClient.search_by_ingredients(
            ingredients=ingredients,
            number=number
        )
        
        return jsonify(result), status_code
    
    except Exception as e:
        return {'error': f'Search failed: {str(e)}'}, 500