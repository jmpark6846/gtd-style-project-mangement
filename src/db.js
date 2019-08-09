import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqduE_utZshqWZJpzWck3hWazO8cyheDA",
  authDomain: "projects-2ec8d.firebaseapp.com",
  databaseURL: "https://projects-2ec8d.firebaseio.com",
  projectId: "projects-2ec8d",
  storageBucket: "",
  messagingSenderId: "925452091281",
  appId: "1:925452091281:web:8d54d9ce3c18971a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
export const auth = firebase.auth();
export const db = firebase.database();
export const todosRef = db.ref('todos')