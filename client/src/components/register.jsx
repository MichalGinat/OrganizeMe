import { useState } from 'react';
import { auth} from '../firebase-config.js';
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
      setError(null);
      setSuccess(true);
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
    'auth/missing-password': 'Please enter a password.',
    'auth/weak-password': 'Password must be at least 6 characters long.',
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
  }

  return (
    <form onSubmit={handleRegister}>
      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Register</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && !error && <p style={{color: 'green'}}>Signed up successfully!</p>}
    </form>
  );
}

export default Register;