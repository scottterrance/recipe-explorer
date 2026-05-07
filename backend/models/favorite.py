# from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

class Favorite:
    """Favorite model for user-saved recipes"""
    
    def __init__(self, db):
        self.db = db
        self.collection = db['favorites']
    
    def add_favorite(self, user_id, recipe_id, recipe_title, recipe_image):
        """
        Add a recipe to user's favorites
        
        Args:
            user_id (str): User ObjectId as string
            recipe_id (int): Spoonacular recipe ID
            recipe_title (str): Recipe title
            recipe_image (str): Recipe image URL
        
        Returns:
            tuple: (result_dict, status_code)
        """
        try:
            # Check if already favorited
            existing = self.collection.find_one({
                'user_id': ObjectId(user_id),
                'recipe_id': recipe_id
            })
            
            if existing:
                return {'error': 'Recipe already in favorites'}, 409
            
            favorite_doc = {
                'user_id': ObjectId(user_id),
                'recipe_id': recipe_id,
                'recipe_title': recipe_title,
                'recipe_image': recipe_image,
                'saved_at': datetime.utcnow()
            }
            
            result = self.collection.insert_one(favorite_doc)
            
            return {
                '_id': str(result.inserted_id),
                'recipe_id': recipe_id,
                'recipe_title': recipe_title
            }, 201
        
        except Exception as e:
            return {'error': str(e)}, 500
    
    def remove_favorite(self, user_id, recipe_id):
        """
        Remove a recipe from user's favorites
        
        Args:
            user_id (str): User ObjectId as string
            recipe_id (int): Spoonacular recipe ID
        
        Returns:
            tuple: (result_dict, status_code)
        """
        try:
            result = self.collection.delete_one({
                'user_id': ObjectId(user_id),
                'recipe_id': recipe_id
            })
            
            if result.deleted_count == 0:
                return {'error': 'Favorite not found'}, 404
            
            return {'message': 'Favorite removed'}, 200
        
        except Exception as e:
            return {'error': str(e)}, 500
    
    def get_user_favorites(self, user_id, limit=20, offset=0):
        """
        Get all favorites for a user
        
        Args:
            user_id (str): User ObjectId as string
            limit (int): Number of results per page
            offset (int): Pagination offset
        
        Returns:
            tuple: (favorites_list, status_code)
        """
        try:
            favorites = list(
                self.collection.find(
                    {'user_id': ObjectId(user_id)}
                )
                .sort('saved_at', -1)  # Newest first
                .skip(offset)
                .limit(limit)
            )
            
            # Convert ObjectIds to strings for JSON serialization
            for fav in favorites:
                fav['_id'] = str(fav['_id'])
                fav['user_id'] = str(fav['user_id'])
                fav['saved_at'] = fav['saved_at'].isoformat()
            
            # Get total count
            total = self.collection.count_documents({'user_id': ObjectId(user_id)})
            
            return {
                'favorites': favorites,
                'total': total,
                'count': len(favorites)
            }, 200
        
        except Exception as e:
            return {'error': str(e)}, 500
    
    def is_favorited(self, user_id, recipe_id):
        """Check if recipe is already favorited"""
        return self.collection.find_one({
            'user_id': ObjectId(user_id),
            'recipe_id': recipe_id
        }) is not None