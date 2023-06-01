import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TaskItem from '../components/TaskItem';
import TaskSearch from '../components/SearchTaskByName';
import TaskFilter from '../components/TaskFilter';
import { FaSpinner, FaPlusCircle ,FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import TaskForm from '../components/TaskForm';

TasksByCategories.propTypes = {
  userId: PropTypes.string.isRequired,
};

function TasksByCategories(props) {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [tasksByCategory, setTasksByCategory] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchTasksByCategory();
  }, []);

  const fetchTasksByCategory = async () => {
    try {
      setIsLoading(true); 
      const response = await fetch(`/api/user/tasks/by-category?userId=${props.userId}`);
      if (response.ok) {
        const tasks = await response.json();
        setTasksByCategory(tasks);
      } else {
        console.error('Failed to fetch tasks by category');
      }
    } catch (error) {
      console.error('Error fetching tasks by category:', error);
    }
    finally {
    setIsLoading(false); // Hide loading indicator
  }
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  const handleOpenTaskForm = () => {
    setShowTaskForm(true);
  };
  
  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
  };
  
  const filteredTasks = Object.entries(tasksByCategory).map(([category, tasks]) => {
    const sortedTasks = tasks.sort((a, b) => {
      // Sort by status: Active > Not Finished > Done
      if (a.status === 'Active' && b.status !== 'Active') {
        return -1;
      }
      if (a.status !== 'Active' && b.status === 'Active') {
        return 1;
      }
      if (a.status === 'Not Finished' && b.status === 'Done') {
        return -1;
      }
      if (a.status === 'Done' && b.status === 'Not Finished') {
        return 1;
      }
  
      // Sort by due date (nearest date first)
      const aDate = new Date(a.dueDate);
      const bDate = new Date(b.dueDate);
      return aDate - bDate;
    });
  
    const filtered = sortedTasks.filter((task) => {
      // Apply the filters based on selectedFilters array
      const statusMatch = selectedFilters.includes(task.status) || selectedFilters.length === 0 || (!selectedFilters.includes('Active') && !selectedFilters.includes('Not Finished') && !selectedFilters.includes('Done'));
      const importanceMatch = selectedFilters.includes(task.importance) || selectedFilters.length === 0 || !selectedFilters.some(filter => ['Low', 'Medium', 'High'].includes(filter));
      const startDateFilter = !startDate || new Date(task.dueDate) >= new Date(startDate);
      const endDateFilter = !endDate || new Date(task.dueDate) <= new Date(endDate);
  
      return statusMatch && importanceMatch && startDateFilter && endDateFilter;
    });
  
    return {
      category,
      tasks: filtered,
    };
  });

  const handleTaskFormSubmit = async (formData) => {
    try {
      const response = await fetch('/api/user/AddTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: props.userId,
          tasks: formData,
        }),
      });
  
      if (response.ok) {
        // Update the tasks in the state based on the category
        setTasksByCategory((prevTasksByCategory) => {
          const updatedTasksByCategory = { ...prevTasksByCategory };
          const { category, taskName } = formData;
  
          if (category in updatedTasksByCategory) {
            // If the category already exists, add the task to the existing category
            updatedTasksByCategory[category].push({ taskName, ...formData });
          } else {
            // If the category doesn't exist, create a new category with the task
            updatedTasksByCategory[category] = [{ taskName, ...formData }];
          }
  
          return updatedTasksByCategory;
        });
  
        // Close the task form
        setShowTaskForm(false);
        setSuccessMessage('Task saved successfully');
      } else {
        setErrorMessage('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
    finally {
      // Clear the success and error messages after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
    };

  };
  
  
  const handleSaveTask = () => {
    fetchTasksByCategory()
  };
  
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const cardClass = "bg-white rounded-lg shadow-md p-4";

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        {successMessage && (
          <div className="flex bg-green-100 rounded-lg p-4 mt-4 text-sm text-green-700" role="alert">
            <FaCheckCircle className="mr-2 text-green-500" />
            <div>
              <span className="font-medium">Success!</span> {successMessage}
            </div>
          </div>
        )}
  
        {errorMessage && (
          <div className="flex bg-red-100 rounded-lg p-4 mt-4 text-sm text-red-700" role="alert">
            <FaExclamationCircle className="mr-2 text-red-500" />
            <div>
              <span className="font-medium">Error!</span> {errorMessage}
            </div>
          </div>
        )}
  
        <h1 className="text-4xl font-bold text-center mb-8">Tasks by Category</h1>
  
        <div className="mb-4">
          <TaskSearch tasksByCategory={tasksByCategory} handleSearchResults={handleSearchResults} />
        </div>
  
        <div className="flex  md:flex-row items-center justify-between">
          <div className="w-full md:w-1/3">
            <TaskFilter
              selectedFilters={selectedFilters}
              handleFilterChange={handleFilterChange}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          </div>
          <div className=" md:w-1/3 flex justify-end pr-4">
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded flex items-center"
              onClick={handleOpenTaskForm}
            >
              <FaPlusCircle />
              <span className="ml-2 hidden md:inline">Add New Task</span>
              <span className="sr-only">Add New Task</span>
            </button>
          </div>
        </div>
  
        {showTaskForm && <TaskForm onSubmit={handleTaskFormSubmit} onClose={handleCloseTaskForm} />}
  
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="animate-spin text-gray-400 text-4xl" />
          </div>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <div className="mt-4 pl-4 pr-4">
                {searchResults.map((task) => (
                  <div key={task.taskId} className="mb-8">
                    <div className="p-6 border bg-purple-50 border-gray-200 rounded-lg shadow">
                    <TaskItem task={task} userId={props.userId} setTasks={setTasksByCategory} handleSaveTask={handleSaveTask} setSuccess={setSuccessMessage} setError = {setErrorMessage}/>                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="mt-4 pl-4">
                {filteredTasks.map(({ category, tasks }) => (
                  <div key={category} className="mb-8 mt-8">
                    <details>
                      <summary className="text-2xl font-bold cursor-pointer mb-2">{category}</summary>
                      {tasks.length > 0 ? (
                        <ul className="list-inside pr-4">
                          {tasks.map((task) => (
                            <li key={task.taskId} className="mb-4">
                              <div className="p-6 border bg-purple-50 border-gray-200 rounded-lg shadow">
                              <TaskItem task={task} userId={props.userId} category = {category} setTasks={setTasksByCategory} handleSaveTask={handleSaveTask} setSuccess={setSuccessMessage} setError = {setErrorMessage}/>                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="p-6 border bg-purple-50 border-gray-200 rounded-lg shadow">No tasks found in this category.</p>
                      )}
                    </details>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No tasks found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
            }


export default TasksByCategories;
