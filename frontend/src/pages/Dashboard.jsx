import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import FridgeModal from '../components/FridgeModal';
import FavoriteService from '../services/favoriteService';
import RecipeService from '../services/recipeService';
import { Heart, Sparkles, Refrigerator } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [favorites, setFavorites] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [showFridgeModal, setShowFridgeModal] = useState(false);

  // Load user's favorites
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await FavoriteService.getFavorites();
        setFavorites(data.favorites || []);
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setLoadingFavorites(false);
      }
    };
    loadFavorites();
  }, []);

  // Load recommended recipes - using reliable query
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // Use a reliable search term instead of "popular"
        const result = await RecipeService.searchRecipes('chicken', 8);
        setRecommended(result.results || []);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
        // Fallback: try one more time with another common term
        try {
          const fallback = await RecipeService.searchRecipes('pasta', 6);
          setRecommended(fallback.results || []);
        } catch (e) {
          console.error('Fallback also failed');
        }
      } finally {
        setLoadingRecs(false);
      }
    };
    loadRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold">
            Welcome back, <span className="text-primary">{user?.username || 'Chef'}</span> 👋
          </h1>
          <button
            onClick={() => setShowFridgeModal(true)}
            className="flex items-center gap-3 bg-white px-6 py-4 rounded-3xl shadow-lg hover:shadow-xl"
          >
            <Refrigerator className="w-6 h-6" />
            <span className="font-semibold">What's in my Fridge?</span>
          </button>
        </div>

        {/* Favorites */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-semibold">My Favorites ({favorites.length})</h2>
          </div>
          
          {loadingFavorites ? (
            <p className="text-gray-400">Loading your favorites...</p>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favorites.map((fav) => (
                <RecipeCard key={fav.recipe_id || fav.id} recipe={fav} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center">
              <p className="text-2xl text-gray-400">No favorites yet</p>
            </div>
          )}
        </div>

        {/* Recommended */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-semibold">Recommended for You</h2>
          </div>
          
          {loadingRecs ? (
            <p className="text-gray-400">Finding delicious ideas...</p>
          ) : recommended.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recommended.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center">
              <p className="text-gray-400">No recommendations right now</p>
            </div>
          )}
        </div>
      </div>

      <FridgeModal 
        isOpen={showFridgeModal} 
        onClose={() => setShowFridgeModal(false)} 
      />
    </div>
  );
};

export default Dashboard;