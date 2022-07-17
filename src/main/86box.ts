import fs from 'fs';
import {execFileSync} from 'child_process';
import path from 'path';

export function configure86Box(exePath: string, vmPath: string) {
    execFileSync(get86BoxCommand(exePath), ['--settings', '--vmpath', vmPath]);
}

export function start86Box(exePath: string, vmPath: string) {
    execFileSync(get86BoxCommand(exePath), ['--vmpath', vmPath]);
}

function get86BoxCommand(exePath: string) {
    switch (process.platform) {
        case 'win32':
            return path.join(exePath, '86Box.exe');
        case 'darwin':
            return path.join(exePath, '86Box.app/Contents/MacOS/86Box');
        case 'linux':
            const dirs = fs.readdirSync(exePath);
            const filename = dirs.find((file) => file.match(/86Box-Linux(.+)\.AppImage/)) || '';
            return path.join(exePath, filename);
        default:
            return '';
    }
}