import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { IoIosCloseCircleOutline } from 'react-icons/io';

ReactModal.setAppElement('#root'); // Set the app root element for accessibility

EditTaskModal.propTypes = {
  task: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
};

function EditTaskModal(props) {
  const [updatedTask, setUpdatedTask] = useState(props.task);
  const [error, setError] = useState('');
  const MAX_TASK_NAME_LENGTH = 30;
  const MAX_COMMENT_LENGTH = 120;

  const handleTaskNameChange = (e) => {
    setUpdatedTask({ ...updatedTask, taskName: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setUpdatedTask({ ...updatedTask, category: e.target.value });
  };

  const handleImportanceChange = (e) => {
    setUpdatedTask({ ...updatedTask, importance: e.target.value });
  };

  const handleCommentsChange = (e) => {
    setUpdatedTask({ ...updatedTask, comments: e.target.value });
  };

  const closeModal = () => {
    setUpdatedTask(props.task);
    setError('');
    props.onClose();
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSaveTask = async () => {
    if (!updatedTask.taskName || !updatedTask.dueDate || !updatedTask.category || !updatedTask.importance) {
      setError('Please fill in all the mandatory fields.');
      return;
    }

    setError('');

    try {
      const response = await fetch(`/api/tasks/UpdateTask/${updatedTask.taskId}?userId=${props.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        props.onSave(updatedTask);
        closeModal();
      } else {
        setError('Failed to update the task.');
      }
    } catch (error) {
      setError('Error updating the task.');
    }
  };

  const handleDueDateChange = (e) => {
    const selectedDate = e.target.value;
    const currentDate = getCurrentDate();
  
    if (selectedDate < currentDate) {
      setError('Please select a future date.');
    } else {
      setUpdatedTask({ ...updatedTask, dueDate: selectedDate });
      setError('');
    }
  };
  
  
  return (
    <ReactModal isOpen={props.isModalOpen} className="modal flex items-center justify-center">
      <div className="modal-content bg-white w-full max-w-md rounded-lg shadow-lg bg-primary">
        <div className="modal-header p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold text-black">Edit Task</h2>
          <button className="close-button">
            <IoIosCloseCircleOutline size={24} className="text-black" onClick={closeModal} />
          </button>
        </div>
        <div className="modal-body p-4">
          <form>
            <div className="mb-4">
              <label htmlFor="taskName" className="form-label text-black">
                Task Name<span className="required-field text-red-400">*</span>
              </label>
              <input
                type="text"
                id="taskName"
                className="form-input border-none focus:border-primary px-2 py-1 bg-gray-100 text-primary w-full"
                value={updatedTask.taskName}
                onChange={handleTaskNameChange}
                maxLength={MAX_TASK_NAME_LENGTH}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dueDate" className="form-label text-black">
                Due Date<span className="required-field text-red-400">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                className="form-input border-none focus:border-primary px-2 py-1 bg-gray-100 text-primary w-full"
                value={updatedTask.dueDate}
                onChange={handleDueDateChange}
                min={getCurrentDate()}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="form-label text-black">
                Category<span className="required-field text-red-400">*</span>
              </label>
              <select
                id="category"
                className="form-select border-none focus:border-primary px-2 py-1 bg-gray-100 text-primary w-full"
                value={updatedTask.category}
                onChange={handleCategoryChange}
                required
              >
                <option value="" disabled>Please choose from the list</option>
                <option value="work">Work</option>
                <option value="school">School</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="importance" className="form-label text-black">
                Importance<span className="required-field text-red-400">*</span>
              </label>
              <select
                id="importance"
                className="form-select border-none focus:border-primary px-2 py-1 bg-gray-100 text-primary w-full"
                value={updatedTask.importance}
                onChange={handleImportanceChange}
                required
              >
                <option value="" disabled>Please choose from the list</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="comments" className="form-label text-black">
                Comments
              </label>
              <textarea
                id="comments"
                className="form-input border-none focus:border-primary px-2 py-1 bg-gray-100 text-primary w-full resize-none"
                value={updatedTask.comments}
                onChange={handleCommentsChange}
                maxLength={MAX_COMMENT_LENGTH}
              ></textarea>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
        <div className="modal-footer p-4 flex justify-end">
          <button className="btn-primary btn bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md" onClick={handleSaveTask}>
            Save
          </button>
        </div>
      </div>
    </ReactModal>
  );
}

export default EditTaskModal;
