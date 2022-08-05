const path = require('path');

const isWatchMode = Boolean(process.env.IS_WATCH_MODE);

const electronReloadPlugin = require('webpack-electron-reload')({
    path: `${path.join(__dirname, './dist')}`,
    spawnOpt: {
        stdio: 'inherit',
        env: {
            ...process.env,
            USER_DATA_DIR: path.join(__dirname, './config'),
        },
    },
});

const plugins = [];
if (isWatchMode) {
    plugins.push(electronReloadPlugin());
}

module.exports = {
    resolve: {
        alias: {
            renderer: path.resolve(__dirname, 'src/renderer'),
            main: path.resolve(__dirname, './src/main'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins,
};
