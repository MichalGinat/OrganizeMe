// The code is called "CalendarTask" that displays a task in a calendar.
// It handles clicks on the task and a button, invoking a function provided as a prop.
// The component shows the task title, an info icon, and a hidden hoverable span with the title. 
// It has prop type validation and is exported as the default.

import React from 'react';
import PropTypes from 'prop-types';
import { FaInfoCircle } from 'react-icons/fa';


function CalendarTask({ task, onClick }) {
  const handleClick = () => {
    onClick(task);
  };

  return (
    <div>
      <div className="text-sm md:text-base font-medium cursor-pointer" onClick={handleClick}>
        {task.title}{' '}
        <button className="text-indigo-50 text-xs md:text-sm font-normal underline" onClick={handleClick}>
        <FaInfoCircle className="mr-1" title="Click for details" />

          <span className="invisible absolute bg-gray-800 text-white text-xs py-1 px-2 rounded-lg whitespace-nowrap -left-1/2 transform -translate-x-1/2 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
        {task.title}
      </span>
        </button>
      </div>
    </div>
  );
}

CalendarTask.propTypes = {
  task: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CalendarTask;
