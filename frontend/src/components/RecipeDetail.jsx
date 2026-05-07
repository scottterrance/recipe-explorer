import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RecipeService from '../services/recipeService';
import FavoriteService from '../services/favoriteService';

/**
 * RecipeDetail Component
 * Shows full recipe details: ingredients, instructions, nutritional info
 */
const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);

  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);

  useEffect(() => {
    if (isAuthenticated && recipe) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, recipe]);

  const fetchRecipeDetails = async () => {
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
  };

  const checkFavoriteStatus = async () => {
    try {
      const result = await FavoriteService.checkIsFavorited(parseInt(recipeId)); // ✅
      setIsFavorited(result.is_favorited);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSavingFavorite(true);
      const id = parseInt(recipeId);  // ✅ convert string to number
      if (isFavorited) {
        await FavoriteService.removeFavorite(id);
        setIsFavorited(false);
      } else {
        await FavoriteService.addFavorite(
          id,              // ✅ integer
          recipe.title,
          recipe.image
        );
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setSavingFavorite(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading recipe...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!recipe) {
    return <div className="text-center py-12">Recipe not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-500 hover:text-blue-700 underline"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-96 object-cover"
        />

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold">{recipe.title}</h1>
              <p className="text-gray-500">Ready in {recipe.readyInMinutes} minutes | Serves {recipe.servings}</p>
            </div>
            <button
              onClick={handleToggleFavorite}
              disabled={savingFavorite}
              style={{ width: '160px' }}
              className={`flex-shrink-0 ml-4 px-6 py-3 rounded-lg font-bold transition ${
                isFavorited
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-red-500 hover:text-white'
              }`}
            >
              {isFavorited ? 'Favorited' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingredients */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.extendedIngredients?.map((ing, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-3">✓</span>
                <div>
                  <p className="font-semibold">{ing.name}</p>
                  <p className="text-gray-600">
                    {ing.original}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Nutrition Info */}
        {recipe.nutrition && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Nutrition (per serving)</h2>
            <div className="space-y-2">
              <p>🔥 Calories: {recipe.nutrition.nutrients?.[0]?.amount?.toFixed(0) || 'N/A'}</p>
              <p>🥗 Protein: {recipe.nutrition.nutrients?.[3]?.amount?.toFixed(1) || 'N/A'}g</p>
              <p>🍞 Carbs: {recipe.nutrition.nutrients?.[1]?.amount?.toFixed(1) || 'N/A'}g</p>
              <p>🧈 Fat: {recipe.nutrition.nutrients?.[2]?.amount?.toFixed(1) || 'N/A'}g</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {recipe.instructions && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-2xl font-bold mb-4">Instructions</h2>
          <div
            className="prose max-w-none space-y-2"
            dangerouslySetInnerHTML={{ __html: recipe.instructions }}
          />
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;