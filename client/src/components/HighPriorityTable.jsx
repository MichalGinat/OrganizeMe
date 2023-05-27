import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin6Line} from 'react-icons/ri';
import {AiFillCheckSquare} from 'react-icons/ai';
import EditTaskModal from './EditTask';

HighPriorityTableForHomePage.propTypes = {
  tasks: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
};

function HighPriorityTableForHomePage(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  

  function getTaskRowClass(dueDate) {
    const today = new Date();
    const deadline = new Date(dueDate);
    const differenceInDays = Math.floor((deadline - today) / (1000 * 60 * 60 * 24));

    if (differenceInDays <= 2) {
      return 'bg-red-200';
    } else if (differenceInDays <= 4) {
      return 'bg-yellow-200';
    } else {
      return 'bg-green-200';
    }
  }

  // Sort tasks based on due date
  const sortedTasks = tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to remove this task?')) {
      // Send a request to the server to delete the task
      fetch(`/api/tasks/DeleteTask/${taskId}?userId=${props.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            setTasks((prevTasks) =>
              prevTasks.filter((task) => task.taskId !== taskId)
            );
            setSuccessMessage('Task successfully deleted.'); // Set success message
          } else {
            setErrorMessage('Failed to delete the task.'); // Set error message
          }
        })
        .catch((error) => {
          setErrorMessage('Error deleting the task.'); // Set error message
        })
        .finally(() => {
          // Clear the success and error messages after a few seconds
          setTimeout(() => {
            setSuccessMessage('');
            setErrorMessage('');
          }, 3000);
        });
    }
  };

  const handleSaveTask = (updatedTask) => {
    // Find the index of the task to be updated in the tasks array
    const taskIndex = tasks.findIndex((task) => task.taskId === updatedTask.taskId);

    if (taskIndex !== -1) {
      // Create a copy of the tasks array
      const updatedTasks = [...tasks];

      // Update the task at the specified index with the updated values
      updatedTasks[taskIndex] = updatedTask;

      // Update the state with the updated tasks array
      setTasks(updatedTasks);
      setSuccessMessage('Task successfully updated.'); // Set success message
      setIsModalOpen(false); // Close the modal
      setSelectedTask(null)
    } else {
      setErrorMessage('Failed to update the task.'); // Set error message
    }

    // Clear the success and error messages after a few seconds
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 3000);
  };
  
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };
  
  const handleCompleteTask = (taskId) => {
    // Send a request to the server to mark the task as completed
    if (window.confirm('Are you sure you have finished this task?')) {

      fetch(`/api/tasks/CompleteTask/${taskId}?userId=${props.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            setTasks(tasks.filter((task) => task.taskId !== taskId)); // Remove the completed task from the list
            setSuccessMessage('Task marked as completed.'); // Set success message
          } else {
            setErrorMessage('Failed to mark the task as completed.'); // Set error message
          }
        })
        .catch((error) => {
          setErrorMessage('Error marking the task as completed.'); // Set error message
        })
        .finally(() => {
          // Clear the success and error messages after a few seconds
          setTimeout(() => {
            setSuccessMessage('');
            setErrorMessage('');
          }, 3000);
        });
    }
  };
  
  return (
    <div className="overflow-x-auto">
      {successMessage && (
        <div className="flex bg-green-100 rounded-lg p-4 mt-4 text-sm text-green-700" role="alert">
          <FaCheckCircle className="mr-2" />
          <div>
            <span className="font-medium">Success!</span> {successMessage}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex bg-red-100 rounded-lg p-4 mt-4 text-sm text-red-700" role="alert">
          <FaExclamationCircle className="mr-2" />
          <div>
            <span className="font-medium">Error!</span> {errorMessage}
          </div>
        </div>
      )}

      {isModalOpen && selectedTask && (
        <EditTaskModal task={selectedTask} onSave={handleSaveTask} onClose={() => setIsModalOpen(false)} isModalOpen={isModalOpen} userId={props.userId} />
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Urgent Tasks for the Coming Week ({getFormattedDateRange()})</h2>
      <p className="mb-4">
        <span className="bg-red-200 mr-2 rounded-full inline-block w-4 h-4"></span> Tasks due within 3 days
        <span className="bg-yellow-200 ml-4 mr-2 rounded-full inline-block w-4 h-4"></span> Tasks due within 4-5 days
        <span className="bg-green-200 ml-4 mr-2 rounded-full inline-block w-4 h-4"></span> Tasks due after 6-7 days
      </p>

      <div className="mb-20">
        <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200 ">
          <thead className="sticky top-0 bg-white ">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Task Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Importance</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Comments</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50 border-t border-gray-400">
          {sortedTasks.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-4 px-4 text-gray-500 text-center">
                There are no tasks in the coming week.
              </td>
            </tr>
          ) : (
      // map over the sortedTasks array and render task rows
            sortedTasks.map((task) => (
              <tr key={task.taskId} className={getTaskRowClass(task.dueDate)}>
                <td className="py-4 px-4 whitespace-nowrap">{task.taskName}</td>
                <td className="py-4 px-4 whitespace-nowrap">{formatDateTable(task.dueDate)}</td>
                <td className="py-4 px-4 whitespace-nowrap">{task.category}</td>
                <td className="py-4 px-4 whitespace-nowrap">{task.importance}</td>
                <td className="py-4 px-4  max-w-[300px] break-words">{task.comments}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="text-black font-semibold">{task.status}</span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <button
                    className=" mr-2"
                    title="Edit"
                    onClick={() => handleEditTask(task)}
                  >
                    <CiEdit size={22}/>
                  </button>
                  <button
                    className=" mr-2"
                    title="Remove"
                    onClick={() => handleDeleteTask(task.taskId)}
                  >
                    <RiDeleteBin6Line size={22}/>
                  </button>
                  <button
                    className=" text-green-600"
                    title="Mark as Completed"
                    onClick={() => handleCompleteTask(task.taskId)}
                  >
                    <AiFillCheckSquare size={26} />
                  </button>

                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function to get the formatted date range for the coming week
function getFormattedDateRange() {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 7 days to the current date
  const formattedToday = formatDate(today, 'en-US');
  const formattedNextWeek = formatDate(nextWeek, 'en-US');

  return `${formattedToday} - ${formattedNextWeek}`;
}

// Helper function to format a date as "Month Day, Year" using the specified locale
function formatDate(date, locale) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString(locale, options);
}

// Helper function to format a date as "DD/MM/YYYY"
function formatDateTable(date) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-GB', options);
}

export default HighPriorityTableForHomePage;
