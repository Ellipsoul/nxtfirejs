import Link from 'next/link';
import ReactMarkdown from 'react-markdown/react-markdown.min';

// UI component for main post content
export default function PostContent({ post }) {
  // Render a created at date to be displayed
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return (
    <div className="card">
      <h1>{post?.title}</h1>

      <span className="text-sm">
        Written by{' '}<Link href={`/${post.username}/`} passHref> </Link>{' '}
          <a className="text-info">@{post.username}</a>
        {'  '} on {createdAt.toISOString()}
      </span>

      {/* Post content, rendered to support markdown */}
      <ReactMarkdown className="post-content">{post?.content}</ReactMarkdown>
    </div>
  );
}