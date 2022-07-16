module.exports = (api) => {
    api.cache.forever();
    return {
        presets: [
            ['@babel/preset-env', {
                targets: {
                    browsers: ['Electron >= 19.0.0'],
                    node: '16.0.0',
                },
            }],
            '@babel/preset-react',
            ['@babel/typescript', {
                allExtensions: true,
                isTSX: true,
            }],
        ],
        plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties'],
    };
};