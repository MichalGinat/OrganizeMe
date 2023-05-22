import { Link, useLocation } from "react-router-dom";
import { useState } from 'react';
import { auth } from '../firebase-config.js';
import {signOut } from "firebase/auth";
import { FaUserCircle } from 'react-icons/fa';

function Navbar() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError('Failed to log out');
    }
  };

  if (isLoginPage) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between bg-gray-500 py-5 px-6">
      {isLoginPage && <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg
          className="fill-current h-8 w-8 mr-2"
          width="54"
          height="54"
          viewBox="0 0 54 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
        </svg>
        <span className="font-semibold text-xl tracking-tight">OrganizeMe</span>
      </div>}
      {!isLoginPage && <Link to="/home">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg
          className="fill-current h-8 w-8 mr-2"
          width="54"
          height="54"
          viewBox="0 0 54 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
        </svg>
        <span className="font-semibold text-xl tracking-tight">OrganizeMe</span>
      </div>
      </Link>}

      <div className="flex items-center ml-auto">
        {!isLoginPage && (
          <>
            <Link to="/profile">
              <FaUserCircle className="text-2xl text-white mr-2" />
            </Link>
            <Link
              onClick={handleLogout}
              to="/"
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-navy hover:bg-slate-400"
            >
              Log out
            </Link>
          </>
        )}
      </div>
      {error && <p className="text-white">{error}</p>}
    </nav>
  );
}


export default Navbar