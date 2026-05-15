import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import FridgeModal from '../components/FridgeModal';
import RecipeService from '../services/recipeService';
import { ChefHat, Sparkles, Search, Refrigerator } from 'lucide-react';

const popularSearches = ["pasta", "chicken", "pizza", "salad", "soup", "tacos", "curry", "smoothie"];

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [correction, setCorrection] = useState(null);
  const [showFridgeModal, setShowFridgeModal] = useState(false);

  const handleSearch = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      setLastQuery(searchParams.query);
      setCorrection(null);

      const result = await RecipeService.searchRecipes(
        searchParams.query,
        12,
        searchParams.cuisine || null,
        searchParams.diet || null
      );

      setRecipes(result.results || []);
      setCorrection(result.correction || null);
      setSearched(true);
    } catch (err) {
      setError(err?.error || 'Search failed');
      setRecipes([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch({ query: suggestion });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-br from-primary via-orange-500 to-secondary py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-3xl text-white mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium tracking-widest">POWERED BY AI</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter mb-6">
            Find your next<br />favorite recipe
          </h1>
          <SearchBar onSearch={handleSearch} loading={loading} />

          <button
            onClick={() => setShowFridgeModal(true)}
            className="mt-8 inline-flex items-center gap-3 bg-white text-gray-900 hover:bg-amber-100 px-8 py-4 rounded-3xl font-semibold text-lg shadow-xl"
          >
            <Refrigerator className="w-6 h-6" />
            What's in my Fridge? <span className="text-amber-500">→ AI Magic</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {searched && (
          <>
            <div className="flex justify-between mb-8">
              <h2 className="text-4xl font-bold">Results for "{lastQuery}"</h2>
              <p className="text-gray-500">{recipes.length} recipes found</p>
            </div>

            {correction && correction.was_corrected && (
              <div className="mb-8 p-4 bg-blue-50 rounded-3xl flex items-center gap-3">
                Did you mean? <button onClick={() => handleSuggestionClick(correction.corrected)} className="font-semibold underline">{correction.corrected}</button>
              </div>
            )}

            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-6" />
                <h3 className="text-3xl font-semibold text-gray-400">No recipes found</h3>
              </div>
            )}
          </>
        )}
      </div>

      <FridgeModal 
        isOpen={showFridgeModal} 
        onClose={() => setShowFridgeModal(false)} 
      />
    </div>
  );
};

export default Home;