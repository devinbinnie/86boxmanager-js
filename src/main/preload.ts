import {contextBridge, ipcRenderer} from 'electron';

import path from 'path';

import {
    GET_CONFIG,
    SET_CONFIG,
    OPEN_EXE_PATH_DIALOG,
    OPEN_CFG_PATH_DIALOG,
    ADD_VM,
    GET_VMS,
    CONFIGURE_VM,
    START_VM,
} from 'main/constants';

import {Settings, VM} from 'types/config';

contextBridge.exposeInMainWorld('mainApp', {
    setConfig: (config: Settings) => ipcRenderer.invoke(SET_CONFIG, config),
    getConfig: () => ipcRenderer.invoke(GET_CONFIG),
    addVM: (vm: VM) => ipcRenderer.invoke(ADD_VM, vm),
    getVMs: () => ipcRenderer.invoke(GET_VMS),
    configureVM: (vm: VM) => ipcRenderer.invoke(CONFIGURE_VM, vm),
    startVM: (vm: VM) => ipcRenderer.invoke(START_VM, vm),
    openExePathDialog: () => ipcRenderer.invoke(OPEN_EXE_PATH_DIALOG),
    openCfgPathDialog: () => ipcRenderer.invoke(OPEN_CFG_PATH_DIALOG),
});

contextBridge.exposeInMainWorld('path', {
    join: path.join,
});
