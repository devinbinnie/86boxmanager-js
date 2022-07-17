import {VM} from "types/config";

export enum VMStatus {
    Stopped,
    Running,
    Waiting,
    Paused
}

export class VM86Box {
    hWnd: number;
    vm: VM;
    status: VMStatus;
    pid?: number;

    constructor(name = 'defaultName', desc = 'defaultDesc', path = 'defaultPath') {
        this.vm = {
            name,
            desc,
            path,
        };
        this.status = VMStatus.Stopped;
        this.hWnd = 0;
    }
}