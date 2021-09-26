import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';

import { firestore, auth, timestamp } from '../../lib/firebase';

import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { collection, doc, query, getDocs, setDoc, orderBy } from '@firebase/firestore';

import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';


// Post management page where a user can view, edit and create posts
export default function AdminPostsPage(props) {
    return (
        <main>
            <Head>
              <title>NexFire - Admin &#128272;</title>
            </Head>
            {/* AuthCheck component protects all admin features from unauthenticated users */}
            <AuthCheck>
                {/* Option to create a new post */}
                <CreateNewPost />
                {/* Posts that the user have already created */}
                <PostList />
            </AuthCheck>
        </main>
    )
}


// A list of the currently already created user posts
function PostList() {
  const [posts, setPosts] = useState([])

  // Run this only once when the component loads, ensures the posts are actually retrieved
  useEffect(() => {
    // Grab all the posts authored by the user with a firebase query
    const userPosts = collection(firestore, 'users', auth.currentUser.uid, 'posts');
    const q = query(userPosts, orderBy('createdAt'))

    let ayncGetDocs = async q => getDocs(q);  // Define the async function the retrieves the post docs
    const p = []                              // Temporary array that stores the posts
    
    // Execute the asynchronous function with the query
    ayncGetDocs(q).then((res) => {
      const postResults = res.docs;                      // Grab posts from the docs key/attribute
      postResults.forEach(post => p.push(post.data()));  // Append to the temporary posts variable 
      setPosts(p);                                       // Set the final posts array once
    }, 
  )}, []);

  return (
    <>
      <h1>Manage your Posts</h1>
      {/* Mapping once again to the post feed component */}
      <PostFeed posts={posts} admin />
    </>
  );

}


// Allows user to create a post
function CreateNewPost() {
  const router = useRouter();                               // Create a next router
  const { username } = useContext(UserContext);             // Grab just the username with the context
  const [title, setTitle] = useState('');                   // Track post title in form input

  const slug = encodeURI(kebabCase(title));                 // Create URL friendly kebab case

  const isValid = title.length > 3 && title.length <= 100;  // Check for a valid title length

    // Create a new post in firestore
    const createPost = async (e) => {
      e.preventDefault();

      // Grab a document reference using the slug (since it doesn't exist, it creates a new post)
      const uid = auth.currentUser.uid;
      const ref = doc(firestore, 'users', uid, 'posts', slug);

      // Data for the post, with appropriate default data to be edited afterwards
      const data = {
        title,
        slug,
        uid,
        username,
        published: true,
        content: 'Hello World!',
        createdAt: timestamp,
        updatedAt: timestamp,
        heartCount: 0,
      };

      await setDoc(ref, data);          // Add the document to firestore (default/no content yet)
      toast.success('Post Created!');   // Toast a successful post creation
      router.push(`/admin/${slug}`);    // Reroute to the slug of that post so that it can be edited
    }

  return (
    <>
      <h1>Create a New Post! 🖋</h1>
      <h3>Please don&rsquo;t use the same title multiple times since the code might break, thanks!</h3>

      <form onSubmit={createPost}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Awesome article"
          className={styles.input}
        />

        {/* View the slug the post generates in real time */}
        <p>
          <strong>Slug: </strong>{slug}
        </p>
        <p>
          <strong>Valid Title: </strong>{isValid.toString()}
        </p>

        {/* Submit! */}
        <button type="submit" disabled={!isValid} className="btn-green">
          Create Post!
        </button>

      </form>
    </>
  )

}