import fs from 'fs';
import {execFile, spawn} from 'child_process';
import path from 'path';

import log from 'electron-log';

export function configure86Box(exePath: string, vmPath: string) {
    return execFile(get86BoxCommand(exePath), ['--settings', '--vmpath', vmPath]);
}

export function start86Box(exePath: string, vmPath: string) {
    return execFile(get86BoxCommand(exePath), ['--vmpath', vmPath]);
}

export async function verify86Box(exePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(exePath)) {
            resolve(false);
        }
        try {
            const proc = spawn(get86BoxCommand(exePath), ['-?']);
            proc.stdout.on('data', (data) => {
                const result = `${data}`;
                log.info('checking for EXE...', result);
                proc.kill();
                resolve(result.includes('--vmpath') && result.includes('--settings'));
            });
            setTimeout(() => {
                proc.kill();
                resolve(false);
            }, 5000);
        } catch (err) {
            log.error('error checking EXE', err);
            resolve(false);
        }
    });
}

function get86BoxCommand(exePath: string) {
    switch (process.platform) {
        case 'darwin':
            return path.join(exePath, 'Contents/MacOS/86Box');
        default:
            return exePath;
    }
}

export function getApplicationExtension() {
    switch (process.platform) {
        case 'win32':
            return 'exe';
        case 'darwin':
            return 'app';
        case 'linux':
            return 'AppImage';
        default:
            return '';
    }
}
