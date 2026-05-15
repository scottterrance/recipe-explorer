import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RecipeService from '../services/recipeService';
import FavoriteService from '../services/favoriteService';
import AiService from '../services/aiService';
import { Heart, Clock, Users, ArrowLeft, ChefHat, Send, X } from 'lucide-react';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Chatbot
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const fetchRecipeDetails = useCallback(async () => {
    try {
      const data = await RecipeService.getRecipeDetails(recipeId);
      setRecipe(data);
    } catch (err) {
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  useEffect(() => {
    if (isAuthenticated && recipe) {
      FavoriteService.checkIsFavorited(recipeId).then(res => setIsFavorited(res.is_favorited));
    }
  }, [isAuthenticated, recipe, recipeId]);

  const sendMessage = async () => { /* ... same as before ... */ };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><ChefHat className="w-12 h-12 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
      {/* ... rest of your previous RecipeDetail code ... */}
      {/* (keep the layout you already have, just make sure no unused variables remain) */}
    </div>
  );
};

export default RecipeDetail;