import { useState } from 'react';
import { firestore, fromMillis, postToJSON } from '../lib/firebase';
import { where, orderBy, limit, query, getDocs, collectionGroup } from 'firebsae/firestore';

import PostFeed from '../components/PostFeed';
import Loader from '../components/Loader';

/*
Root directory containing a list of user posts
Server-side render 10 most recent posts, then request client side paginated query for 5 new posts at a time
*/

const LIMIT = 1  // Number of posts for each batch

export async function getServerSideProps(context) {
  // Grab all published posts from all users
  // TODO: Currently collectionGroup is not supported in modular implementation
  const allPostsCollection = collectionGroup(firestore, "posts");

  // Query for all posts from all users
  const postsQuery = query(allPostsCollection.ref,
    where("published", "==", true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT)
  )
  const querySnapshot = await getDocs(postsQuery);  // Execute query and grab a snapshot

  // Process new posts (do this later)
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });

  // Namespaced implementation 
  // const postsQuery = firestore
  //   .collectionGroup('posts')
  //   .where('published', '==', true)
  //   .orderBy('createdAt', 'desc')
  //   .limit(LIMIT)
  
  // const posts = (await postsQuery.get()).docs.map(postToJSON)  // Execute the query and map it to posts

  return {
    props: { posts },
  };
}

export default function Home(props) {

  const [posts, setPosts] = useState(props.posts)    // Track state of all posts
  const [loading, isLoading] = useState(false);      // Track whether new posts are loading in
  const [postsEnd, setPostsEnd] = useState(false);   // Track whether all posts have been loaded

  // Grab more user posts on request
  const getMorePosts = async () => {
    isLoading(true);  // Acknowledge loading

    const last = posts[posts.length - 1]  // Grab last post

    // Take the timestamp of the last post, depending on whether it was retrieved client or server side
    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    // TODO: Wait for a solution or wait for Google to update its collection group modular syntax!
    // This is currently in namespaced syntax
    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    // Excute the query
    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));  // Append the new posts to the current list
    setLoading(false);                 // Stop the loading bar

    if (newPosts.length < LIMIT) { setPostsEnd(true); }  // Reached the end of all posts
  }


  return (
    <main>
      {/* Post Feed of all posts */}
      <PostFeed posts={posts} />
      {/* Option to load more posts if there are more */}
      {!loading && !postsEnd ? <button onClick={getMorePosts}>Load More!</button> : null}
      <Loader show={loading} />
      {/* Inform user if end of posts list has been reached */}
      {postsEnd ? <div>You have reached the end!</div> : null}
    </main>
  )
}
