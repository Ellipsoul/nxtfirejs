import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Config authentication files from Firebase console
const firebaseConfig = {
    apiKey: "AIzaSyC5v0c9bRrJISa0VS2wAt4wkGdoSmS-5VI",
    authDomain: "nxtfire-js.firebaseapp.com",
    projectId: "nxtfire-js",
    storageBucket: "nxtfire-js.appspot.com",
    messagingSenderId: "274686905141",
    appId: "1:274686905141:web:c868c34f265852989c9a7c",
    measurementId: "G-9CS3Q7HPQG"
};

// Initialise the app (ensure it only occurs onece)
const app = initializeApp(firebaseConfig);

// Set up auth, firestore and storage
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();  // Provider allowing for Google Sign In

export const firestore = getFirestore(app);
export const storage = getStorage(app);


