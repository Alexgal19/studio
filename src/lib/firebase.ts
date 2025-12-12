// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzjIYeatJRF_-oAlXfwDEfOvzX5fOxgWI",
  authDomain: "tempwork-limit-calculator.firebaseapp.com",
  databaseURL: "https://tempwork-limit-calculator-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tempwork-limit-calculator",
  storageBucket: "tempwork-limit-calculator.appspot.com",
  messagingSenderId: "518416333052",
  appId: "1:518416333052:web:739d3fbbe336a48fb37f79",
  measurementId: "G-47MD300GBJ"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
