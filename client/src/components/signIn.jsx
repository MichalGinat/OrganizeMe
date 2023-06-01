/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from '../firebase-config.js';
import PropTypes from 'prop-types';
import { useNavigate} from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';


SignIn.propTypes = {
  onSignUpClick: PropTypes.func.isRequired,
  onSignUpSuccess: PropTypes.bool.isRequired,
  onCloseSignUpSuccess: PropTypes.func.isRequired,
  onSignInSetUserId: PropTypes.func.isRequired,
};

function SignIn(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    props.onCloseSignUpSuccess()
    if (!email || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      props.onSignInSetUserId(user.uid)
      navigate("/Home");
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setErrorMessage("Sorry, we couldn't find an account with that email address. Please double-check your email and try again.");
          break;
        case 'auth/wrong-password':
          setErrorMessage('Oops! The password you entered is incorrect. Please try again.');
          break;
        default:
          if (error.code === 'auth/invalid-email') {
          setErrorMessage('Invalid email address. Please enter a valid email and try again.');
        } else {
          setErrorMessage('Sorry, something went wrong. Please try again later.');
        }
      }
    }
  };

  const handleGoogleSignIn = async (event) => {
    event.preventDefault();
    props.onCloseSignUpSuccess()
    try {
      const { user } = await signInWithPopup(auth, googleAuthProvider);
      const metadata = user.metadata;
      const uid=user.uid;
      props.onSignInSetUserId(user.uid)
      if (metadata.creationTime === metadata.lastSignInTime) {
        await fetch('/api/signup',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid }),
        });
        // Perform any actions specific to first-time login
      } else {
        // Perform any actions for returning users
      }
      navigate("/Home");
    } catch (error) {
      setErrorMessage('Failed to sign in with Google');
    }
  };

  const moveSignUp = () =>{
    props.onCloseSignUpSuccess();
     props.onSignUpClick();
  };

  return (
<div>
{props.onSignUpSuccess  && (
  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
    <div className="flex">
      <div className="py-1">
        <svg className="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
        </svg>
      </div>
      <div>
        <p className="font-bold">Signed up successfully!</p>
        <p className="text-sm">You can now sign in using your new account.</p>
      </div>
    </div>
  </div>
)}
  <form className="bg-white shadow-md rounded px-8 py-6 mb-4">
  <h3 className="text-center text-2xl font-bold mb-4">
  <span className="flex items-center">
    <FaUserAlt className="ps-1 mr-6" /> Log in to your account
  </span>
  </h3>
   <div className="flex flex-col mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="email">
        Email:
      </label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:border-cyan-950 focus:outline-none focus:shadow-outline" id="email" placeholder="ex: myname@example.com"/>
    </div>
    <div className="flex flex-col mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="password">
        Password:
      </label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:border-cyan-950 focus:outline-none focus:shadow-outline" id="password" placeholder="******"/>
    </div>
    <div className="flex py-0.5 justify-between items-center mb-6">
    {errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}
    </div>
    <div className="flex justify-center mb-6">
      <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
        Login 
      </button>
    </div>
    <div className="flex justify-center mb-4">
      <hr className="border-t-2 w-full"/>
      <div className="absolute -mt-3 bg-white px-3 text-gray-500 text-xs">or</div>
    </div>
    <div className="flex justify-center mb-6">
      <button onClick={handleGoogleSignIn}>
        <img src="./src/assets/btn_google_signin_light_normal_web.png" alt="Sign in with Google"/>
      </button>
    </div>
    <div className="flex justify-center py-2">
      <hr className="border-t-2 w-full"/>
    </div>
    <div className="flex justify-center py-2">
      <p className="text-gray-700 text-sm">Don't have an account? <a href="#" className="text-blue-500 hover:text-blue-700" onClick={moveSignUp}>Sign up</a></p>
    </div>
  </form>
</div>



  );
}

export default SignIn;

