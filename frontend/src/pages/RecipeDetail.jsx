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
  // Chatbot state
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const fetchRecipeDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await RecipeService.getRecipeDetails(recipeId);
      setRecipe(data);
    } catch (err) {
      setError(err.error || 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  const checkFavoriteStatus = useCallback(async () => {
    if (isAuthenticated && recipe) {
      try {
        const result = await FavoriteService.checkIsFavorited(recipeId);
        setIsFavorited(result.is_favorited);
      } catch (e) {}
    }
  }, [isAuthenticated, recipe, recipeId]);

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!chatInput.trim() || !recipe) return;

    const userMsg = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
      const context = `
        Title: ${recipe.title}
        Ingredients: ${recipe.extendedIngredients?.map(i => i.original).join(', ')}
        Ready in: ${recipe.readyInMinutes} minutes
        Servings: ${recipe.servings}
      `;

      const res = await AiService.chatWithRecipe(recipe.title, context, currentInput);
      const aiMsg = { role: 'assistant', content: res.answer || res };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't answer that right now." }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><ChefHat className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  if (error || !recipe) {
    return <div className="p-6 text-center text-red-500">{error || 'Recipe not found'}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12 relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
        {/* Left Column - Image & Info */}
        <div className="sticky top-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-primary">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img src={recipe.image} alt={recipe.title} className="w-full aspect-video object-cover" />
            <button onClick={() => {/* favorite logic */}} className={`absolute top-6 right-6 p-4 rounded-3xl ${isFavorited ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}>
              <Heart className={`w-7 h-7 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl p-8">
            <h1 className="text-4xl font-bold">{recipe.title}</h1>
            <div className="flex gap-6 mt-6 text-gray-500">
              <div className="flex items-center gap-2"><Clock className="w-5 h-5" /> {recipe.readyInMinutes || 30} min</div>
              <div className="flex items-center gap-2"><Users className="w-5 h-5" /> {recipe.servings || 4} servings</div>
            </div>
          </div>
        </div>

        {/* Right Column - Ingredients + Instructions + Chat Button */}
        <div className="space-y-8">
          {/* Ingredients */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-6">🛒 Ingredients</h2>
            <ul className="space-y-3">
              {recipe.extendedIngredients?.map((ing, i) => (
                <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{ing.original}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          {recipe.instructions && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 prose dark:prose-invert">
              <h2 className="text-2xl font-semibold mb-6">👨‍🍳 Instructions</h2>
              <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
            </div>
          )}

          {/* Chat Button */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="fixed bottom-8 right-8 bg-primary text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 hover:scale-105 transition-all z-50"
          >
            <ChefHat className="w-6 h-6" />
            Ask AI about this recipe
          </button>
        </div>
      </div>

      {/* FLOATING CHATBOT */}
      {showChat && (
        <div className="fixed bottom-24 right-8 w-96 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 z-[9999] flex flex-col h-[500px]">
          {/* Chat header */}
          <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-primary to-orange-500 text-white rounded-t-3xl">
            <div className="flex items-center gap-3">
              <ChefHat className="w-6 h-6" />
              <div>
                <p className="font-semibold">Recipe Assistant</p>
                <p className="text-xs opacity-75">Ask anything about this recipe</p>
              </div>
            </div>
            <button onClick={() => setShowChat(false)}><X className="w-6 h-6" /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-5 py-3 rounded-3xl ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && <div className="text-center text-sm text-gray-400">Thinking...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask anything... (e.g. make it vegan)"
                className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 rounded-3xl focus:outline-none"
              />
              <button onClick={sendMessage} disabled={chatLoading} className="bg-primary text-white p-4 rounded-3xl">
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;