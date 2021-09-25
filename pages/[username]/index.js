import React from "react";
import { collection, where, getDocs, orderBy, limit, query as firebaseQuery } from "firebase/firestore";

import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";


// Asynchrons call to pre-render user data and posts on the server
export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username); // Retrieve user object with username from Firebase
  
  // Activate NextJS built in 404 routing
  if (!userDoc) { return { notFound: true }; }

  // JSON serialisable data
  let user = null;
  let posts = [];
  
  // If the user document has been retrieved, grab the posts from the user
  if (userDoc) {
    user = userDoc.data();

    // Modular query for user's most recent 5 posts
    const postsQuery = firebaseQuery(
      collection(userDoc.ref, 'posts'),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    )
    // Grab a snapshot of the query
    const querySnapshot = await getDocs(postsQuery);

    // Map received posts after converting to JSON serialisable data
    querySnapshot.forEach((doc) => posts.push(postToJSON(doc)));
  }

  return {
    props: { user, posts }, // Pass this to the page component as props
  };
}

// Full profile page
export default function UserProfilePage( {user, posts} ) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
