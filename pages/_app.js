import '../styles/globals.css'

import Navbar from '../components/navbar';

// Wrapper surrounding every page of the app

function MyApp({ Component, pageProps }) {
  return (<>
    {/* Navbar belongs on all pages */}
    <Navbar />
    
    <Component {...pageProps} />
  </>)
}

export default MyApp
