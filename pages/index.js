import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

import Loader from '../components/Loader';
import toast from 'react-hot-toast';

// This will be the root directory

export default function Home() {
  return (
    <main>
      <Loader show={true} />
      <button onClick={() => toast.success('A Toast!')}>Toast Me</button>
    </main>
  )
}
