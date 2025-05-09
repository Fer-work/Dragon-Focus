import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKd0eFyzHT-3TvNNZs2lg6X5u8YPf7n9c",
  authDomain: "dragon-focus.firebaseapp.com",
  projectId: "dragon-focus",
  storageBucket: "dragon-focus.firebasestorage.app",
  messagingSenderId: "375375444745",
  appId: "1:375375444745:web:6ee18d56439e813a1ff1d8",
  measurementId: "G-ET1BTJTHHG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
