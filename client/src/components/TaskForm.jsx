import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IoIosCloseCircleOutline } from 'react-icons/io';

TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

function TaskForm(props) {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [importance, setImportance] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const MAX_TASK_NAME_LENGTH = 30;
  const MAX_COMMENT_LENGTH = 130;

  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleImportanceChange = (e) => {
    setImportance(e.target.value);
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName || !dueDate || !category || !importance) {
      setError('Please fill in all the mandatory fields.');
      return;
    }
    setError('');
    props.onSubmit({ taskName, dueDate, category, importance, comments, status: 'Active' });
    setTaskName('');
    setDueDate('');
    setCategory('');
    setImportance('');
    setComments('');
  };

  const handleClose = (e) => {
    e.preventDefault();
    setTaskName('');
    setDueDate('');
    setCategory('');
    setImportance('');
    setComments('');
    setError('');
    props.onClose();
  };

    // Function to get the current date in the format "YYYY-MM-DD"
    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="w-full max-w-sm bg-white rounded-lg p-6">
        <div className="relative">
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="relative">
              <button
                className="absolute top-0 right-0 -mt-2 -mr-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                onClick={handleClose}
              >
                <IoIosCloseCircleOutline size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-800" htmlFor="taskName">
                Task Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="taskName"
                className="w-full border border-gray-300 rounded py-2 px-3"
                value={taskName}
                onChange={handleTaskNameChange}
                maxLength={MAX_TASK_NAME_LENGTH}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-800" htmlFor="dueDate">
                Due Date
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                className="w-full border border-gray-300 rounded py-2 px-3"
                value={dueDate}
                onChange={handleDueDateChange}
                min={getCurrentDate()}
                required
                />
            </div>
            <div className="mb-4">
            <label className="block mb-2 text-gray-800" htmlFor="category">
                Category
                <span className="text-red-500">*</span>
            </label>
            <select
                id="category"
                className="w-full border border-gray-300 rounded py-2 px-3"
                onChange={handleCategoryChange}
                required
                defaultValue=""
            >
                <option value="" disabled>
                Please choose from the list
                </option>
                <option value="work">Work</option>
                <option value="school">School</option>
                <option value="personal">Personal</option>
                <option value="other">other</option>
            </select>
            </div>
            <div className="mb-4">
            <label className="block mb-2 text-gray-800" htmlFor="importance">
                Importance
                <span className="text-red-500">*</span>
            </label>
            <select
                id="importance"
                className="w-full border border-gray-300 rounded py-2 px-3"
                onChange={handleImportanceChange}
                required
                defaultValue=""
            >
                <option value="" disabled>
                Please choose from the list
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-800" htmlFor="comments">
              Comments
            </label>
            <textarea
              id="comments"
              className="w-full border border-gray-300 rounded py-2 px-3"
              value={comments}
              onChange={handleCommentsChange}
              maxLength={MAX_COMMENT_LENGTH}
            ></textarea>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-center mt-auto">
            <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}

export default TaskForm;

