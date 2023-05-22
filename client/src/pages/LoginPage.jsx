import SignIn from '../components/signIn.jsx';
import Registration from '../components/registration.jsx';
import { useState } from 'react';
import PropTypes from 'prop-types';

LoginPage.propTypes = {
  handleSetUserId: PropTypes.func.isRequired,
};

function LoginPage(props) {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

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
<div className="w-full min-h-screen bg-login bg-center bg-cover bg-no-repeat fixed top-0 left-0">
  <div className="flex justify-start items-center mb-4 px-4 md:px-20">
    <div className="mt-2 text-left text-white">
      <h1 className="text-5xl font-bold leading-normal">Task Management</h1>
      <p className="text-lg">Boost productivity and manage tasks effectively with OrganizeMe.</p>
      <p className="text-lg">Our intuitive platform simplifies your workflow and</p>
      <p className="text-lg">enables easy deadline setting and progress tracking.</p>
    </div>
  </div>

  <div className="w-full max-w-md mr-auto pl-4 md:pl-20 mt-8">
    {isSigningUp ? (
      <Registration onSignInClick={handleSignInClick} onSignUpSuccess={handleSignUpSuccess} />
    ) : (
      <SignIn onCloseSignUpSuccess={handleCloseSignUpSuccess} onSignInSetUserId = {props.handleSetUserId} onSignUpSuccess={signUpSuccess} onSignUpClick={handleSignUpClick} />
    )}
  </div>
</div>


  );
}

  


  export default LoginPage;
