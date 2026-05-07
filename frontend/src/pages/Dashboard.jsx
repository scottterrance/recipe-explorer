import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FavoriteService from '../services/favoriteService';
import RecipeCard from '../components/RecipeCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchFavorites();
  }, [isAuthenticated, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching favorites...');
      const data = await FavoriteService.getFavorites();
      console.log('Favorites received:', data);
      
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.error || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-center text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">My Dashboard</h1>
        <p className="text-gray-500">Welcome, {user?.username}!</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Your Favorite Recipes ({favorites.length})</h2>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <RecipeCard key={fav._id} recipe={fav} onRemove={() => fetchFavorites()} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't saved any recipes yet.</p>
            <a href="/" className="text-orange-500 hover:text-orange-600 font-bold">
              Explore recipes →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;