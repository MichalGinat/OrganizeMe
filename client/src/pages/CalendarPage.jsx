import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types';
import TaskForm from '../components/TaskForm.jsx';
import CalendarTask from '../components/CalendarTask.jsx';
import TaskModal from '../components/TaskModal.jsx';

CalendarPage.propTypes = {
  userId: PropTypes.string.isRequired,
};

function CalendarPage(props) {
  const [events, setEvents] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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
          title: task.title,
          start: new Date(task.start),
          end: new Date(task.end),
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

  const handleEventClick = (event) => {
    setSelectedTask(event);
  };

  const handleAddTaskClick = () => {
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
  };

  const handleTaskFormSubmit = (taskData) => {
    console.log(taskData);
  };

  const handleModalClose = () => {
    setSelectedTask(null);
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
        {showTaskForm && (
          <div className="absolute top-0 left-0 mt-10 ml-10 z-10">
            <div className="bg-white border border-gray-300 p-4 shadow">
              <TaskForm onSubmit={handleTaskFormSubmit} onClose={handleCloseTaskForm} />
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

      <div className="mt-5">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          className="max-w-full mx-auto"
          style={{ height: '580px', margin: '30px' }}
          views={[Views.MONTH, Views.AGENDA]}
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

      {selectedTask && <TaskModal task={selectedTask} onClose={handleModalClose} />}
    </div>
  );
}

export default CalendarPage;
