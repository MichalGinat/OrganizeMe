import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import HighPriorityTableForHomePage from '../components/HighPriorityTable.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { Link } from 'react-router-dom';

HomePage.propTypes = {
  userId: PropTypes.string.isRequired,
};

function HomePage(props) {
  const [showForm, setShowForm] = useState(false);
  const [inProgressTasks, setInProgressTasks] = useState([]);

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch('/api/user/task', {
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
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  useEffect(() => {
    fetchInProgressTasks();
  }, []);

  const fetchInProgressTasks = async () => {
    try {
      const response = await fetch('/api/user/tasks/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: props.userId }),
      });

      if (response.ok) {
        const tasksResponse = await fetch(`/api/user/tasks/in-progress?userId=${props.userId}`);
        if (tasksResponse.ok) {
          const tasks = await tasksResponse.json();
          setInProgressTasks(tasks);
        } else {
          console.error('Failed to fetch in-progress tasks');
        }
      } else {
        console.error('Failed to update tasks');
      }
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  };

  const handleAddTaskClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-white via-gray-100 to-white p-4">
      <h1 className="text-4xl font-bold mt-20 mb-4 text-center">Welcome to our Task Management Website</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Easily manage your tasks with our intuitive and powerful task management platform.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Add New Task</h3>
            <p className="text-sm">Add a new task to your task list.</p>
          </div>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mt-2 w-full"
            onClick={handleAddTaskClick}
          >
            Add Task
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between items-center">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">View Tasks by Categories</h3>
            <p className="text-sm">
              Here you can see all your tasks according to the different categories you have sorted.
            </p>
          </div>
          <Link
            to="/tasks/byCategory"
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mt-2"
          >
            View Tasks
          </Link>
        </div>


        <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between items-center">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">View Tasks through Calendar</h3>
            <p className="text-sm">
            Here you can see all your tasks arranged in a calendar.
            </p>
          </div>
          <Link
            to="/tasks/byCalendar"
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mt-2"
          >
            View Calendar
          </Link>
        </div>


      </div>

      <h2 className="text-2xl font-bold mt-8">In Progress Tasks</h2>

      {inProgressTasks && <HighPriorityTableForHomePage tasks={inProgressTasks} />}

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
