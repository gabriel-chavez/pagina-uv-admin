const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [
      {
        source: '/dashboards',
        destination: '/dashboards/crypto',
        permanent: true
      }
    ];
  }
};
module.exports = {
  experimental: {
    middlewarePrefetch: true, 
  },
};
module.exports = withImages(redirects);
