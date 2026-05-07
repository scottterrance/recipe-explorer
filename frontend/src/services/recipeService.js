import API from './api';

class RecipeService {
  static async searchRecipes(query, number = 10, cuisine = null, diet = null) {
    try {
      console.log('🔍 Searching recipes:', query);
      
      const params = {
        query,
        number,
      };
      
      if (cuisine) params.cuisine = cuisine;
      if (diet) params.diet = diet;
      
      const response = await API.get('/recipes/search', { params });
      
      console.log('✅ Search success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Search failed:', error.response?.status, error.response?.data);
      
      // Don't modify localStorage here - let API interceptor handle auth errors
      throw error.response?.data || { error: 'Search failed' };
    }
  }

  static async getRecipeDetails(recipeId) {
    try {
      console.log('📖 Fetching recipe:', recipeId);
      
      const response = await API.get(`/recipes/${recipeId}`);
      
      console.log('✅ Recipe details loaded');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch recipe:', error.response?.status);
      throw error.response?.data || { error: 'Failed to load recipe' };
    }
  }
}

export default RecipeService;