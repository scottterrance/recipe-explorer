import React, { useState } from 'react';

/**
 * SearchBar Component
 * Allows users to search recipes by query, cuisine, and diet
 */
const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [diet, setDiet] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch({ query, cuisine, diet });
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
          disabled={loading}
          className="w-full bg-white text-orange-500 font-bold py-3 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;