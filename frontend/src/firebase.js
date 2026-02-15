// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADUfGITo7lvQvZT-ho7Kpmd-Q9qPY8DDU",
  authDomain: "riti-1f65f.firebaseapp.com",
  projectId: "riti-1f65f",
  storageBucket: "riti-1f65f.firebasestorage.app",
  messagingSenderId: "388991690438",
  appId: "1:388991690438:web:13872d761632d898cc99c7",
  measurementId: "G-R97S02XNHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);