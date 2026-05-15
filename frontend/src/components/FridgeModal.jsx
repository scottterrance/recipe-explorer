import React, { useState } from 'react';
import { X, ChefHat, Clock, Users, Sparkles } from 'lucide-react';
import AiService from '../services/aiService';

const FridgeModal = ({ isOpen, onClose }) => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;

    try {
      setLoading(true);
      setError('');
      const result = await AiService.generateFridgeRecipes(ingredients.trim());
      setRecipes(result.recipes || []);
    } catch (err) {
      console.error(err);
      setError('Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b flex items-center justify-between bg-gradient-to-r from-primary to-orange-500 text-white">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">What's in my Fridge?</h2>
              <p className="text-white/80 text-sm">AI will create recipes from your ingredients</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-2xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {/* Ingredients Input */}
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g. chicken, rice, broccoli, soy sauce, garlic..."
            className="w-full h-32 p-5 border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:outline-none focus:border-primary resize-none text-lg"
            disabled={loading}
          />

          <button
            onClick={handleGenerate}
            disabled={loading || !ingredients.trim()}
            className="mt-6 w-full py-5 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500 text-white font-semibold text-xl rounded-3xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>🤖 Thinking of delicious recipes...</>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate Recipes with AI
              </>
            )}
          </button>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

          {/* Results */}
          {recipes.length > 0 && (
            <div className="mt-10">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Here are 3 recipes you can make right now
              </h3>

              <div className="space-y-6">
                {recipes.map((recipe, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-xl">{recipe.title}</h4>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {recipe.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {recipe.servings}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{recipe.description}</p>
                    <p className="text-xs text-primary mt-4 font-medium">{recipe.why_it_works}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FridgeModal;