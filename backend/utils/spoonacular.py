import requests
import os
from dotenv import load_dotenv

load_dotenv()

class SpoonacularClient:
    """Client for Spoonacular Recipe API"""
    
    BASE_URL = "https://api.spoonacular.com/recipes"
    API_KEY = os.getenv('SPOONACULAR_API_KEY')
    
    @staticmethod
    def search_recipes(query, number=10, offset=0, cuisine=None, diet=None):
        if not SpoonacularClient.API_KEY:
            return {'error': 'Spoonacular API key not configured'}, 502
    
        """
        Search for recipes
        
        Args:
            query (str): Search term (e.g., "pasta", "chicken")
            number (int): Number of results (default: 10)
            offset (int): Offset for pagination
            cuisine (str): Cuisine type (e.g., "Italian", "Mexican")
            diet (str): Diet type (e.g., "vegetarian", "vegan")
        
        Returns:
            dict: API response with results and total count
        """
        try:
            params = {
                'query': query,
                'number': number,
                'offset': offset,
                'apiKey': SpoonacularClient.API_KEY
            }
            
            # Add optional filters
            if cuisine:
                params['cuisine'] = cuisine
            if diet:
                params['diet'] = diet
            
            response = requests.get(
                f"{SpoonacularClient.BASE_URL}/complexSearch",
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json(), 200
            elif response.status_code == 401:
                return {'error': 'Spoonacular API key invalid or missing'}, 502
            else:
                return {'error': f'API error: {response.status_code}'}, 500
        
        except requests.exceptions.Timeout:
            return {'error': 'API request timed out'}, 500
        except Exception as e:
            return {'error': f'Failed to search recipes: {str(e)}'}, 500
    
    @staticmethod
    def get_recipe_details(recipe_id):
        """
        Get detailed information about a recipe
        
        Args:
            recipe_id (int): Recipe ID from Spoonacular
        
        Returns:
            dict: Recipe details including ingredients and instructions
        """
        try:
            params = {
                'includeNutrition': 'true',
                'apiKey': SpoonacularClient.API_KEY
            }
            
            response = requests.get(
                f"{SpoonacularClient.BASE_URL}/{recipe_id}/information",
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json(), 200
            elif response.status_code == 404:
                return {'error': 'Recipe not found'}, 404
            else:
                return {'error': f'API error: {response.status_code}'}, 500
        
        except requests.exceptions.Timeout:
            return {'error': 'API request timed out'}, 500
        except Exception as e:
            return {'error': f'Failed to fetch recipe details: {str(e)}'}, 500
    
    @staticmethod
    def search_by_ingredients(ingredients, number=10):
        """
        Search for recipes by ingredients
        
        Args:
            ingredients (str): Comma-separated ingredients (e.g., "tomato,basil")
            number (int): Number of results
        
        Returns:
            dict: Recipe results
        """
        try:
            params = {
                'ingredients': ingredients,
                'number': number,
                'apiKey': SpoonacularClient.API_KEY
            }
            
            response = requests.get(
                f"{SpoonacularClient.BASE_URL}/findByIngredients",
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json(), 200
            else:
                return {'error': f'API error: {response.status_code}'}, 500
        
        except requests.exceptions.Timeout:
            return {'error': 'API request timed out'}, 500
        except Exception as e:
            return {'error': f'Failed to search by ingredients: {str(e)}'}, 500