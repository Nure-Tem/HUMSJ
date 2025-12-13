import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5FTfWMZa7EC5z72l_65PY5w6WG-MWPjs",
  authDomain: "humsj-ea-pr.firebaseapp.com",
  projectId: "humsj-ea-pr",
  storageBucket: "humsj-ea-pr.firebasestorage.app",
  messagingSenderId: "1094829097322",
  appId: "1:1094829097322:web:ed9f3238b40dad3c306513",
  measurementId: "G-L9DJQ520BG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
