import Link from 'next/link';
import toast from 'react-hot-toast'; 

import Metatags from '../components/Metatags';

// Custom 404 Page. Next automatically routes 404 errors to a file with this name

export default function Custom404() {
  return (
    <main>
      <Metatags title="NextFire - 404 Error" />

      <h1>404 Error</h1>
      <h2>Hmm - That page does not seem to exist...</h2>

      <iframe
        src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      
      <div className="buttons-404">
        <Link href="/" passHref>
          <button className="btn-blue">Home</button>
        </Link>

        <Link href="/" passHref>
          <button className="btn-red" onClick={() => toast.success('Developer Fired')}>Return Home and Fire Developer</button>
        </Link>
      </div>
    </main>
  );
}