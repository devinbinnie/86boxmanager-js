import fs from 'fs';
import path from 'path';

import {app, BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent} from 'electron';

import {configure86Box, start86Box} from 'main/86box';
import ManagerSettings from 'main/config/settings';
import {
    GET_CONFIG,
    SET_CONFIG,
    OPEN_CFG_PATH_DIALOG,
    OPEN_EXE_PATH_DIALOG,
    ADD_VM,
    EDIT_VM,
    GET_VMS,
    CONFIGURE_VM,
    START_VM,
    DELETE_VM,
    IMPORT_VM,
} from 'main/constants';

import {Settings, VM} from 'types/config';

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
    if (process.env.USER_DATA_DIR) {
        app.setPath('userData', process.env.USER_DATA_DIR);
    }
    ManagerSettings.init();

    const window = createWindow();

    ipcMain.handle(GET_CONFIG, () => {
        return ManagerSettings.settings;
    });

    ipcMain.handle(SET_CONFIG, (event: IpcMainInvokeEvent, config: Settings) => {
        return ManagerSettings.setConfig(config);
    });

    ipcMain.handle(ADD_VM, (event: IpcMainInvokeEvent, vm: VM, importedVMPath?: string) => {
        if (!fs.existsSync(vm.path)) {
            fs.mkdirSync(vm.path, {recursive: true});
        }
        if (importedVMPath) {
            fs.copyFileSync(importedVMPath, path.join(vm.path, '86box.cfg'));
        }

        return ManagerSettings.addVM(vm);
    });

    ipcMain.handle(EDIT_VM, (event: IpcMainInvokeEvent, index: number, vm: VM) => {
        const originalPath = ManagerSettings.settings?.vms[index].path;
        vm.path = path.join(ManagerSettings.settings?.cfgPath!, vm.name);
        fs.renameSync(originalPath!, vm.path);
        ManagerSettings.settings?.vms.splice(index, 1, vm);
        return ManagerSettings.writeConfig();
    });

    ipcMain.handle(DELETE_VM, (event: IpcMainInvokeEvent, index: number, deleteFiles: boolean) => {
        if (deleteFiles) {
            const originalPath = ManagerSettings.settings?.vms[index].path!;
            fs.rmSync(originalPath, {recursive: true, force: true});
        }
        ManagerSettings.settings?.vms.splice(index, 1);
        return ManagerSettings.writeConfig();
    });

    ipcMain.handle(IMPORT_VM, () => {
        const importPath = dialog.showOpenDialogSync(window, {
            properties: ['openFile'],
            filters: [
                {
                    name: '86box config',
                    extensions: ['cfg'],
                },
            ],
        });
        if (!importPath) {
            return '';
        }
        const directory = path.dirname(importPath[0]);
        return {
            name: path.basename(directory),
            desc: '',
            path: importPath[0],
        };
    });

    ipcMain.handle(GET_VMS, () => {
        return ManagerSettings.settings?.vms;
    });

    ipcMain.handle(CONFIGURE_VM, (event: IpcMainInvokeEvent, vm: VM) => {
        configure86Box(ManagerSettings.settings?.exePath!, vm.path);
        return true;
    });

    ipcMain.handle(START_VM, (event: IpcMainInvokeEvent, vm: VM) => {
        start86Box(ManagerSettings.settings?.exePath!, vm.path);
        return true;
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
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit();
});
