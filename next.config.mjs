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
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_APP_URL || "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
                ]
            }
        ]
    }
};

export default nextConfig;
