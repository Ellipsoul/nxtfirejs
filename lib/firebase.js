import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, getDocs, collection, query, where, limit, Timestamp, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Config authentication files from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyC5v0c9bRrJISa0VS2wAt4wkGdoSmS-5VI",
  authDomain: "nxtfire-js.firebaseapp.com",
  projectId: "nxtfire-js",
  storageBucket: "nxtfire-js.appspot.com",
  messagingSenderId: "274686905141",
  appId: "1:274686905141:web:c868c34f265852989c9a7c",
  measurementId: "G-9CS3Q7HPQG",
};

// Initialise the app (ensure it only occurs onece)
const app = initializeApp(firebaseConfig);

// Set up auth, firestore and storage
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider(); // Provider allowing for Google Sign In

export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Get a Firebase timestamp from milliseconds
export const fromMillis = Timestamp.fromMillis;
export const timestamp = serverTimestamp();

// Reusable function to retrieve the user object from the username
export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, "users");  // Grab a reference to the users collection in firestore

  // Make a query for the user with the target username
  const q = query(usersRef, where("username", "==", username), limit(1));
  const userDoc = await getDocs(q);  // Retrieve results of query

  // Important! This is an object, and we can grab it's documents like this
  return userDoc.docs[0];
}

// Converts firestore document to JSON format
export function postToJSON(doc) {
  const data = doc.data();

  return {
    ...data,
    // Firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
