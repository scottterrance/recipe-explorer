import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import RecipeService from '../services/recipeService';
import { ChefHat, Sparkles, Search } from 'lucide-react';

const popularSearches = ["pasta", "chicken", "pizza", "salad", "soup", "tacos", "curry", "smoothie"];

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [correction, setCorrection] = useState(null);

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
      setCorrection(result.correction || null);   // ← new
      setSearched(true);
    } catch (error) {
      console.error('❌ Search error:', error);
      setError(error?.error || error?.message || 'Search failed');
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
      {/* HERO SECTION (same as before) */}
      <div className="bg-gradient-to-br from-primary via-orange-500 to-secondary py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-3xl text-white mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium tracking-widest">POWERED BY AI + SPOONACULAR</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter mb-6">
            Find your next<br />favorite recipe
          </h1>
          <p className="text-xl text-white/90 max-w-lg mx-auto mb-10">
            Thousands of delicious recipes. Smart AI suggestions. Your personal cooking companion.
          </p>

          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-3xl">
            {error}
          </div>
        )}

        {searched && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold">Results for "{lastQuery}"</h2>
              <p className="text-gray-500">{recipes.length} recipes found</p>
            </div>

            {/* === DID YOU MEAN? === */}
            {correction && correction.was_corrected && (
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-3xl flex items-center gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-medium">Did you mean?</span>
                <button
                  onClick={() => handleSuggestionClick(correction.corrected)}
                  className="px-6 py-2 bg-white dark:bg-gray-800 hover:bg-blue-600 hover:text-white transition-all rounded-3xl font-semibold shadow-sm"
                >
                  {correction.corrected}
                </button>
              </div>
            )}

            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-inner max-w-2xl mx-auto">
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-6" />
                <h3 className="text-3xl font-semibold text-gray-400 mb-2">No recipes found</h3>
                <p className="text-gray-500 mb-8">
                  We couldn't find any recipes for <span className="font-medium">"{lastQuery}"</span>.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {popularSearches.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-5 py-2 bg-gray-100 hover:bg-primary hover:text-white dark:bg-gray-700 rounded-3xl text-sm transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;