// lib/firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDA2ACwYzqZNtBnkM5tFgZtAgsyb9gbNc8",
  authDomain: "cleope-80cdc.firebaseapp.com",
  projectId: "cleope-80cdc",
  storageBucket: "cleope-80cdc.firebasestorage.app",
  messagingSenderId: "101049745166",
  appId: "1:101049745166:web:f9d506f17fb3f57739a15f",
  measurementId: "G-57VJGES842",
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Ottieni Firestore
const db = getFirestore(app);

// Ottieni Auth
const auth = getAuth(app);

export { db, auth };

