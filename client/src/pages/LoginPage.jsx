import SignIn from '../components/signIn.jsx'
import Registration from '../components/registration.jsx'
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
  }

  const handleSignInClick = () => {
    setIsSigningUp(false);
  }


const handleSignUpSuccess = () => {
  setSignUpSuccess(true);
}

const handleCloseSignUpSuccess = () => {
  setSignUpSuccess(false);
}


return (
    <div>
      {isSigningUp ? 
      <Registration 
      onSignInClick = {handleSignInClick} 
      onSignUpSuccess = {handleSignUpSuccess} /> :
       <SignIn 
        onCloseSignUpSuccess = {handleCloseSignUpSuccess}
        onSignUpSuccess = {signUpSuccess} 
        onSignInSetUserId = {props.handleSetUserId} 
        onSignUpClick = {handleSignUpClick} />}
    </div>
  );
}
  


  export default LoginPage;