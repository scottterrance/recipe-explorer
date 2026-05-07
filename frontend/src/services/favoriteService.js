
import API from './api';

class FavoriteService {
  static async getFavorites() {
    try {
      const response = await API.get('/favorites');
      return response.data;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error.response?.data || { error: 'Failed to fetch favorites' };
    }
  }

  static async addFavorite(recipeId, recipeTitle, recipeImage) {
    try {
      const response = await API.post('/favorites', {
        recipe_id: recipeId,
        recipe_title: recipeTitle,
        recipe_image: recipeImage
      });
      return response.data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error.response?.data || { error: 'Failed to add favorite' };
    }
  }

  static async removeFavorite(recipeId) {
    try {
      const response = await API.delete(`/favorites/${recipeId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error.response?.data || { error: 'Failed to remove favorite' };
    }
  }

  static async checkIsFavorited(recipeId) {
    try {
      const response = await API.get(`/favorites/${recipeId}/check`);
      return response.data;
    } catch (error) {
      console.error('Error checking favorite:', error);
      throw error.response?.data || { error: 'Failed to check favorite' };
    }
  }
}

export default FavoriteService;