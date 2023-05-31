import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TaskItem from '../components/TaskItem';
import TaskSearch from '../components/SearchTaskByName';
import TaskFilter from '../components/TaskFilter';
import { FaSpinner } from 'react-icons/fa';

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
  
  const handleSaveTask = () => {
    fetchTasksByCategory()
  };
  
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Tasks by Category</h1>
        <TaskSearch tasksByCategory={tasksByCategory} handleSearchResults={handleSearchResults} />
        <TaskFilter
          selectedFilters={selectedFilters}
          handleFilterChange={handleFilterChange}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="animate-spin text-gray-400 text-4xl" />
          </div>
        ) : 
        searchResults.length > 0 ? (
          <div>
            {searchResults.map((task) => (
              <div key={task.taskId} className="mb-8">
                <TaskItem task={task} userId={props.userId} handleSaveTask={handleSaveTask} />
              </div>
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div>
            {filteredTasks.map(({ category, tasks }) => (
              <div key={category} className="mb-8">
                <details>
                  <summary className="text-2xl font-bold cursor-pointer mb-2">{category}</summary>
                  {tasks.length > 0 ? (
                    <ul>
                      {tasks.map((task) => (
                        <li key={task.taskId}>
                          <TaskItem category={category} task={task} userId={props.userId} setTasks = {setTasksByCategory} handleSaveTask={handleSaveTask} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-6 py-4 text-gray-500">No tasks in this category.</p>
                  )}
                </details>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No tasks found.</p>
        )}
      </div>
    </div>
  );
}

export default TasksByCategories;
