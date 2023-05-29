import React from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const TaskModal = ({ task, onClose, onEdit, onRemove, onComplete, successMessage, errorMessage}) => {

  
  const { title, category, importance, comments, status } = task;

  const handleEditClick = () => {

    onEdit(task);
  };

  const handleRemoveClick = () => {
    onRemove(task);
  };

  const handleCompleteClick = () => {
    onComplete(task);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
    <div className="bg-white rounded-lg p-6 text-center relative">
        <button
          className="closeButton absolute top-0 left-0 mt-4 ml-4 text-gray-500 hover:text-gray-700 font-bold"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p>
          <strong>Category:</strong> {category}
        </p>
        <p>
          <strong>Importance:</strong> {importance}
        </p>
        <p>
          <strong>Comments:</strong> {comments}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
            onClick={handleEditClick}
          >
            Edit Task
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            onClick={handleRemoveClick}
          >
            Remove Task
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ml-2"
            onClick={handleCompleteClick}
          >
            Done Task
          </button>
        </div>
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
      </div>
    </div>
  );
};

export default TaskModal;
