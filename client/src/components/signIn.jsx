import { useState } from 'react';
import { auth } from '../firebase-config.js';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
          setErrorMessage('Sorry, something went wrong. Please try again later.');
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </form>
  );
}

export default SignIn;

