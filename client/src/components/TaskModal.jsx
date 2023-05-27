import React from 'react';
import PropTypes from 'prop-types';

const TaskModal = ({ task, onClose, onEdit, onRemove }) => {
  const { title, category, importance, comments, status } = task;

  const handleEditClick = () => {
    onEdit(task);
  };

  const handleRemoveClick = () => {
    onRemove(task);
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
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mr-2"
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
        </div>
      </div>
    </div>
  );
};

TaskModal.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    importance: PropTypes.string.isRequired,
    comments: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default TaskModal;
