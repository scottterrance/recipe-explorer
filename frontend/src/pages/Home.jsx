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

  const handleSearch = async (searchParams) => { /* ... same as before ... */ };

  const handleSuggestionClick = (suggestion) => {
    handleSearch({ query: suggestion });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* HERO SECTION */}
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

          {/* Fridge Button - Hero Feature */}
          <button
            onClick={() => setShowFridgeModal(true)}
            className="mt-8 inline-flex items-center gap-3 bg-white text-gray-900 hover:bg-amber-100 px-8 py-4 rounded-3xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            <Refrigerator className="w-6 h-6" />
            What's in my Fridge?
            <span className="text-amber-500">→ AI Magic</span>
          </button>
        </div>
      </div>

      {/* Rest of the page (search results) stays the same */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* ... your existing search results code ... */}
        {searched && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold">Results for "{lastQuery}"</h2>
              <p className="text-gray-500">{recipes.length} recipes found</p>
            </div>

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
              /* empty state remains the same */
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-inner max-w-2xl mx-auto">
                {/* ... existing empty state ... */}
              </div>
            )}
          </>
        )}
      </div>

      {/* Fridge Modal */}
      <FridgeModal 
        isOpen={showFridgeModal} 
        onClose={() => setShowFridgeModal(false)} 
      />
    </div>
  );
};

export default Home;