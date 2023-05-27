import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

TasksByCategories.propTypes = {
  userId: PropTypes.string.isRequired,
};

function TaskItem({ task }) {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Not Finished':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg mb-2 hover:bg-gray-300 ${hovered ? 'bg-gray-200' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between">
        <div className="flex-grow">
          <p className="font-bold">Task Name:</p>
          <p>{task.taskName}</p>
          <p className="font-bold">Due Date:</p>
          <p>{task.dueDate}</p>
          <p className="font-bold">Category:</p>
          <p>{task.category}</p>
          <p className="font-bold">Importance:</p>
          <p>{task.importance}</p>
        </div>
        <div className="flex items-center">
          <span
            className={`w-3 h-3 rounded-full inline-block mr-2 ${getStatusColor(task.status)}`}
          ></span>
          <p className={task.status === 'Active' ? 'font-bold text-green-500' : 'text-gray-500'}>
            {task.status}
          </p>
        </div>
      </div>
      {hovered && (
        <div className="p-2 bg-gray-200 rounded-md shadow-md">
          {task.comments ? task.comments : 'No notes for the task'}
        </div>
      )}
    </div>
  );
}

function TasksByCategories(props) {
  const [tasksByCategory, setTasksByCategory] = useState({});

  useEffect(() => {
    fetchTasksByCategory();
  }, []);

  const fetchTasksByCategory = async () => {
    try {
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
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gradient-to-b from-white via-gray-100 to-white">
      <h1 className="text-4xl font-bold mt-20 mb-4 text-center">Tasks by Category</h1>

      {Object.keys(tasksByCategory).length > 0 ? (
        <div>
          {Object.entries(tasksByCategory).map(([category, tasks]) => (
            <div key={category} className="p-4 bg-gray-200 rounded-lg mb-4">
              <details>
                <summary className="text-xl font-bold mb-4 cursor-pointer">{category}</summary>
                <ul>
                  {tasks.map((task) => (
                    <TaskItem key={task._id} task={task} />
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
}

export default TasksByCategories;
