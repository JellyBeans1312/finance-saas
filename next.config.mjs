/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                stream: false,
            };
        }
        if (isServer) {
            config.externals.push({
                'puppeteer-core': 'puppeteer-core',
            });
        }
        config.module.rules.push({
            test: /\.node$/,
            use: 'node-loader',
        });
        config.resolve.alias = {
            ...config.resolve.alias,
            'chrome-aws-lambda': false,
            'puppeteer-core': false
          };
        return config;
    },
};

export default nextConfig;
