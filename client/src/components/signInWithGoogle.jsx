import { useState } from 'react';
import { auth, googleAuthProvider } from '../firebase-config.js';
import {signInWithPopup } from "firebase/auth";

function SignInWithGoogle() {
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      setError('Failed to sign in with Google');
    }
  };

  return (

    <div>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default SignInWithGoogle;


