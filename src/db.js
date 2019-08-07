import firebase from "firebase/app";
import "firebase/database"
import "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBXwdHvxjv97Bji0uVpjGCXLZUgV9l8qDU",
  authDomain: "codeshare-635c5.firebaseapp.com",
  databaseURL: "https://codeshare-635c5.firebaseio.com",
  projectId: "codeshare-635c5",
  storageBucket: "codeshare-635c5.appspot.com",
  messagingSenderId: "402307993297",
  appId: "1:402307993297:web:a417266cbf614623"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase
export const auth = firebase.auth();
export const db = firebase.database();
