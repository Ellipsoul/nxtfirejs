import Metatags from '../components/Metatags.js';

// Custom 404 Page. Next automatically routes 404 errors to a file with this name

export default function Custom500() {
  return (
    <main>
      <Metatags title="NextFire - 500 Error" />

      <h1>500 Error</h1>
      <h2>
        One day I returned to my deployment in horror that it now returns a 500 error on the home page.
        I tried everything to rescue my creation, but it will just have to be a part of history. RIP 😢
      </h2>
      <h4>
        Based on my investigation, I believe the recent NextJS 12 update changed some deployment settings
        under the hood, causing some modules (most likely firestore) to not be imported properly for server
        side rendering. I managed to import firestore inside next.config.js, but that returned a very strange
        type casting issue that I could not find anywhere on Google. Goodbye old friend 🏳
      </h4>

      <iframe
        src="https://giphy.com/embed/dyiOB0Zzwf4PY8fDii"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </main>
  );
}