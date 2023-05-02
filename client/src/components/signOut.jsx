import { useState } from 'react';
import { auth } from '../firebase-config.js';
import {signOut } from "firebase/auth";

function SignOut() {
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError('Failed to log out');
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default SignOut;