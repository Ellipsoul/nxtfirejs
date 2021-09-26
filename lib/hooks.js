import { auth, firestore } from "../lib/firebase.js";
import { useAuthState } from "react-firebase-hooks/auth"; // User object when signed in, null when signed out
import { doc, onSnapshot } from "firebase/firestore";

import { useEffect, useState } from "react";

// Custom hook to grab user data
export function useUserData() {
  const [user] = useAuthState(auth); // Initialise the user object
  const [username, setUsername] = useState(null); // Initialise username state

  // Listen to all changes to the user object
  useEffect(() => {
    // Turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = doc(firestore, "users", user.uid); // Create reference to user document in firestore
      // Set the username to the one retrieved in firestore
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null); // No user found
    }

    return unsubscribe; // Call unsubscribe when the user doc is no longer needed
  }, [user]);

  return { user, username };
}
