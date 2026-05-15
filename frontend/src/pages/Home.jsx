import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import RecipeService from '../services/recipeService';
import { ChefHat, Sparkles } from 'lucide-react';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);

      const result = await RecipeService.searchRecipes(
        searchParams.query,
        12,
        searchParams.cuisine || null,
        searchParams.diet || null
      );

      setRecipes(result.results || []);
      setSearched(true);
    } catch (error) {
      console.error('❌ Search error in Home:', error);
      const errorMsg = error?.error || error?.message || 'Search failed. Please try again.';
      setError(errorMsg);
      setRecipes([]);
      setSearched(false);
    } finally {
      setLoading(false);
    }
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
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-3xl">
            {error}
          </div>
        )}

        {searched ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold">Results</h2>
              <p className="text-gray-500">{recipes.length} recipes found</p>
            </div>

            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-400">No recipes found</p>
                <p className="text-gray-500 mt-2">Try different keywords or filters</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <ChefHat className="w-16 h-16 mx-auto text-gray-300 mb-6" />
            <p className="text-2xl text-gray-400">Start searching above 👆</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;