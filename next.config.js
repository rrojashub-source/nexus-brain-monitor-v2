/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      'three': 'three'
    });
    return config;
  },
}

module.exports = nextConfig
