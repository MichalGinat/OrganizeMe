import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types';
import TaskForm from '../components/TaskForm.jsx';
import CalendarTask from '../components/CalendarTask.jsx';
import TaskModal from '../components/TaskModal.jsx';
import EditTask from '../components/EditTask.jsx';

import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';


CalendarPage.propTypes = {
  userId: PropTypes.string.isRequired,
};

function CalendarPage(props) {
  const [events, setEvents] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  

  useEffect(() => {
    fetchTasksByDate(props.userId);
  }, [props.userId]);

  const fetchTasksByDate = async (userId) => {
    try {
      const response = await fetch(`/api/user/tasks/by-calendar?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks by date');
      }
      const tasks = await response.json();
      const events = tasks.map((task) => {
        return {
          taskId: task.taskId,
          title: task.title,
          taskName: task.taskName,
          start: new Date(task.start),
          end: new Date(task.end),
          dueDate: task.dueDate,
          category: task.category,
          importance: task.importance,
          comments: task.comments,
          status: task.status,
        };
      });
      setEvents(events);
    } catch (error) {
      console.error('Error fetching tasks by date:', error);
    }
  };

  const localizer = momentLocalizer(moment);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor;
    switch (event.status) {
      case 'Done':
        backgroundColor = '#26a657'; // Green
        break;
      case 'Active':
        backgroundColor = '#265da6'; // Blue
        break;
      case 'Not Finished':
        backgroundColor = '#c72c2c'; // Red
        break;
      default:
        backgroundColor = '#000000';
    }

    const style = {
      backgroundColor,
      color: '#ffffff',
      borderRadius: '6px',
      border: 'none',
    };

    return {
      style,
    };
  };



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
        fetchTasksByDate(props.userId); // Pass the userId parameter here
        setShowTaskForm(false);
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

  const handleModalClose = () => {
    setSelectedTask(null);
  };

  const handleEventClick = (event) => {
    setSelectedTask(event);
  };

  const handleAddTaskClick = () => {
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
  };

  const handleEditClick = (task) => {
  setEditTask(task);
  setSelectedTask(null);
  setIsEditModalOpen(true);
};


  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleRemoveTask = (task) => {
    const taskId = task.taskId;

    if (window.confirm('Are you sure you want to remove this task?')) {
      fetch(`/api/tasks/DeleteTask/${taskId}?userId=${props.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
              setEvents((prevEvents) =>
              prevEvents.filter((event) => event.taskId !== taskId)
            );
            setSuccessMessage('Task successfully deleted.'); 
          } else {
            setErrorMessage('Failed to delete the task.');
          }
        })
        .catch((error) => {
          setErrorMessage('Error deleting the task.');
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

  
  const handleCompleteTask = (task) => {
    const taskId = task.taskId;

    if (window.confirm('Are you sure you have finished this task?')) {
      fetch(`/api/tasks/CompleteTask/${taskId}?userId=${props.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            setEvents((prevEvents) =>
              prevEvents.map((event) =>
                event.taskId === taskId ? { ...event, status: 'Done' } : event
              )
            );
            setSuccessMessage('Task marked as completed.');
            setTimeout(() => {
              setSuccessMessage('');
            }, 3000);
          } else {
            setErrorMessage('Failed to mark the task as completed.');
          }
        })
        .catch((error) => {
          setErrorMessage('Error marking the task as completed.');
        })
        
    }
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const response = await fetch(`/api/tasks/UpdateTask/${updatedTask.taskId}?userId=${props.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
  
      if (response.ok) {
        const updatedEvents = events.map((event) =>
          event.taskId === updatedTask.taskId ? { ...event, ...updatedTask } : event
        );
        setEvents(updatedEvents);
        setSuccessMessage('Task successfully updated.');
        fetchTasksByDate(props.userId); // Fetch the updated tasks after updating a task
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrorMessage('Failed to update the task.');
      }
    } catch (error) {
      setErrorMessage('Error updating the task.');
    }
  };
  

  const CustomEvent = ({ event }) => {
    return (
      <div>
        <CalendarTask task={event} onClick={handleEventClick} />
      </div>
    );
  };

  return (
    <div>
        <div className="relative">

        <div className="container mx-auto">
        <form className="mb-8">
        </form>
        {successMessage && !errorMessage && (
          <div className="alert success flex items-center text-green-500 justify-center mb-4">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}
        {errorMessage && !successMessage && (
          <div className="alert error flex items-center text-red-500 justify-center mb-4">
            <FaExclamationCircle className="mr-2" />
            {errorMessage}
          </div>
        )}
      </div>

        {showTaskForm && (
          <div className="absolute top-0 left-0 mt-10 ml-10 z-10">
           
              <TaskForm onSubmit={handleTaskFormSubmit} onClose={handleCloseTaskForm} />
            
          </div>
        )}
  

        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={handleModalClose}
            onRemove={handleRemoveTask} 
            onEdit={handleEditClick}
            onComplete={handleCompleteTask}
            successMessage={successMessage}
            errorMessage={errorMessage}
          />
        )}

       

        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white border border-gray-300 p-4 shadow relative z-10">
              <EditTask
                task={editTask}
                onSave={handleSaveTask}
                onClose={handleEditModalClose}
                isModalOpen={isEditModalOpen}
                userId={props.userId}
                successMessage={successMessage}
                errorMessage={errorMessage}
              />
            </div>
          </div>
        )}
      </div>
  
      <div className="flex justify-end mt-5 mr-8">
        <button
          onClick={handleAddTaskClick}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
        >
          Add Task
        </button>
      </div>
  
      <div className="max-w-2xl mx-auto p-4 bg-white border border-gray-300 shadow-md mt-4 flex items-center">
        <div className="bg-green-500 w-3 h-3 inline-block rounded-full mr-2"></div>
        <span className="flex-1">Tasks that are done</span>
        <div className="bg-blue-500 w-3 h-3 inline-block rounded-full mx-2"></div>
        <span className="flex-1">Tasks that are active</span>
        <div className="bg-red-500 w-3 h-3 inline-block rounded-full ml-2"></div>
        <span className="flex-1"> Tasks that are not finished</span>
      </div>

      {!isEditModalOpen && (
        <div className="mt-5">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            className="max-w-full mx-auto"
            style={{ height: '580px', margin: '30px' }}
            views={['month', 'agenda']}
            components={{
              event: CustomEvent,
              agenda: {
                event: CustomEvent,
              },
            }}
            eventPropGetter={eventStyleGetter}
            popup
            selectable
            showMultiDayTimes
          />
        </div>
      )}

    </div>
  );
}

export default CalendarPage;