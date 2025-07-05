// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const firebaseConfig = {
   apiKey: "AIzaSyDzle99Baq5rfXGihyDURzUrV-WWh378o4",
  authDomain: "splitwisee-project.firebaseapp.com",
  projectId: "splitwisee-project",
  storageBucket: "splitwisee-project.firebasestorage.app",
  messagingSenderId: "927559959765",
  appId: "1:927559959765:web:b85b4c89673a590de60e5c",
  measurementId: "G-8TLG9Q1RH9"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/* re‑export helpers so every module uses the SAME copy */
export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
};

// 🔐  paste your project’s keys here



