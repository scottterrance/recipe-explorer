import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FavoriteService from '../services/favoriteService';
import { Heart, Clock, Users } from 'lucide-react';

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
    if (isAuthenticated) checkFavoriteStatus();
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
      className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={recipeImage}
          alt={recipeTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className={`absolute top-4 right-4 p-3 rounded-2xl transition-all backdrop-blur-md ${
            isFavorited 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/90 hover:bg-white text-gray-700 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick info badges */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="flex items-center gap-1 bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-2xl backdrop-blur-md">
            <Clock className="w-3 h-3" />
            <span>15m</span>
          </div>
          <div className="flex items-center gap-1 bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-2xl backdrop-blur-md">
            <Users className="w-3 h-3" />
            <span>4</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-semibold text-xl line-clamp-2 group-hover:text-primary transition-colors">
          {recipeTitle}
        </h3>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-2xl text-xs font-medium">Trending</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;