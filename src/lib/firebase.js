// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDA2ACwYzqZNtBnkM5tFgZtAgsyb9gbNc8",
  authDomain: "cleope-80cdc.firebaseapp.com",
  projectId: "cleope-80cdc",
  storageBucket: "cleope-80cdc.appspot.com",
  messagingSenderId: "101049745166",
  appId: "1:101049745166:web:f9d506f17fb3f57739a15f",
  measurementId: "G-57VJGES842"
};

// Initialize Firebase app (solo se non è già inizializzato)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta Firestore
export const db = getFirestore(app);