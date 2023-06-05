import {useState } from 'react';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheckCircle } from 'react-icons/ai';
import PropTypes from 'prop-types';
import EditTaskModal from './EditTask';

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  setTasks: PropTypes.func.isRequired,
  handleSaveTask: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
};

function TaskItem(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
  
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
        // Display success message
        props.setSuccess('Task saved successfully');
        props.setError(''); // Clear any previous error message
        setTimeout(() => {
          props.setSuccess('');
          props.setError('');
        }, 3000);
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
              props.setSuccess('Task successfully deleted.'); // Set success message
            } else {
              props.setError('Failed to delete the task.'); // Set error message
            }
          })
          .catch((error) => {
            props.setError('Error deleting the task.'); // Set error message
          })
          .finally(() => {
            // Clear the success and error messages after a few seconds
            setTimeout(() => {
              props.setSuccess('');
              props.setError('');
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
    
              props.setSuccess('Task marked as completed.'); // Set success message
            } else {
              props.setError('Failed to mark the task as completed.'); // Set error message
            }
          })
          .catch((error) => {
            props.setError('Error marking the task as completed.'); // Set error message
          })
          .finally(() => {
            // Clear the success and error messages after a few seconds
            setTimeout(() => {
              props.setSuccess('');
              props.setError('');
            }, 3000);
          });
      }
    };
    

    return (
      <>
        <div className="flex flex-col md:flex-row justify-between  mb-2">
          <div className="flex flex-col">
            <p className="font-bold">Task Name:</p>
            <p>{props.task.taskName}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Due Date:</p>
            <p>{formatDate(props.task.dueDate)}</p>
          </div>
          <div className="flex flex-col ">
            <p className="font-bold">Importance:</p>
            <p>{props.task.importance}</p>
          </div>
          <div className="flex flex-col items-center md:items-center">
            <div className="flex items-center mb-2">
              <span className={`w-3 h-3 rounded-full inline-block mr-2 ${getStatusColor(props.task.status)}`} />
              <p className={`font-bold ${props.task.status === 'Active' ? 'text-green-500' : props.task.status === 'Not Finished' ? 'text-red-500' : 'text-gray-500'}`}>
                {props.task.status}
              </p>
            </div>
            <div className="flex items-center">
              {/* Edit button */}
              {props.task.status !== 'Done' && (
                <button className="mr-2 text-black-500" onClick={() => handleEditTask(props.task)} title="Edit">
                  <AiOutlineEdit size={20} />
                </button>
              )}
    
              {/* Delete button */}
              <button className="mr-2 text-red-500" onClick={() => handleDeleteTask(props.task.taskId)} title="Delete">
                <AiOutlineDelete size={20} />
              </button>
    
              {/* Complete button */}
              {props.task.status !== 'Done' && (
                <button className="text-green-500" onClick={() => handleCompleteTask(props.task.taskId)} title="Complete">
                  <AiOutlineCheckCircle size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
    
        <div className="p-2 bg-gray-200 rounded-md shadow-md mt-2 overflow-auto">
        <p className="whitespace-pre-wrap">
          {props.task.comments ? props.task.comments : 'No comments for the task'}
        </p>
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
    
        {/* Success message */}
        {props.success && <div className="text-green-500 mt-2">{props.success}</div>}
    
        {/* Error message */}
        {props.error && <div className="text-red-500 mt-2">{props.error}</div>}
      </>
    );
}    
  
  export default TaskItem