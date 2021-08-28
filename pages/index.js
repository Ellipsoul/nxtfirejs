import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

// This will be the root directory

export default function Home() {
  return (
    <div>
      {/* Dynamic links with next js */}
      <Link 
        prefetch={false} 
        href={{
          pathname: '/[username]',
          query: { username: 'ellipsoul'}
        }}
      >
        <a>Arons Profile</a>
      </Link> 
    </div>
  )
}
