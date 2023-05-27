import React from 'react';
import PropTypes from 'prop-types';

function CalendarTask({ task, onClick }) {
  const handleClick = () => {
    onClick(task);
  };

  return (
    <div>
      <div className="text-sm md:text-base font-medium cursor-pointer" onClick={handleClick}>
        {task.title}{' '}
        <span className="text-indigo-50 text-xs md:text-sm font-normal underline">
          Click for details
        </span>
      </div>
    </div>
  );
}

CalendarTask.propTypes = {
  task: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CalendarTask;
