import api from './api';

const AiService = {
  /**
   * Generate 3 smart recipes from fridge ingredients using DeepSeek AI
   */
  generateFridgeRecipes: async (ingredients) => {
    const response = await api.post('/ai/fridge', { ingredients });
    return response.data;
  },

  /**
   * Chat with AI about a specific recipe
   */
  chatWithRecipe: async (recipeTitle, recipeContext, message) => {
    const response = await api.post('/ai/chat', {
      recipe_title: recipeTitle,
      recipe_context: recipeContext,
      message
    });
    return response.data;
  }
};

export default AiService;