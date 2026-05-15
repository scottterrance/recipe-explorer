import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [diet, setDiet] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch({ query: query.trim(), cuisine, diet });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main search input */}
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to cook today?"
              className="w-full px-6 py-5 text-lg bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Search button */}
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-5 bg-primary hover:bg-primary/90 text-white font-semibold text-lg rounded-3xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>Searching...</>
            ) : (
              <>
                <span>Search</span>
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="px-6 py-4 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:outline-none focus:border-primary text-gray-600 dark:text-gray-300"
          >
            <option value="">🌍 Any Cuisine</option>
            <option value="Italian">🇮🇹 Italian</option>
            <option value="Mexican">🇲🇽 Mexican</option>
            <option value="Asian">🍜 Asian</option>
            <option value="Indian">🇮🇳 Indian</option>
            <option value="American">🇺🇸 American</option>
          </select>

          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="px-6 py-4 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-3xl focus:outline-none focus:border-primary text-gray-600 dark:text-gray-300"
          >
            <option value="">🥗 Any Diet</option>
            <option value="vegetarian">🌱 Vegetarian</option>
            <option value="vegan">🌿 Vegan</option>
            <option value="gluten free">🌾 Gluten Free</option>
            <option value="keto">🥑 Keto</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;