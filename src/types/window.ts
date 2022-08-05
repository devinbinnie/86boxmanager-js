import {Settings, VM} from 'types/config';

declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
        mainApp: {
            setConfig: (config: Settings) => Promise<boolean>;
            getConfig: () => Promise<Settings>;
            openExePathDialog: () => Promise<string>;
            openCfgPathDialog: () => Promise<string>;
            addVM: (importedVMPath?: string) => (vm: VM) => Promise<boolean>;
            editVM: (index: number) => (vm: VM) => Promise<boolean>;
            deleteVM: (index: number, deleteFiles: boolean) => Promise<boolean>;
            configureVM: (vm: VM) => Promise<boolean>;
            startVM: (vm: VM) => Promise<boolean>;
            getVMs: () => Promise<VM[]>;
            importVM: () => Promise<VM>;
            verify86Box: (exePath: string) => Promise<boolean>;
        },
        path: {
            join: (...paths: string[]) => string;
        }
    }
}
