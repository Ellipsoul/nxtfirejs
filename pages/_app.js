import '/styles/globals.css';

import Navbar from '../components/Navbar.js';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../lib/context.js';

import { useUserData } from '../lib/hooks.js';

// Wrapper surrounding every page of the app

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
  <UserContext.Provider value={userData}> {/* Passing a global context */}
    
    {/* Navbar belongs on all pages */}
    <Navbar />
    
    {/* Component is mounted here */}
    <Component {...pageProps} />

    {/* Toaster is invisible by default but can be triggered */}
    <Toaster />

  </UserContext.Provider>)
}

export default MyApp
