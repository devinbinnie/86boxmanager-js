import {contextBridge, ipcRenderer} from 'electron';

import path from 'path';

import {
    GET_CONFIG,
    SET_CONFIG,
    OPEN_EXE_PATH_DIALOG,
    OPEN_CFG_PATH_DIALOG,
    ADD_VM,
    EDIT_VM,
    DELETE_VM,
    GET_VMS,
    CONFIGURE_VM,
    START_VM,
    IMPORT_VM,
    VERIFY_86BOX_EXE,
    UPDATE_VM_STATUSES,
    VMStatus,
} from 'main/constants';

import {Settings, VM} from 'types/config';

contextBridge.exposeInMainWorld('mainApp', {
    setConfig: (config: Settings) => ipcRenderer.invoke(SET_CONFIG, config),
    getConfig: () => ipcRenderer.invoke(GET_CONFIG),
    addVM: (importedVMPath?: string) => (vm: VM) => ipcRenderer.invoke(ADD_VM, vm, importedVMPath),
    editVM: (index: number) => (vm: VM) => ipcRenderer.invoke(EDIT_VM, index, vm),
    deleteVM: (index: number, deleteFiles: boolean) =>
        ipcRenderer.invoke(DELETE_VM, index, deleteFiles),
    getVMs: () => ipcRenderer.invoke(GET_VMS),
    configureVM: (vm: VM) => ipcRenderer.invoke(CONFIGURE_VM, vm),
    startVM: (vm: VM) => ipcRenderer.invoke(START_VM, vm),
    importVM: () => ipcRenderer.invoke(IMPORT_VM),
    openExePathDialog: () => ipcRenderer.invoke(OPEN_EXE_PATH_DIALOG),
    openCfgPathDialog: () => ipcRenderer.invoke(OPEN_CFG_PATH_DIALOG),
    verify86Box: (exePath: string) => ipcRenderer.invoke(VERIFY_86BOX_EXE, exePath),

    registerUpdateVMStatusesListener:
        (func: (event: Electron.IpcRendererEvent, vms: Map<string, VMStatus>) => void) =>
            ipcRenderer.on(UPDATE_VM_STATUSES, func),
});

contextBridge.exposeInMainWorld('path', {
    join: path.join,
});
