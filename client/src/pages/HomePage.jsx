import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HighPriorityTableForHomePage from '../components/HighPriorityTable.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { FaSpinner } from 'react-icons/fa';
import IntroSection from '../components/IntroSection.jsx';
import {FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
HomePage.propTypes = {
  userId: PropTypes.string.isRequired,
};

function HomePage(props) {
  const [showForm, setShowForm] = useState(false);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add a state to track loading
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (formData) => {
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
        fetchInProgressTasks();
        setShowForm(false);
        setIsLoading(true);
        setSuccessMessage('Task saved successfully');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrorMessage('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  useEffect(() => {
    fetchInProgressTasks();
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const fetchInProgressTasks = async () => {
    try {
      const response = await fetch('/api/user/tasks/updateStatusToNotFinished', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: props.userId }),
      });

      if (response.ok) {
        const tasksResponse = await fetch(`/api/user/tasks/lastSevenDays/Active?userId=${props.userId}`);
        if (tasksResponse.ok) {
          const tasks = await tasksResponse.json();
          setInProgressTasks(tasks);
          setIsLoading(false); // Set isLoading to false when data is fetched
        } else {
          console.error('Failed to fetch active tasks');
        }
      } else {
        console.error('Failed to update tasks');
      }
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  };

  const checkScreenSize = () => {
    setIsSmallDevice(window.innerWidth < 640); // Adjust the breakpoint as needed
  };

  const handleAddTaskClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-white via-gray-100 to-white">
    {successMessage && (
          <div className="flex bg-green-100 rounded-lg p-4 mt-4 text-sm text-green-700" role="alert">
          <FaCheckCircle className="mr-2" />
          <div>
              <span className="font-medium">Success!</span> {successMessage}
          </div>
      </div>
    )}

    {errorMessage && (
          <div class="flex bg-red-100 rounded-lg p-4 mt-4 text-sm text-red-700" role="alert">
          <FaExclamationCircle className="mr-2" />
          <div>
              <span class="font-medium">Error!</span> {errorMessage}
          </div>
      </div>
    )}
      <IntroSection handleAddTaskClick={handleAddTaskClick} />

      {isLoading ? (
          <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-gray-400 text-4xl" />
          </div>
             ) : (
        <>
          {!isSmallDevice && inProgressTasks && (
            <HighPriorityTableForHomePage tasks={inProgressTasks} userId = {props.userId}/>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <TaskForm onSubmit={handleFormSubmit} onClose={handleCloseForm} />
            <button className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800">
              <svg
                className="h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M13.414 12l6.293-6.293c.391-.391.391-1.023 0-1.414s-1.023-.391-1.414 0L12 10.586 5.707 4.293c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414L10.586 12l-6.293 6.293c-.391.391-.391 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l6.293 6.293c.195.195.45.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414L13.414 12z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
