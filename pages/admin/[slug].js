import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck.js';
import { firestore, auth, timestamp } from '../../lib/firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import ImageUploader from '../../components/ImageUploader.js';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useForm, useFormState } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import ReactMarkdown from 'react-markdown/react-markdown.min';
import Link from 'next/link';
import toast from 'react-hot-toast';


// Post owner can preview and edit posts from this page
export default function AdminPostEdit(props) {
  return (
    // Once again, nest admin functionality inside an authCheck
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

// Main component that handles post previewing and submitting
function PostManager() {
  const [preview, setPreview] = useState(false);  // Track whether the user wants to preview or edit
  const [post, setPost] = useState(null);         // Track the actual post's state

  const router = useRouter();                     // Grab the slug from the router from the previous redirect

  const slug = router.query.slug;
  const postRef = doc(firestore, 'users', auth.currentUser.uid, 'posts', slug);

  useEffect(() => {
    // Asynchronously retrieve the post 
    const asyncGetPost = async ref => {
    const postDoc = await getDoc(ref);
    return postDoc
    }
    asyncGetPost(postRef).then((res) => setPost(res.data()));
  }, [postRef])


  return (
    <main className={styles.container}>
      {/* Only render if the post exists */}
      {post && (
        <>
          {/* Main area for editing the post */}
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          {/* Additional tools for user to edit */}
          <aside>
            <h3>Tools</h3>
            
            {/* Toggler between editing and previewing the post */}
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            
            {/* Redirect to the live post */}
            <Link href={`/${post.username}/${post.slug}`} passHref>
              <button className="btn-blue">Live View</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}


// Edit, preview and submit post component
function PostForm({ defaultValues, postRef, preview }) {
  // heact-hook-form hook, onChange re-renders and re-validates the post whenever its content changes
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({defaultValues, mode:'onChange'});

  // Handles the logic to submit and publish a post
  const updatePost = async ({ content, published }) => {
    toast.success('Post updated successfully!');
    // Update the firestore document
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: timestamp
    });
    // From react-use-form, resets the validation state of the form
    reset({ content, published });
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {/* Show the post preview if the user is not editing */}
      {preview && (
        <div className="card">
          {/* watch('content') treats the field content as state for the useForm hook */}
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      {/* If user is editing, show some additional controls */}
      <div className={preview ? styles.hidden : styles.controls}>
        {/* Allow users to upload images to the post! */}
        <ImageUploader />

        {/* ref(register) connects this text area to the form */}
        <textarea {...register("content", {
            max: { value: 20000, message: 'content is too long' },
            min: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required'}
          })} />

        {/* Toggle whether the form should be published, also attach ref register */}
        <fieldset>
          <input className={styles.checkbox} type="checkbox" {...register("published")} />
          <label>Published</label>
        </fieldset>

        <ErrorMessage errors={errors} name="singleErrorInput" />
      
        <ErrorMessage
          errors={errors}
          name="singleErrorInput"
          render={({ message }) => <p>{message}</p>}
        />

        {/* Finally, a submit button */}
        <button type="submit" className='btn-green'>
          Save Changes
        </button>
      </div>

    </form>
  );
}