// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore'; // Add Firestore import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfm_HW0VcD94iH-BEDHr9mtSvBO08J8Eo",
  authDomain: "crafthub-d545c.firebaseapp.com",
  projectId: "crafthub-d545c",
  storageBucket: "crafthub-d545c.firebasestorage.app",
  messagingSenderId: "690225042306",
  appId: "1:690225042306:web:64adce68254ba6da07f59b",
  measurementId: "G-F7YH3X5ZC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app); // Export Firestore instance