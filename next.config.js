/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'm.media-amazon.com',
      'images.flipkart.com',
      'images-eu.ssl-images-amazon.com',
      'images-na.ssl-images-amazon.com'
    ],
  },
};

module.exports = nextConfig; 