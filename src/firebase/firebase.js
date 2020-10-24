import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBg11NRzKsUTCN__XK-cAuxMKghQfXehy0",
  authDomain: "phonelink-a3697.firebaseapp.com",
  databaseURL: "https://phonelink-a3697.firebaseio.com",
  projectId: "phonelink-a3697",
  storageBucket: "phonelink-a3697.appspot.com",
  messagingSenderId: "576449989037",
  appId: "1:576449989037:web:fd02f5aaf4c455d8fc7924",
  measurementId: "G-3F0LKGFH3G"
};

firebase.initializeApp(firebaseConfig)
export let auth = firebase.auth()
export let provider = new firebase.auth.GoogleAuthProvider();
export let db = firebase.database()