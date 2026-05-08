import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FavoriteService from '../services/favoriteService';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const recipeId = recipe.id || recipe.recipe_id;
  const recipeTitle = recipe.title || recipe.recipe_title;
  const recipeImage = recipe.image || recipe.recipe_image;

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const result = await FavoriteService.checkIsFavorited(recipeId);
      setIsFavorited(result.is_favorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [recipeId]);

  useEffect(() => {
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, checkFavoriteStatus]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      if (isFavorited) {
        await FavoriteService.removeFavorite(recipeId);
        setIsFavorited(false);
      } else {
        await FavoriteService.addFavorite(recipeId, recipeTitle, recipeImage);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/recipe/${recipeId}`)}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={recipeImage}
          alt={recipeTitle}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className={`absolute top-3 right-3 p-2 rounded-full transition ${
            isFavorited
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-400 hover:text-red-500'
          }`}
        >
          ❤️
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{recipeTitle}</h3>
        <p className="text-gray-500 text-sm">ID: {recipeId}</p>
      </div>
    </div>
  );
};

export default RecipeCard;