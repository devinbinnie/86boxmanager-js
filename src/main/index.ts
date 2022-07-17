import path from 'path';

import {app, BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent} from 'electron';

import ManagerSettings from 'main/config/settings';
import {
    GET_CONFIG,
    SET_CONFIG,
    OPEN_CFG_PATH_DIALOG,
    OPEN_EXE_PATH_DIALOG,
} from 'main/constants';
import {Settings} from 'types/config';

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(app.getAppPath(), 'preload.js'),
        },
    });

    mainWindow.loadFile(path.join(app.getAppPath(), 'renderer/index.html'));
    return mainWindow;
}

app.whenReady().then(() => {
    ManagerSettings.init();

    const window = createWindow();

    ipcMain.handle(GET_CONFIG, () => {
        return ManagerSettings.settings;
    });

    ipcMain.handle(SET_CONFIG, (event: IpcMainInvokeEvent, config: Settings) => {
        return ManagerSettings.setConfig(config);
    });

    ipcMain.handle(OPEN_EXE_PATH_DIALOG, () => {
        const path = dialog.showOpenDialogSync(window, {
            properties: ['openDirectory'],
        });
        if (!path) {
            return '';
        }
        return path[0];
    });

    ipcMain.handle(OPEN_CFG_PATH_DIALOG, () => {
        const path = dialog.showOpenDialogSync(window, {
            properties: ['openDirectory'],
        });
        if (!path) {
            return '';
        }
        return path[0];
    });
  
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
