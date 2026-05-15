from flask import Blueprint, request, jsonify
from utils.deepseek import DeepSeekClient

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/fridge', methods=['POST'])
def fridge_to_recipe():
    """
    AI-Powered "What's in my Fridge?" recipe generator
    """
    try:
        data = request.get_json()
        ingredients = data.get('ingredients', '').strip()
        
        if not ingredients or len(ingredients) < 3:
            return {'error': 'Please enter at least a few ingredients'}, 400

        print(f"🍳 Fridge AI called with: {ingredients}")

        # DeepSeek prompt - very strong for recipe generation
        prompt = f"""You are a creative and practical chef. The user has these ingredients: {ingredients}.

Generate **3 realistic and delicious recipes** they can make right now.

For each recipe return **valid JSON array** like this (nothing else):

[
  {{
    "title": "Recipe Name",
    "description": "Short, mouth-watering description",
    "time": "25 min",
    "servings": 2,
    "difficulty": "Easy",
    "ingredients_used": ["ingredient1", "ingredient2"],
    "why_it_works": "Brief reason why this is a great match"
  }}
]

Only return the JSON array. Be creative but realistic."""

        # Call DeepSeek
        result = DeepSeekClient.generate_recipes_from_ingredients(prompt)
        
        return jsonify({
            "success": True,
            "ingredients": ingredients,
            "recipes": result
        }), 200

    except Exception as e:
        print(f"Fridge AI error: {e}")
        return {'error': 'AI recipe generation failed. Please try again.'}, 500