const {withRouter} = require('next/router');

const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            // {
            //     source: '/reports/:path*',
            //     destination: '/',
            //     permanent: false,
            // },
            // {
            //     source: '/reports',
            //     destination: '/',
            //     permanent: false,
            // },
            // {
            //     source: '/:path*',
            //     destination: '/',
            //     permanent: false,
            // },
        ];
    },
}

module.exports = nextConfig
