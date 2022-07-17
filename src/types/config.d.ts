export type VM = {
    name: string;
    desc: string;
    path: string;
}

export type SettingsWithVM = Settings & {
    vms: VM[];
}

export type Settings = {
    exePath: string;
    cfgPath: string;
    showConsole: boolean;
    logPath: string;
    logging: boolean;
    //sortColumn: number;
    //sortOrder: 'none' | 'asc' | 'desc';
}