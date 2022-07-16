const path = require('path');

const {merge} = require('webpack-merge');

const base = require('./webpack.config.base');

module.exports = merge(base, {
    entry: {
        index: './src/main/index.ts',
        preload: './src/main/preload.ts',
    },
    module: {
        rules: [{
            test: /\.(js|ts)?$/,
            loader: 'babel-loader',
        }],
    },
    node: {
        __filename: true,
        __dirname: true,
    },
    target: 'electron-main',
});

/* eslint-enable import/no-commonjs */
