// This function handles the rendering and functionality of a login page. 
// It includes the SignIn and Registration components. 
// The component allows users to switch between signing up and signing in and renders the appropriate form. 
// It provides a user-friendly interface for the login process.

import SignIn from '../components/SignIn.jsx';
import Registration from '../components/Registration.jsx';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

LoginPage.propTypes = {
  handleSetUserId: PropTypes.func.isRequired,
};

function LoginPage(props) {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      navigate('/Home');
    }
  }, [navigate]);

  const handleSignUpClick = () => {
    setIsSigningUp(true);
  };

  const handleSignInClick = () => {
    setIsSigningUp(false);
  };

  const handleSignUpSuccess = () => {
    setSignUpSuccess(true);
  };

  const handleCloseSignUpSuccess = () => {
    setSignUpSuccess(false);
  };

  return (
    <div className="container">
      <div className="w-full min-h-screen bg-login bg-center bg-cover bg-no-repeat fixed top-0 left-0">
        <div className="flex justify-start items-center mb-4 px-4 md:px-20">
          <div className="mt-2 text-center md:text-left text-white">
            <h1 className={`text-4xl font-bold leading-normal ${isSigningUp ? 'mx-auto' : ''}`}>
              Task Management
            </h1>
            <p className="text-lg hidden md:block">
              Boost productivity and manage tasks effectively with OrganizeMe.
            </p>
            <p className="text-lg hidden md:block">
              Our intuitive platform simplifies your workflow and enables</p><p className="text-lg hidden md:block"> easy deadline setting and progress tracking.
            </p>
          </div>
        </div>
        
        <div className="w-full max-w-lg px-4 md:px-20 ">
          <div className="max-h-full">
            {isSigningUp ? (
              <Registration onSignInClick={handleSignInClick} onSignUpSuccess={handleSignUpSuccess} />
            ) : (
              <SignIn
                onCloseSignUpSuccess={handleCloseSignUpSuccess}
                onSignInSetUserId={props.handleSetUserId}
                onSignUpSuccess={signUpSuccess}
                onSignUpClick={handleSignUpClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
