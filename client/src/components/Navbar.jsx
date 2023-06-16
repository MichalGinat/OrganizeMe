import { Link, useLocation } from "react-router-dom";
import { useState } from 'react';
import { auth } from '../firebase-config.js';
import {signOut } from "firebase/auth";
import { FaUserCircle , FaTasks } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { MdLogout } from 'react-icons/md';


Navbar.propTypes = {
  userId: PropTypes.string.isRequired,
};

function Navbar(props) {
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
        <FaTasks className="text-3xl text-white mr-2" />
        <span className="font-semibold text-xl tracking-tight">OrganizeMe</span>
      </div>}
      {!isLoginPage && <Link to="/home">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <FaTasks className="text-3xl text-white mr-2" />
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
              className="inline-flex items-center text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-navy hover:bg-slate-400 sm:mt-0 sm:ml-2"
>
            <MdLogout className="md:mr-2" size={24} />

            <span className="hidden sm:inline">Log Out</span>
              
            </Link>
          </>
        )}
      </div>
      {error && <p className="text-white">{error}</p>}
    </nav>
  );
}


export default Navbar
