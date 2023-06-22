// The "ProfilePage" displays a user's profile information and task statistics. 
// It fetches user data based on the "userId" prop and calculates task statistics such as the number of active, not finished, and done tasks. 
// The component includes options to select the year for which the statistics are shown.

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';
import { SpinningCircles } from 'react-loading-icons';
import { UserCircleIcon, MailIcon} from '@heroicons/react/solid';

ProfilePage.propTypes = {
  userId: PropTypes.string.isRequired,
};

function ProfilePage(props) {
  const [userData, setUserData] = useState(null);
  const [activeTasksCount, setActiveTasksCount] = useState(0);
  const [notFinishedTasksCount, setNotFinishedTasksCount] = useState(0);
  const [doneTasksCount, setDoneTasksCount] = useState(0);
  const [taskCategories, setTaskCategories] = useState([]);
  const [selectedYearTasks, setSelectedYearTasks] = useState(new Date().getFullYear());
  const [selectedYearCategories, setSelectedYearCategories] = useState(new Date().getFullYear());
  const [totalTasksCount, setTotalTasksCount] = useState(0);

  const currentYear = new Date().getFullYear();
  const yearsWithAssignments = [currentYear, currentYear - 1];

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const response = await fetch(`/api/user/profile?userId=${props.userId}`);
        const data = await response.json();
        setUserData((prevUserData) => ({ ...prevUserData, ...data, displayName: user.displayName }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName;
        const email = user.email; // Retrieve the email from Firebase user object
        setUserData((prevUserData) => ({ ...prevUserData, displayName, email }));
        fetchUserData(user);
      }
      return () => unsubscribe();
    });

    return () => unsubscribe(); // Unsubscribe from the auth state change listener when component unmounts
  }, [props.userId]);

  useEffect(() => {
    if (userData && userData.tasks) {
      calculateStatistics(userData.tasks);
    }
  }, [userData, selectedYearTasks]);

  const calculateStatistics = (tasks) => {
    // Filter tasks based on the selected year
    const tasksThisYear = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate.getFullYear() === selectedYearTasks;
    });

    // Calculate the statistics based on the tasks data
    const activeTasks = tasksThisYear.filter((task) => task.status === 'Active');
    const notFinishedTasks = tasksThisYear.filter((task) => task.status === 'Not Finished');
    const doneTasks = tasksThisYear.filter((task) => task.status === 'Done');

    setActiveTasksCount(activeTasks.length);
    setNotFinishedTasksCount(notFinishedTasks.length);
    setDoneTasksCount(doneTasks.length);

    const categories = [...new Set(tasks.map((task) => task.category))];
    setTaskCategories(categories);

    setTotalTasksCount(tasksThisYear.length); // Update the total tasks count for the current year
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-full">
        <SpinningCircles width={50} height={50} color="#4B5563" />
      </div>
    );
  }

  // Prepare the chart data for task statistics
  const pieChartData = {
    labels: ['Active Tasks', 'Not Finished Tasks', 'Done Tasks'],
    datasets: [
      {
        data: [activeTasksCount, notFinishedTasksCount, doneTasksCount],
        backgroundColor: ['#10B981', '#EF4444', '#6B7280'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare the chart data for task categories statistics
  const categoriesChartData = {
    labels: taskCategories.map((category) => category),
    datasets: [
      {
        label: `Tasks by Category (${selectedYearCategories})`,
        data: taskCategories.map((category) => {
          const tasksByCategory = userData.tasks.filter(
            (task) => task.category === category && new Date(task.dueDate).getFullYear() === selectedYearCategories
          );
          return tasksByCategory.length;
        }),
        backgroundColor: [
          '#FF6384', // Color for "Work"
          '#36A2EB', // Color for "Personal"
          '#FFCE56', // Color for "School"
          '#4BC0C0', // Color for "Other"
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  const maxDataValue = Math.max(...categoriesChartData.datasets[0].data);
  const stepSize = Math.ceil(maxDataValue / 5);
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxDataValue + stepSize,
        stepSize: stepSize,
      },
    },
  };

  return (
    <div className="flex justify-center items-center h-full pt-4">
      <div className="lg:w-3/4 p-10 rounded-md shadow-md bg-white">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Personal Data</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-100 rounded-md shadow-2xl border border-gray-300  p-4">
            <h2 className="sm:text-sm md:text-2xl font-semibold mb-4">User Information</h2>
            {userData.displayName && (
              <p>
              <UserCircleIcon className="w-5 h-5 inline-block mr-2 text-gray-500" />
              <span className="font-semibold">Name:</span> {userData.displayName}
              </p>
            )}
            <p>
            <MailIcon className="w-5 h-5 inline-block mr-2 text-gray-500" />
            <span className="font-semibold">Email:</span> {userData.email}
            </p>
          </div>  
          <div className="bg-gray-100 rounded- shadow-2xl border border-gray-300 p-4">
            <div className="flex-1">
              <h3 className="sm:text-sm md:text-2xl font-semibold mb-4">Tasks Statistics</h3>
              <div className="flex items-center space-x-2">
                <p className="text-gray-500">Selected Year:</p>
                <select
                  id="yearSelectTasks"
                  className="p-2 border rounded-md"
                  value={selectedYearTasks}
                  onChange={(e) => setSelectedYearTasks(parseInt(e.target.value))}
                >
                  {yearsWithAssignments.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <p className="pt-2 pb-2">
                <span className="font-semibold">Total Tasks ({selectedYearTasks}):</span> {totalTasksCount}
              </p>
            </div>
            {activeTasksCount + notFinishedTasksCount + doneTasksCount > 0 ? (
              <div className="flex justify-center">
                <Pie data={pieChartData} />
              </div>
            ) : (
              <p>No tasks found for the selected year.</p>
            )}
          </div>
          <div className="bg-gray-100 rounded-md shadow-2xl border border-gray-300 p-4">
          <h2 className="sm:text-sm md:text-2xl font-semibold mb-4">Tasks by Categories</h2>
            <div className="flex items-center space-x-2 mb-4">
              <p className="text-gray-500">Selected Year:</p>
              <select
                id="yearSelectCategories"
                className="p-2 border rounded-md"
                value={selectedYearCategories}
                onChange={(e) => setSelectedYearCategories(parseInt(e.target.value))}
              >
                {yearsWithAssignments.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {selectedYearCategories === currentYear && taskCategories.length === 0 && (
              <p>No tasks found for the selected year.</p>
            )}

            {selectedYearCategories !== currentYear && (
              <p>No tasks found for the selected year.</p>
            )}

            {selectedYearCategories === currentYear && taskCategories.length > 0 && (
              <div className="flex justify-center">
                <Bar data={categoriesChartData} options={chartOptions} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
