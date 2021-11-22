const withTM = require('next-transpile-modules')(['react-markdown']);
const withFB = require('firebase/firestore');

module.exports = withFB(withTM({
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
}));
