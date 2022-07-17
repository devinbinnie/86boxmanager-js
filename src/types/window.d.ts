import {ipcRenderer} from 'electron/renderer';

declare global {
    interface Window {
        mainApp: {
            setConfig: (config: Settings) => Promise<boolean>;
            getConfig: () => Promise<Settings>;
            openExePathDialog: () => Promise<string>;
            openCfgPathDialog: () => Promise<string>;
        }
    }
}