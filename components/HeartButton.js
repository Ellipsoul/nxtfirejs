import { firestore, auth } from '../lib/firebase';

import { doc, getDoc, writeBatch, increment } from '@firebase/firestore';
import { useEffect, useState } from 'react';

// Allow users to heart a post
export default function HeartButton({ postRef }) {

  const [heartDoc, setHeartDoc] = useState(null);  // Track the heart document state

  // Listen to a heart document for a currently logged in user
  const heartRef = doc(postRef, 'hearts', auth.currentUser.uid);
  
  const asyncGetDoc = async ref => {
    const d = await getDoc(ref);
    return d
  }

  // Get the heart document in a painfully asynchronous way
  useEffect(() => {
    asyncGetDoc(heartRef).then((res) => setHeartDoc(res.data()));
  }, [heartRef]);

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(firestore);

    // Add a heart to the heart count, then add the uid to the heart document
    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });
    
    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = writeBatch(firestore);

    // Decrement the heart count, then remove the uid document
    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  // If there is a heart document allow the User to heart or unheart post
  return heartDoc?.exists ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );

}