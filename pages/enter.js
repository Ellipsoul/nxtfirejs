import Image from 'next/image';
import React, { useContext, useCallback, useEffect, useState } from 'react'
import { auth, googleAuthProvider, firestore } from '../lib/firebase.js';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, writeBatch } from "firebase/firestore";

import debounce from 'lodash.debounce';

// import googleIcon from '../public/google.png';
import { UserContext } from '../lib/context.js';
import Metatags from '../components/Metatags.js';

export default function EnterPage() {
    const { user, username } = useContext(UserContext);

    // Main nav bar
    return (
        <main>
            <Metatags title="NextFire - Sign In/Out" />
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
            {/* <Image src="/public/google.png" alt="Google Icon" layout="fill"></Image> */}
            <span className="left-margin">Sign In with Google</span>
        </button>
    );
}

// Sign out button
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>
}

// Form for user to select a username
function UsernameForm() {
    const [formValue, setFormValue] = useState('');  // Value user is typingi 
    const [isValid, setIsValid] = useState(false);   // Whether the username is free
    const [loading, setLoading] = useState(false)    // True when checking for the username

    const { user, username } = useContext(UserContext);  // Grab the user and username

    const onSubmit = async (e) => {
        e.preventDefault();
    
        // Create refs for both documents
        const userDoc = doc(firestore, 'users', user.uid);
        const usernameDoc = doc(firestore, 'usernames', formValue);
    
        // Commit both docs together as a batch write.
        const batch = writeBatch(firestore);
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });
    
        await batch.commit();
    };

    // Check validity of username whenever it changes
    useEffect(() => {
        checkUsername(formValue);
    }, [formValue, checkUsername]);

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {  // Only check for sufficiently long usernames
                const ref = doc(firestore, 'usernames', username); // Create reference to user document in firestore
                const docSnap = await getDoc(ref);                 // Snapshot of document reference
                console.log('Firestore read executed!');
                setIsValid(!docSnap.exists());                     // exists() new modular syntax
                setLoading(false);                                 // Stop checking
            }
        }, 500),  // Only start checking 500ms after user stop writing to prevent too many reads
        []
    );

    // Track changes in the form input
    const onChange = (e) => {
        const val = e.target.value.toLowerCase();  // Grab form value
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;  // Only allow valid characters

        // Name still too short
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        // Name passes the regex test, start checking
        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }

    }

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
                {/* Simple message on username status */}
                <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                {/* Submit button that is disabled if form is not valid */}
                <button type="submit" className="btn-green" disabled={!isValid}>
                    Choose
                </button>
        
                {/* To observe username checking behaviour */}
                <h3>Debug State</h3>
                <div>
                    Username: {formValue}
                    <br />
                    Loading: {loading.toString()}
                    <br />
                    Username Valid: {isValid.toString()}
                </div>
                </form>
            </section>
        )
    );
}


function UsernameMessage({ username, isValid, loading }) {
    if (username.length === 0) {
        return <p className="text-neutral">Please enter a username</p>
    } else if (username.length < 3) {
        return <p className="text-danger">That username is too short!</p>
    } else if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        return <p></p>;
    }
}