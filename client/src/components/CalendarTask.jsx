import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function CalendarTask({ task, onClick }) {
  const handleClick = () => {
    onClick(task);
  };

  return (
    <div>
      <div className="text-sm md:text-base font-medium cursor-pointer" onClick={handleClick}>
        {task.title}{' '}
        <button className="text-indigo-50 text-xs md:text-sm font-normal underline" onClick={handleClick}>
          <FontAwesomeIcon icon={faInfoCircle} className="mr-1" title="Click for details" /> 
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
