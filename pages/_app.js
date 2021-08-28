import '../styles/globals.css'

// Wrapper surrounding every page of the app

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
