// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPoyQwFQcBWWSnkKmRjn4Lr8uYp46438k",
  authDomain: "dtexchange-9c535.firebaseapp.com",
  projectId: "dtexchange-9c535",
  storageBucket: "dtexchange-9c535.appspot.com",
  messagingSenderId: "257563657641",
  appId: "1:257563657641:web:f5e11e52583a3060cdb0b8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
