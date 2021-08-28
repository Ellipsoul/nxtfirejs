import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

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
if (!firebase.apps.length) {
    const app = firebase.initializeApp(firebaseConfig);
}

// Set up auth, firestore and storage
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
