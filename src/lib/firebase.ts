// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsZ_E60Nrrpr0qEaU4JY_-Dw1Cc0JD34o",
  authDomain: "studio-4801889514-40ebd.firebaseapp.com",
  databaseURL: "https://studio-4801889514-40ebd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "studio-4801889514-40ebd",
  storageBucket: "studio-4801889514-40ebd.firebasestorage.app",
  messagingSenderId: "1030946691328",
  appId: "1:1030946691328:web:1cf467b71905b8fea6fbe5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
