import {ipcRenderer} from 'electron/renderer';

declare global {
    interface Window {
        mainApp: {
            setConfig: (config: Settings) => Promise<boolean>;
            getConfig: () => Promise<Settings>;
            openExePathDialog: () => Promise<string>;
            openCfgPathDialog: () => Promise<string>;
            addVM: (vm: VM) => Promise<boolean>;
            editVM: (index: number) => (vm: VM) => Promise<boolean>;
            configureVM: (vm: VM) => Promise<boolean>;
            startVM: (vm: VM) => Promise<boolean>;
            getVMs: () => Promise<VM[]>;
        },
        path: {
            join: (...paths: string[]) => string;
        }
    }
}