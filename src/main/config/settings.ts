import fs from 'fs';
import path from 'path';

import {app} from 'electron';
import log from 'electron-log';

import {configPath} from 'main/constants';

import {Settings, SettingsWithVM, VM} from 'types/config';

class ManagerSettings {
    settings?: SettingsWithVM;

    init = () => {
        try {
            const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            this.settings = rawConfig as SettingsWithVM;
            return true;
        } catch (err) {
            log.error('Cannot load config, using defaults.', err);
            this.settings = {
                vms: [],
                exePath: '',
                cfgPath: path.join(app.getPath('home'), '86BoxVMs'),
                showConsole: true,
                logging: false,
                logPath: '',
                //sortColumn: 0,
                //sortOrder: 'asc',
            };
            if (!this.writeConfig()) {
                return true;
            }
            return false;
        }
    };

    writeConfig = () => {
        try {
            const configString = JSON.stringify(this.settings);
            fs.writeFileSync(path.join(app.getPath('userData'), 'config.json'), configString);
            return true;
        } catch (err) {
            log.error('Cannot write config', err);
            return false;
        }
    };

    setConfig = (config: Settings) => {
        this.settings = {
            vms: [],
            ...this.settings,
            ...config,
        };
        if (!this.writeConfig()) {
            return false;
        }
        return true;
    };

    addVM = (vm: VM) => {
        if (!this.settings) {
            log.error('Cannot add VM when config is not initialized');
            return;
        }

        this.settings.vms.push(vm);
        if (!this.writeConfig()) {
            return false;
        }
        return true;
    };
}

const managerSettings = new ManagerSettings();
export default managerSettings;
