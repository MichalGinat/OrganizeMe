import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaTimes } from 'react-icons/fa';

TaskSearch.propTypes = {
  tasksByCategory: PropTypes.object.isRequired,
  handleSearchResults: PropTypes.func.isRequired,
};

function TaskSearch({ tasksByCategory, handleSearchResults }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [emptyQueryError, setEmptyQueryError] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();

    if (query === '') {
      setEmptyQueryError(true);
      handleSearchResults([]);
      setNoResults(false);
      return;
    }

    setEmptyQueryError(false);

    const results = Object.entries(tasksByCategory).flatMap(([category, tasks]) => {
      const categoryMatches = tasks.filter((task) => task.category.toLowerCase().includes(query));
      const taskNameMatches = tasks.filter((task) => task.taskName.toLowerCase().includes(query));

      return [...categoryMatches, ...taskNameMatches];
    });

    if (results.length > 0) {
      handleSearchResults(results);
      setNoResults(false);
    } else {
      handleSearchResults([]);
      setNoResults(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setEmptyQueryError(false);
    setNoResults(false);
    handleSearchResults([]);
  };

  return (
    <div className="mb-4 pl-4 pr-4">
      {/* Task search */}
      <div className="flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by task name"
            className="border rounded-lg py-2 px-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
          {searchQuery && (
            <button
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={handleClearSearch}
            >
              <FaTimes size={18} />
            </button>
          )}
        </div>
        <button
          className="ml-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg focus:outline-none hidden sm:flex items-center"
          onClick={handleSearch}
        >
          <FaSearch className="mr-1" size={18} /> Search
        </button>
        <button
          className="ml-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg focus:outline-none sm:hidden"
          onClick={handleSearch}
        >
          <FaSearch size={18} />
        </button>
      </div>
      {emptyQueryError && <p className="text-red-500">Please enter a search query.</p>}
      {noResults && <p className="text-red-500">No matching tasks found.</p>}
    </div>
  );
}  


export default TaskSearch;
