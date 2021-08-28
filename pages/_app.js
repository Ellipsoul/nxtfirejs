import '../styles/globals.css'

import Navbar from '../components/navbar';
import { Toaster } from 'react-hot-toast';

// Wrapper surrounding every page of the app

function MyApp({ Component, pageProps }) {
  return (<>
    {/* Navbar belongs on all pages */}
    <Navbar />
    <Component {...pageProps} />
    {/* Toaster is invisible by default but can be triggered */}
    <Toaster />
  </>)
}

export default MyApp
