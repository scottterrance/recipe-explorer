import api from './api';

const AiService = {
  /**
   * Generate 3 smart recipes from fridge ingredients using DeepSeek AI
   */
  generateFridgeRecipes: async (ingredients) => {
    const response = await api.post('/ai/fridge', { ingredients });
    return response.data;
  }
};

export default AiService;