import React, { useState } from 'react';
import RecipeService from '../services/recipeService';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [diet, setDiet] = useState('');
  const [correctionInfo, setCorrectionInfo] = useState(null); // ← new
  const [correcting, setCorrecting] = useState(false);        // ← new

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setCorrecting(true);
      setCorrectionInfo(null);

      // Call DeepSeek to correct the food name
      const correction = await RecipeService.correctFoodName(query);

      if (correction.was_corrected) {
        setCorrectionInfo(correction);       // show correction message
        onSearch({ query: correction.corrected, cuisine, diet });
      } else {
        onSearch({ query, cuisine, diet }); // search with original
      }
    } finally {
      setCorrecting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 rounded-lg shadow-lg">
      <h2 className="text-white text-3xl font-bold mb-6">Search Recipes</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter recipe name or ingredient..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* ← Correction message */}
        {correctionInfo && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg text-sm">
            ✏️ "{correctionInfo.original}" was corrected to "{correctionInfo.corrected}"
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="">Select Cuisine</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Asian">Asian</option>
            <option value="Indian">Indian</option>
            <option value="American">American</option>
          </select>

          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="">Select Diet</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten free">Gluten Free</option>
            <option value="paleo">Paleo</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || correcting}
          className="w-full bg-white text-orange-500 font-bold py-3 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
        >
          {correcting ? 'Checking spelling...' : loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;