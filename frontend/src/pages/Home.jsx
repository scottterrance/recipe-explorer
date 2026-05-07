import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import RecipeService from '../services/recipeService';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchParams) => {
  try {
    setLoading(true);
    setError(null);

    console.log('🔍 Starting search:', searchParams);

    const result = await RecipeService.searchRecipes(
      searchParams.query,
      12,
      searchParams.cuisine || null,
      searchParams.diet || null
    );

    console.log('✅ Search completed, recipes:', result.results?.length);
    setRecipes(result.results || []);
    setSearched(true);
  } catch (error) {
    console.error('❌ Search error in Home:', error);
    
    // Show error message but DON'T redirect
    const errorMsg = error?.error || error?.message || 'Search failed. Please try again.';
    setError(errorMsg);
    
    // ⚠️ Don't redirect anywhere - stay on this page
    setRecipes([]);
    setSearched(false);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-white text-5xl font-bold mb-2">Recipe Explorer</h1>
          <p className="text-white text-xl">Discover delicious recipes from around the world</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {searched && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">
              {recipes.length} Recipes Found
            </h2>

            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12">
                No recipes found. Try a different search term!
              </p>
            )}
          </div>
        )}

        {!searched && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">Start searching for recipes above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;