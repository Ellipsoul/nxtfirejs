import { useState } from "react";
import { auth, storage } from '../lib/firebase.js';

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Loader from './Loader.js';

export default function ImageUploader() {
  // Track 3 different states
  const [uploading, setUploading] = useState(false);     // Whether the image is uploading
  const [progress, setProgress] = useState(0);           // Image upload progress
  const [downloadURL, setDownloadURL] = useState(null);  // URL Link to image in cloud

  // Handles the file upload to storage
  const uploadFile = async (e) => {
    // Get the uploaded file and its extension
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Grab a reference to the file storage location
    const storageLocationRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Start the image upload
    const task = uploadBytesResumable(storageLocationRef, file);

    // Listen to updates to upload task
    task.on('state_changed', (snapshot) => {
      // Track and report the progress by dividing the transferred bytes by the total bytes
      const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      setProgress(progress);
    },
    (error) => console.log(`We seem to have a problem, ${error}`),  // Seems like we need a filler here
    () => {
      // Actions after file upload completes. Grab the download URL and present it to the user
      getDownloadURL(task.snapshot.ref)
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
        })
    });

  };

  return (
    <div className='box'>
      {/* Show a loading spinner if image is uploading */}
      <Loader show={uploading} /> 
      {/* If the image is uploading display a progress bar */}
      {uploading && <h3>{progress}%</h3>}

      {/* If nothing is being uploaded show an option to upload image, use label instead of button since
          html buttons are very hard to style */}
      {!uploading && (
        <>
          <label className='btn'>
            📷 Upload Image
            {/* Only accept certain image input type */}
            <input type='file' onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
          </label>
          <span>Once the image is uploaded, copy the shareable URL into your post!</span>
        </>
      )}

      {/* If the URL has been created, offer a URL to be appended to the post */}
      {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}

    </div>
  )
}
