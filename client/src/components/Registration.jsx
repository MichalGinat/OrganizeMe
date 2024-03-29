// This code handles user registration functionality. 
// It includes form fields for email and password, validates the input, creates a new user account using Firebase authentication, 
// and displays error and success messages accordingly.

import { useState } from 'react';
import { auth} from '../firebase-config.js';
import { createUserWithEmailAndPassword } from "firebase/auth";
import PropTypes from 'prop-types';
import { FaUserAlt } from 'react-icons/fa';

Registration.propTypes = {
  onSignInClick: PropTypes.func.isRequired,
  onSignUpSuccess: PropTypes.func.isRequired,
};

function Registration(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    setError(null);
    setSuccess(false);

    if (!email && !password) {
      setError('Please enter your email and password.');
      return;
    } 
    
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const uid=user.uid;
      await fetch('/api/signup',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }),
      });
      setError(null);
      setSuccess(true);
      setEmail(''); // Reset email state
      setPassword(''); // Reset password state
      props.onSignUpSuccess()
      props.onSignInClick()
      } catch (error) {
      const errorCode = error.code;
      const errorMessage = firebaseErrorMessages[errorCode] || error.message;
      setError(errorMessage);
      setSuccess(false);
    }
  } 

  // to display custom error messages for firebase errors
  const firebaseErrorMessages = {
    'auth/email-already-in-use': 'Email is already registered. Try another email.',
    'auth/invalid-email': 'Invalid email format. Please enter a valid email.',
    'auth/missing-email': 'Invalid email format. Please enter a valid email.',
    'auth/missing-password': 'Please enter a password.',
    'auth/weak-password': 'Password must be at least 6 characters long.',
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
  }

  return (
    <div className="w-full max-w-sm mx-auto ">
      <form className="bg-white shadow-md rounded px-8 py-6 mb-4">
      <h3 className="text-center text-2xl font-bold mb-4">
      <span className="flex items-center">
        <FaUserAlt className="ps-1 mr-6" /> Create your account
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
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          {success && !error && <p className="text-green-500 text-xs italic">Signed up successfully!</p>}
        </div>
        <div className="flex justify-center items-center mb-6">
          <button onClick={handleRegister} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
            Sign Up
          </button>
        </div>
        <div className="flex justify-center py-2">
          <hr className="border-t-2 w-full"/>
        </div>
        <div className="flex justify-center py-2">
          <p className="text-gray-700 text-sm">Already have an account? <a href="#" className="text-blue-500 hover:text-blue-700" onClick={props.onSignInClick}>Sign in</a></p>
        </div>
      </form>
    </div>
    
      );
}




export default Registration;
