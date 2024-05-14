// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB07BRcjXcZ5iNiu-Ag2_1GlmTRH5IRynk",
  authDomain: "connect-sync-6a666.firebaseapp.com",
  projectId: "connect-sync-6a666",
  storageBucket: "connect-sync-6a666.appspot.com",
  messagingSenderId: "754598655394",
  appId: "1:754598655394:web:bf463a20d7dc5f41a22efb",
  measurementId: "G-CDQWSZJ3KF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);