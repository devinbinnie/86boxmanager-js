import {contextBridge, ipcRenderer} from 'electron';

import {
    GET_CONFIG,
    SET_CONFIG,
    OPEN_EXE_PATH_DIALOG,
    OPEN_CFG_PATH_DIALOG,
} from 'main/constants';

import {Settings} from 'types/config';

contextBridge.exposeInMainWorld('mainApp', {
    setConfig: (config: Settings) => ipcRenderer.invoke(SET_CONFIG, config),
    getConfig: () => ipcRenderer.invoke(GET_CONFIG),
    openExePathDialog: () => ipcRenderer.invoke(OPEN_EXE_PATH_DIALOG),
    openCfgPathDialog: () => ipcRenderer.invoke(OPEN_CFG_PATH_DIALOG),
});
