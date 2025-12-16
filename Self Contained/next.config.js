// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the critical line. It enables the built-in compiler for 
  // styled-components, which removes the runtime dependency on eval() 
  // that causes the Content Security Policy (CSP) warning.
  compiler: {
    styledComponents: true,
  },
  
  // Optional: Add trailing slash for clean routing in a self-contained environment
  trailingSlash: true,
};

module.exports = nextConfig;
