/** @type {import('next').NextConfig} */
const nextConfig = {
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