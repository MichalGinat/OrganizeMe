import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/profilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import "./App.css"
import CalendarPage from './pages/CalendarPage.jsx';
import TasksByCategories from './pages/TasksByCategories.jsx';
import LoadingComponent from './components/LoadingComponent.jsx';

function App() {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleSetUserId = (userId) => {
    localStorage.setItem('userId', userId);
    setUserId(userId);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    setIsLoading(false);
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Navbar userId={userId} />
        <div className="min-h-screen bg-bg-main-custom">
          <Routes>
            <Route path="/" element={<LoginPage handleSetUserId={handleSetUserId} />} />
            <Route path="/Home" element={isLoading ? <LoadingComponent /> : <HomePage userId={userId} />} />
            <Route path="/profile" element={isLoading ? <LoadingComponent /> : <ProfilePage userId={userId} />} />
            <Route path="/tasks/byCategory" element={isLoading ? <LoadingComponent /> : <TasksByCategories userId={userId} />} />
            <Route path="/tasks/byCalendar" element={isLoading ? <LoadingComponent /> : <CalendarPage userId={userId} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}



export default App;
