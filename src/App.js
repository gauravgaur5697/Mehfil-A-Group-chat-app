import React, {useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import'firebase/auth';
/* import 'firebase/analytics'; */

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyCIKdEAwMLjY3sOVJMufxST1S13gZjnP_Q",
  authDomain: "mehfil-d5a76.firebaseapp.com",
  databaseURL: "https://mehfil-d5a76.firebaseio.com",
  projectId: "mehfil-d5a76",
  storageBucket: "mehfil-d5a76.appspot.com",
  messagingSenderId: "1096610318877",
  appId: "1:1096610318877:web:2dc81e58ac42427101d4f4",
  measurementId: "G-BQJEVSN7FR"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
/* const analytics = firebase.analytics(); */

function App() {

  const[user] = useAuthState(auth); 

  return (
    <div className="App">
      <header className="App-header">
        <h1>Aur Sab bdiya</h1>
        <SignOut />
      </header>
      
      <section>
        {user ? <ChatBox /> : <SignIn />}
      </section>
      
    </div>
  );
}

/* This is the function for sign in for the user with popup of signInWithGoogle*/

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign In with Google</button>
        <p className="para">Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatBox() {

  const dummy = useRef();
/*  refrence a firebase collection*/
  const messagesRef = firestore.collection('messages');
/*  query document in a collection*/
  const query = messagesRef.orderBy('createdAt').limit(25);
/*  listen to data with a hook*/
  const [messages] = useCollectionData(query, {idField: 'id'}); /*  react to change in real time*/

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    /* Create new document in firestore*/
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)} 
      <div ref={dummy}></div>
    </main>
    
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type Here" />
      <button type="submit" disabled={!formValue}>Send🕊️</button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'; /* conditional CSS*/

  return (
    <>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || ' '} />
      <p>{text}</p>
    </div>
    </>
  )
}

export default App;
