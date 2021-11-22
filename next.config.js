const withTM = require('next-transpile-modules')(['react-markdown', 'firebase/firestore']);

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
});
