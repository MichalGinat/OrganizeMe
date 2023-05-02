// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3VSROeHMsgMQD9UK2dQAX9E-7JiX0egw",
  authDomain: "organizeme-b26e9.firebaseapp.com",
  databaseURL: "https://organizeme-b26e9-default-rtdb.firebaseio.com",
  projectId: "organizeme-b26e9",
  storageBucket: "organizeme-b26e9.appspot.com",
  messagingSenderId: "358226096510",
  appId: "1:358226096510:web:cf3e16e749113b4bd0832f",
  measurementId: "G-4R3JZTDC43"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export { auth };


const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

export { googleAuthProvider}
//firebase login
//firebase init


/*Specify your site in firebase.json
Add your site ID to the firebase.json configuration file. After you get set up, see the best practices for multi-site deployment.*/
// //{
//   "hosting": {
//     "site": "organizeme-71344",

//     "public": "public",
//     ...
//   }
// }

//firebase deploy --only hosting:organizeme-71344
//After deploying, view your app at organizeme-71344.web.app