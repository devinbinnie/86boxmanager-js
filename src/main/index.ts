import path from 'path';

import {app, BrowserWindow} from 'electron';

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(app.getAppPath(), 'preload.js'),
        },
    });

    mainWindow.loadFile(path.join(app.getAppPath(), 'renderer/index.html'));
}

app.whenReady().then(() => {
    createWindow();
  
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});
  
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
