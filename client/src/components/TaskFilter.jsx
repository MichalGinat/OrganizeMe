import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaFilter, FaTimes } from 'react-icons/fa';

TaskFilter.propTypes = {
  selectedFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
};

function TaskFilter({ selectedFilters, handleFilterChange, setStartDate, setEndDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const filterOptions = ['Active', 'Done', 'Not Finished'];
  const importanceOptions = ['Low', 'Medium', 'High'];
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [dateError, setDateError] = useState('');

  const handleFilterToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (option) => {
    const updatedFilters = [...selectedFilters];
    if (updatedFilters.includes(option)) {
      updatedFilters.splice(updatedFilters.indexOf(option), 1);
    } else {
      updatedFilters.push(option);
    }
    handleFilterChange(updatedFilters);
    setDateError('');

  };

  const handleClearFilters = () => {
    handleFilterChange([]);
    setEndDateFilter('')
    setStartDateFilter('')
    setEndDate('')
    setStartDate('')
    setDateError('');
  };

  const handleStartDateChange = (event) => {
    const newStartDate = event.target.value;
    if (!endDateFilter || new Date(newStartDate) <= new Date(endDateFilter)) {
      setStartDate(newStartDate);
      setStartDateFilter(newStartDate);
      setDateError('');
    } else {
      setStartDate('');
      setStartDateFilter('');
      setDateError('Invalid date range');
    }
  };
  
  const handleEndDateChange = (event) => {
    const newEndDate = event.target.value;
    if (!startDateFilter || new Date(newEndDate) >= new Date(startDateFilter)) {
      setEndDate(newEndDate);
      setEndDateFilter(newEndDate);
      setDateError('');
    } else {
      setEndDate('');
      setEndDateFilter('');
      setDateError('Invalid date range');
    }
  };
  
  return (
    <div className="relative pl-4">
      <button
        type="button"
        className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded flex items-center"
        onClick={handleFilterToggle}
      >
        <FaFilter/> 
        <span className="ml-2 hidden md:inline">Filter</span>
        <span className="sr-only">Filter</span>
      </button>
      {isOpen && (
         <div className="fixed inset-0 flex items-center justify-center z-50">
         <div className="absolute inset-0 bg-black opacity-50"></div>
           <div className="relative bg-white border border-gray-400 rounded-md p-4 w-full sm:w-80">
             <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Select Filters:</h3>
            <button type="button" className="text-gray-500 hover:text-gray-700" onClick={handleFilterToggle}>
              <FaTimes />
            </button>
          </div>
          <div className="mb-2">
            <h4 className="text-base font-bold mb-1">Status:</h4>
            {filterOptions.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedFilters.includes(option)}
                  onChange={() => handleOptionChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
          <div className="mb-2">
            <h4 className="text-base font-bold mb-1">Importance:</h4>
            {importanceOptions.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedFilters.includes(option)}
                  onChange={() => handleOptionChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
          <div className="mb-2">
          <h4 className="text-base font-bold mb-1">Date Range:</h4>
          <div className="flex flex-col">
            <label htmlFor="startDate">Start Date:</label>
            <input
                type="date"
                id="startDate"
                value={startDateFilter}
                onChange={handleStartDateChange}
                className="mr-2 border border-gray-300"
            />
            </div>
            <div className="flex flex-col mt-2">
            <label htmlFor="endDate">End Date:</label>
            <input
                type="date"
                id="endDate"
                value={endDateFilter}
                onChange={handleEndDateChange}
                className="mr-2 border border-gray-300"
            />
            </div>
            {dateError && <p className="text-red-500">{dateError}</p>}
          </div>
          <button
            type="button"
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700 w-full"
            onClick={handleClearFilters}
            >
            Clear Filters
            </button>
        </div>
        </div>

      )}
    </div>
    
  );
}


export default TaskFilter;
