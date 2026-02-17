import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

export const auth = getAuth(app); 
export const db = getFirestore(app);