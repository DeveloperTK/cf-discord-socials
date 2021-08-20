const path = require('path');
const env = require('dotenv').config({ path: path.join(__dirname, `${process.env.NODE_ENV}.env`) });
const { DefinePlugin } = require('webpack');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
    entry: './src/index.js',
    plugins: [
        // Hook in the commands build process before each webpack run
        {
            apply: compiler => compiler.hooks.beforeRun.tapPromise('PrepareBuildBeforeWebpack', require('./src/prebuild'))
        },

        // Expose our environment variables in the worker
        new DefinePlugin(Object.entries(env.parsed).reduce((obj, [ key, val ]) => {
            obj[`process.env.${key}`] = JSON.stringify(val);
            return obj;
        }, { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) })),

        // Publish source maps to Sentry on each build
        new SentryWebpackPlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            include: './dist',
            release: require('./package.json').version,
            ignore: ['node_modules', 'webpack.config.js'],
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader',
            },
        ],
    },
};