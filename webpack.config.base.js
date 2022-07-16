const path = require('path');

module.exports = {
    resolve: {
        alias: {
            renderer: path.resolve(__dirname, 'src/renderer'),
            main: path.resolve(__dirname, './src/main'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
};
