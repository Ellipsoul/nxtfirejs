import React from "react";
import Link from "next/link";

// First 5 posts of user
export default function PostFeed({ posts, admin }) {
  // Return a map of the user's posts if there are posts
  return posts.length
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

// Single post
function PostItem({ post, admin = false }) {
  // Estimate word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      {/* Link ot user's profile */}
      <Link href={`/${post.username}`} passHref>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      {/* Title */}
      <Link href={`/${post.username}/${post.slug}`} passHref>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      {/* Read duration estimate */}
      <footer>
        <span className='post-desc'>{wordCount} words. </span>
        <span className='post-desc'>{minutesToRead} minute read</span>
        <span className='post-desc'>💛 {post.heartCount} Hearts</span>
      </footer>

    </div>
  );
}
