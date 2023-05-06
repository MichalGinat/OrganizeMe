import SignIn from '../components/signIn.jsx'
import Registration from '../components/registration.jsx'
import { useState } from 'react';

// import SignOut from '../components/signOut.jsx'
// import SignInWithGoogle from '../components/signInWithGoogle.jsx'

function LoginPage() {
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignUpClick = () => {
    setIsSigningUp(true);
  }

  const handleSignInClick = () => {
    setIsSigningUp(false);
  }

  return (
    <div>
      {isSigningUp ? <Registration onSignInClick={handleSignInClick} /> : <SignIn onSignUpClick={handleSignUpClick} />}
    </div>
  );
}
  
  export default LoginPage;