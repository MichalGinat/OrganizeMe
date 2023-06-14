import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types';
import TaskForm from '../components/TaskForm.jsx';
import CalendarTask from '../components/CalendarTask.jsx';
import TaskModal from '../components/TaskModal.jsx';
import EditTask from '../components/EditTask.jsx';
import { FaCheckCircle, FaExclamationCircle, FaAngleLeft, FaAngleRight, FaCalendarPlus } from 'react-icons/fa';

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
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

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
        fetchTasksByDate(props.userId); 
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
    setIsTaskModalOpen(false);
  };

  const handleEventClick = (event) => {
    setSelectedTask(event);
    setIsTaskModalOpen(true);
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
            setIsTaskModalOpen(false); 
            setSuccessMessage('Task successfully deleted.');
          } else {
            setErrorMessage('Failed to delete the task.');
          }
        })
        .catch((error) => {
          setErrorMessage('Error deleting the task.');
        })
        .finally(() => {
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
            setIsTaskModalOpen(false); 
            setSuccessMessage('Task marked as completed.');
          } else {
            setErrorMessage('Failed to mark the task as completed.');
          }
        })
        .catch((error) => {
          setErrorMessage('Error marking the task as completed.');
        })
        .finally(() => {
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        });
    }
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const { dueDate, taskName, category, importance, comments, status, taskId } = updatedTask; 
      const updatedData = {
        taskName,
        dueDate,
        category,
        importance,
        comments,
        status,
        taskId,
      };

      const response = await fetch(`/api/tasks/UpdateTask/${taskId}?userId=${props.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const updatedEvents = events.map((event) =>
          event.taskId === updatedTask.taskId ? { ...event, ...updatedTask } : event
        );
        setEvents(updatedEvents);
        setSuccessMessage('Task successfully updated.');
        fetchTasksByDate(props.userId); 
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


  const CustomToolbar = ({ label, onNavigate, onView }) => {
    const goToToday = () => {
      const now = new Date();
      onView(Views.MONTH);
      onNavigate('date', now);
    };
  
    return (
      <div className="flex flex-wrap items-center justify-between mb-2">
        <div className="flex items-center mb-2 sm:mb-0">
          <button
            className="flex items-center px-2 mr-1 py-1 text-base font-medium text-white bg-purple-500 rounded hover:bg-purple-600 sm:mr-2"
            onClick={handleAddTaskClick}
          >
            <FaCalendarPlus className="mr-1" /> Add Task
          </button>
        </div>
  
        <strong className="flex justify-center items-center mb-2">
        <div className="text-xl md:text-2xl lg:text-2xl">
          {label}
        </div>
      </strong>

  
        <div className="flex">
          <button
            className="flex items-center px-2 mr-1 py-1 text-base font-medium text-white bg-purple-500 rounded hover:bg-purple-600 sm:mr-2"
            onClick={() => onNavigate('PREV')}
          >
            <FaAngleLeft className="mr-1" /> Prev
          </button>
          <button
            className="flex items-center px-2 mr-1 py-1 text-base font-medium text-white bg-purple-500 rounded hover:bg-purple-600 sm:mr-2"
            onClick={goToToday}
          >
            Current Month
          </button>
          <button
            className="flex items-center px-2 mr-1 py-1 text-base font-medium text-white bg-purple-500 rounded hover:bg-purple-600"
            onClick={() => onNavigate('NEXT')}
          >
            Next <FaAngleRight className="ml-1" />
          </button>
        </div>
      </div>
    );
  };
    

  return (
    <div>
      <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold text-center mt-4 pl-4 pr-4">Task Calendar: Manage Your Schedule with Ease</h1>
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
  
        {selectedTask && isTaskModalOpen &&(
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
        )}
      </div>
  
      <div className="mr-16 ml-8">
      <div className="max-w-lg mx-auto p-4 bg-white border border-gray-300 shadow-md mt-4 flex flex-wrap sm:justify-center items-center text-center">
      <div className="flex items-center mb-2">
        <div className="bg-green-500 w-4 h-4 inline-block rounded-full mr-1"></div>
        <span className="pr-5">Completed tasks</span>
      </div>
      <div className="flex items-center mb-2">
        <div className="bg-blue-500 w-4 h-4 inline-block rounded-full mx-1"></div>
        <span className="pr-5">Ongoing tasks</span>
      </div>
      <div className="flex items-center mb-2">
        <div className="bg-red-500 w-4 h-4 inline-block rounded-full mx-1"></div>
        <span>Overdue tasks</span>
      </div>
    </div>
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
        views={[Views.MONTH]}
        components={{
          event: CustomEvent,
          toolbar: CustomToolbar, 
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