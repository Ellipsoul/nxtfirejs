import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent.js';
import Metatags from '../../components/Metatags';

import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, getDoc, collectionGroup, getDocs, doc } from '@firebase/firestore';

/*
Route for individual posts
Uses incremental static regeneration (ISR) to rebuild the page at certain intervals to keep it up to date
Falls back to SSR if it doesn't find the props available to build the page
*/

// Static generation, next fetches data from the server at BUILD time and builds the page ahead of time
export async function getStaticProps({ params }) {

  const { username, slug } = params;                    // Grab the username and slug from prop parameters
  const userDoc = await getUserWithUsername(username);  // Get the username document

  let post;
  let path;
  
  // Grab the collection of posts from the target user
  const userPostsCollection = collection(userDoc.ref, 'posts')

  // If user exists, grab the specific post with the slug, and the path to the post
  if (userDoc) {
    const postRef = doc(userPostsCollection, slug);
    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
  }

  return {
    props: {post, path},
    revalidate: 5000      // Tell next to regenerate page when new requests arrive, with this time interval
  };
}


// Tell next which pages which paths to render here
export async function getStaticPaths() {
  const snapshot = await getDocs(collectionGroup(firestore, 'posts'));

  // Grab all the posts that are available on Firebase at the time and save their paths to be pre-built
  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  /* 
  Next can't know when news posts are added, so if it can't find a prebuilt new post that isn't cached it will
  just return a 404 error. Add blocking as a fallback to tell next to fall back to server side rendering, and cache
  the rendered post so it can be used as normal later
  */
  return {
    paths,
    fallback: 'blocking'
  }
}



export default function Post(props) {

  // TODO: React firebase hooks currently not supporting Firebase v9. Only SSR posts available for now
  // const postsRef = doc(firestore, props.path);
  // const [realtimePost] = useDocumentData(postsRef);

  // const post = realtimePost || props.post

  const post = props.post  // Temporarily just render the posts that have been SSRd

  return (
    <main className={styles.container}>
      <Metatags title="User Post Page" />
      
      <section>
        <PostContent post={post}/>
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 💙 </strong>
        </p>
      </aside>

    </main>
  )
}
