import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RecipeService from '../services/recipeService';
import FavoriteService from '../services/favoriteService';
import { Heart, Clock, Users, ArrowLeft, ChefHat } from 'lucide-react';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);

  const fetchRecipeDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await RecipeService.getRecipeDetails(recipeId);
      setRecipe(data);
      setError(null);
    } catch (err) {
      setError(err.error || 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const result = await FavoriteService.checkIsFavorited(recipeId);
      setIsFavorited(result.is_favorited);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  useEffect(() => {
    if (isAuthenticated && recipe) checkFavoriteStatus();
  }, [isAuthenticated, recipe, checkFavoriteStatus]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setSavingFavorite(true);
      if (isFavorited) {
        await FavoriteService.removeFavorite(recipeId);
        setIsFavorited(false);
      } else {
        await FavoriteService.addFavorite(recipeId, recipe.title, recipe.image);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setSavingFavorite(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-12 h-12 mx-auto animate-spin text-primary" />
          <p className="mt-4 text-gray-500">Loading delicious recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-red-500 text-xl">{error || 'Recipe not found'}</p>
        <button onClick={() => navigate('/')} className="mt-6 btn btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to recipes
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image + Info */}
        <div>
          <div className="sticky top-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full aspect-video object-cover"
              />
              <button
                onClick={handleToggleFavorite}
                disabled={savingFavorite}
                className={`absolute top-6 right-6 p-4 rounded-3xl transition-all shadow-xl ${
                  isFavorited ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`w-7 h-7 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
              <h1 className="text-4xl font-bold leading-tight">{recipe.title}</h1>
              <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{recipe.readyInMinutes || '30'} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{recipe.servings || 4} servings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Ingredients + Instructions */}
        <div className="space-y-8">
          {/* Ingredients */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              🛒 Ingredients
            </h2>
            <ul className="space-y-4">
              {recipe.extendedIngredients?.map((ing, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="w-6 h-6 flex-shrink-0 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-medium">{ing.name}</span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{ing.original}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          {recipe.instructions && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">👨‍🍳 Instructions</h2>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: recipe.instructions }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;