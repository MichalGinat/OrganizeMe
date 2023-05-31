import {useState } from 'react';
import { IoIosCreate, IoIosTrash, IoMdCheckmarkCircleOutline } from 'react-icons/io';
import PropTypes from 'prop-types';
import EditTaskModal from './EditTask';

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  setTasks: PropTypes.func.isRequired,
  handleSaveTask: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
};

function TaskItem(props) {
    const [task, setTask] = useState(props.task);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
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
          return 'bg-red-500';
        default:
          return 'bg-gray-500';
      }
    };

    const formatDate = (dateString) => {
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-GB', options);
    };
  
    const handleEditTask = (task) => {
      setSelectedTask(task);
      setIsModalOpen(true);
    };

    const handleSaveTask = (updatedTask) => {
      // Update the tasks in the parent component based on the category
      props.setTasks((prevTasks) => {
        console.log(prevTasks);
        const updatedTasks = { ...prevTasks };
        const prevCategory = String(props.category); // Convert previous category to a string
        const newCategory = String(updatedTask.category); // Convert updated category to a string
    
        if (prevCategory === newCategory) {
          // If the category remains the same, update the task within the same category
          const categoryTasks = updatedTasks[prevCategory];
    
          if (categoryTasks) {
            const updatedCategoryTasks = categoryTasks.map((prevTask) => {
              if (prevTask.taskId === updatedTask.taskId) {
                return updatedTask;
              } else {
                return prevTask;
              }
            });
    
            updatedTasks[prevCategory] = updatedCategoryTasks;
          }
        } else {
          // If the category has changed, move the task to the new category
          const prevCategoryTasks = updatedTasks[prevCategory];
          const newCategoryTasks = updatedTasks[newCategory];
    
          if (prevCategoryTasks) {
            const updatedPrevCategoryTasks = prevCategoryTasks.filter((prevTask) => prevTask.taskId !== updatedTask.taskId);
            updatedTasks[prevCategory] = updatedPrevCategoryTasks;
          }
    
          if (newCategoryTasks) {
            updatedTasks[newCategory] = [...newCategoryTasks, updatedTask];
          } else {
            updatedTasks[newCategory] = [updatedTask];
          }
        }
    
        return updatedTasks;
      });
    };
    
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
              // Remove the task from the display
              props.setTasks((prevTasks) => {
                const updatedTasks = { ...prevTasks };
                Object.keys(updatedTasks).forEach((category) => {
                  updatedTasks[category] = updatedTasks[category].filter(
                    (task) => task.taskId !== taskId
                  );
                });
                return updatedTasks;
              });
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
              // Update the tasks in the parent component by changing the status of the completed task
              props.setTasks((prevTasks) => {
                const updatedTasks = { ...prevTasks };
                const categories = Object.keys(updatedTasks);
    
                for (const category of categories) {
                  updatedTasks[category] = updatedTasks[category].map((task) => {
                    if (task.taskId === taskId) {
                      return { ...task, status: 'Done' };
                    }
                    return task;
                  });
                }
    
                return updatedTasks;
              });
    
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
      <div className={`p-4 border rounded-lg mb-4 hover:bg-gray-100 transition-colors ${hovered ? 'bg-gray-100' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="md:w-1/2">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <p className="font-bold mr-2">Task Name:</p>
                <p>{props.task.taskName}</p>
              </div>
              <div className="flex items-center mb-2">
                <p className="font-bold mr-2">Due Date:</p>
                <p>{formatDate(props.task.dueDate)}</p>
              </div>
            <div className="flex items-center mb-2">
              <p className="font-bold mr-2">Importance:</p>
              <p>{props.task.importance}</p>
            </div>
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full inline-block mr-2 ${getStatusColor(props.task.status)}`}></span>
              <p className={`font-bold ${props.task.status === 'Active' ? 'text-green-500' : props.task.status === 'Not Finished' ? 'text-red-500' : 'text-gray-500'}`}>
                {props.task.status}
              </p>
            </div>
            <div className="ml-4">
              {/* Edit button */}
              {props.task.status !== 'Done' && (
                <button className="mr-2 text-primary" onClick={() => handleEditTask(props.task)} title="Edit">
                  <IoIosCreate size={20} />
                </button>
              )}

              {/* Delete button */}
              <button className="mr-2 text-red-500" onClick={() => handleDeleteTask(props.task.taskId)} title="Delete">
                <IoIosTrash size={20} />
              </button>

              {/* Complete button */}
              {props.task.status !== 'Done' && (
                <button className="text-green-500" onClick={() => handleCompleteTask(props.task.taskId)} title="Complete">
                  <IoMdCheckmarkCircleOutline size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
        {isModalOpen && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onSave={handleSaveTask}
          onClose={() => setIsModalOpen(false)}
          isModalOpen={isModalOpen}
          userId={props.userId}
        />
      )}
        {hovered && (
          <div className="p-2 bg-gray-200 rounded-md shadow-md mt-2">
            {props.task.comments ? props.task.comments : 'No notes for the task'}
          </div>
        )}
      </div>
    );
    
  }
  export default TaskItem