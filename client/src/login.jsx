import SignIn from './components/signIn.jsx'
import Register from './components/register.jsx'
import SignOut from './components/signOut.jsx'
import SignInWithGoogle from './components/signInWithGoogle.jsx'

function LoginPage() {
    return  (<><div><Register></Register></div><div><SignIn></SignIn></div><div><SignOut></SignOut></div><div><SignInWithGoogle></SignInWithGoogle></div></>);
  }
  
  export default LoginPage;