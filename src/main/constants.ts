export const SET_CONFIG = 'set-config';
export const GET_CONFIG = 'get-config';
export const OPEN_EXE_PATH_DIALOG = 'open-exe-path-dialog';
export const OPEN_CFG_PATH_DIALOG = 'open-cfg-path-dialog';
export const ADD_VM = 'add-vm';
export const EDIT_VM = 'edit-vm';
export const DELETE_VM = 'delete-vm';
export const GET_VMS = 'get-vms';
export const CONFIGURE_VM = 'configure-vm';
export const START_VM = 'start-vm';
export const IMPORT_VM = 'import-vm';
export const VERIFY_86BOX_EXE = 'verify-86box-exe';
export const UPDATE_VM_STATUSES = 'update-vm-statuses';

export enum VMStatus {
    NotConfigured,
    Configuring,
    Ready,
    Running
};
