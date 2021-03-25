import logo from './logo.svg';
import './App.css';
import firebaseConfig from './config/credentials.json';
import Login from './components/Login';
import Home from './components/Home';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);
  
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  const signOut = () => {
    return auth.signOut();
  }

  return (
    <div className="App">
      <header>

      </header>
      <section>
        {user ? <Home onSignOut={signOut} myFirestore={firestore} authUser={user} /> :
        <Login onLogin={signInWithGoogle} />}
      </section>
    </div>
  );
}

export default App;
