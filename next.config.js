/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // domains: ['a.storyblok.com'],
  },
  // reactStrictMode: false,
}

module.exports = nextConfig

//next.config.mjs
// export default {
//   webpack: (config) => {
//     // Add rule for SVG files
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ['@svgr/webpack', 'url-loader'],
//     });

//     return config;
//   }, 
//   reactStrictMode: true, 
// };