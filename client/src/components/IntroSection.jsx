// Displays the introduction section of a task management website.
// It includes a heading, paragraph, and a grid with three columns representing different features: adding tasks, 
// viewing tasks by categories, and viewing tasks through a calendar.
// It uses links for navigation and accepts a prop for handling the "Add Task" button click.

import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { AiOutlineCalendar, AiOutlineAppstore } from 'react-icons/ai';

function IntroSection({ handleAddTaskClick }) {
  return (
    <>
      <h1 className="text-4xl font-bold mt-20 mb-4 text-center">Welcome to our Task Management Website</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Easily manage your tasks with our intuitive and powerful task management platform.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl mb-4">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-300 p-4 flex flex-col justify-between items-center">
          <div>
            <h3 className="text-lg font-bold mb-2 text-center">Add New Task</h3>
            <p className="text-sm">Add a new task to your task list.</p>
          </div>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mt-2 w-full"
            onClick={handleAddTaskClick}
          >
            <FiPlus className="inline-block mr-2" />
            Add Task
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-2xl border border-gray-300 p-4 flex flex-col justify-between items-center">
          <div>
            <h3 className="text-lg font-bold mb-2 text-center">View Tasks by Categories</h3>
            <p className="text-sm">
              Here you can see all your tasks according to the different categories you have sorted.
              You can also add and delete tasks and filter them by the different categories.
            </p>
          </div>
          <Link
            to="/tasks/byCategory"
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mt-2 w-full flex items-center justify-center"
          >
            <AiOutlineAppstore className="text-xl mr-2" />
            Tasks by Categories
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-2xl border border-gray-300 p-4 flex flex-col justify-between items-center">
          <div>
            <h3 className="text-lg font-bold mb-2 text-center">View Tasks through Calendar</h3>
            <p className="text-sm">
              Here you can see all your tasks arranged in a calendar.
              You can also add and delete tasks and navigate through the calendar to view different dates.
            </p>
          </div>
          <Link
            to="/tasks/byCalendar"
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded mt-2 w-full flex items-center justify-center"
          >
            <AiOutlineCalendar className="text-xl mr-2" />
            View Calendar
          </Link>
        </div>
      </div>
    </>
  );
}

export default IntroSection;
