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

  // Load favorites
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await FavoriteService.getFavorites();
        setFavorites(data.favorites || []);
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoadingFavorites(false);
      }
    };
    loadFavorites();
  }, []);

  // Load AI recommendations (simple but effective)
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // For now, get trending/random recipes + favorites influence
        const result = await RecipeService.searchRecipes('popular', 8);
        setRecommended(result.results || []);
      } catch (err) {
        console.error('Failed to load recommendations', err);
      } finally {
        setLoadingRecs(false);
      }
    };
    loadRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              Welcome back, <span className="text-primary">{user?.username || 'Chef'}</span> 👋
            </h1>
            <p className="text-xl text-gray-500 mt-2">Your personal recipe hub</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFridgeModal(true)}
              className="flex items-center gap-3 bg-white hover:bg-amber-50 px-6 py-4 rounded-3xl shadow-lg border border-amber-200 transition-all"
            >
              <Refrigerator className="w-6 h-6 text-amber-500" />
              <span className="font-semibold">What's in my Fridge?</span>
            </button>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-semibold">My Favorites</h2>
            {favorites.length > 0 && (
              <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-3xl font-medium">
                {favorites.length} saved
              </span>
            )}
          </div>

          {loadingFavorites ? (
            <p className="text-gray-400">Loading your favorites...</p>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favorites.map((fav) => (
                <RecipeCard key={fav.recipe_id} recipe={fav} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-2xl text-gray-400">No favorites yet</p>
              <p className="text-gray-500 mt-2">Start saving recipes you love!</p>
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-semibold">Recommended for You</h2>
            <span className="px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-3xl">AI Powered</span>
          </div>

          {loadingRecs ? (
            <p className="text-gray-400">Finding delicious recommendations...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recommended.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fridge Modal */}
      <FridgeModal 
        isOpen={showFridgeModal} 
        onClose={() => setShowFridgeModal(false)} 
      />
    </div>
  );
};

export default Dashboard;