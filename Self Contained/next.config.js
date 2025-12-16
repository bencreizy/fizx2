// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the critical line that performs the "refactoring" for styled-components.
  // It enables the compiler to convert dynamic JS styling into static, CSP-compliant CSS 
  // during the Vercel build.
  compiler: {
    styledComponents: true,
  },
  
  // Ensures clean routing on Vercel
  trailingSlash: true,
};

module.exports = nextConfig;
