import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/profilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import "./App.css"
import CalendarPage from './pages/CalendarPage.jsx';
import TasksByCategories from './pages/TasksByCategories.jsx';
import LoadingComponent from './components/LoadingComponent.jsx';

import { auth } from './firebase-config';

function App() {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleSetUserId = (userId) => {
    localStorage.setItem('userId', userId);
    setUserId(userId);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setIsAuthenticated(true);
        localStorage.setItem('userId', user.uid);
        setUserId(user.uid);
      } else {
        // No user is signed in.
        setIsAuthenticated(false);
        localStorage.removeItem('userId');
        setUserId("");
      }
    });

    return () => unsubscribe(); // Unsubscribe from the listener when the component unmounts
  }, []);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <BrowserRouter>
      <div>
        <Navbar userId={userId} />
        <div className="min-h-screen bg-bg-main-custom">
          <Routes>
            <Route path="/" element={<LoginPage handleSetUserId={handleSetUserId} />} />
            {isAuthenticated ? (
              <>
                <Route path="/Home" element={<HomePage userId={userId} />} />
                <Route path="/profile" element={<ProfilePage userId={userId} />} />
                <Route path="/tasks/byCategory" element={<TasksByCategories userId={userId} />} />
                <Route path="/tasks/byCalendar" element={<CalendarPage userId={userId} />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" replace />} />
            )}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
