import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FavoriteService from '../services/favoriteService';
import { Heart } from 'lucide-react';

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
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
    >
      <figure className="relative h-56 overflow-hidden">
        <img
          src={recipeImage}
          alt={recipeTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className={`absolute top-4 right-4 btn btn-circle btn-sm transition-all ${
            isFavorited ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white text-gray-600'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </figure>

      <div className="card-body p-5">
        <h3 className="card-title text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {recipeTitle}
        </h3>
        <div className="flex gap-2">
          <div className="badge badge-outline">15 min</div>
          <div className="badge badge-outline">4 servings</div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;