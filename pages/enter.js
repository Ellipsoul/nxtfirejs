import Image from 'next/image';
import React, { createContext } from 'react'
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

import googleIcon from '../public/google.png';
import { UserContext } from '../lib/context';

export default function EnterPage() {
    const {user, username} = createContext(UserContext);

    // Main nav bar
    return (
        <main>
            {user ? 
                (!username ? <UsernameForm /> :  // User signed in but no username
                <SignOutButton />) :             // User signed in and has a username
                <SignInButton />                 // User not signed in
            }
        </main>
    )
}

// Sign in button
function SignInButton() {
    // Asynchronous function that waits for the Google Sign in popup to authenticate a Google signin
    const signInWithGoogle  = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    };

    // Simple button for signing in with Google auth
    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <Image src={googleIcon} alt=""></Image>
            Sign In with Google
        </button>
    );
}

// Sign out button
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>
}

// Form for user to select a username
function UsernameForm() {
    return (
        <main>
            <h1>Username Form</h1>
        </main>
    );
}