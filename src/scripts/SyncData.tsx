import moment from "moment";
import { Students } from "./ApiTecnica";
import ScriptGlobal from "./ScriptGlobal";

declare global {
    interface Window {
        startSync: boolean | undefined;
    }
}

export default new class SyncData {
    constructor() {
        this.startSync = this.startSync.bind(this);
    }
    private timeSync = [
        { hour: 7, minMinutes: 46, maxMinutes: 59, result: '7:15' },
        { hour: 8, minMinutes: 56, maxMinutes: 59, result: '8:40' },
        { hour: 9, minMinutes: 0, maxMinutes: 11, result: '8:40' },
        { hour: 9, minMinutes: 51, maxMinutes: 59, result: '9:50' },
        { hour: 10, minMinutes: 0, maxMinutes: 6, result: '9:50' },
        { hour: 11, minMinutes: 16, maxMinutes: 31, result: '11:00' },
        { hour: 13, minMinutes: 31, maxMinutes: 46, result: '13:15' },
        { hour: 14, minMinutes: 36, maxMinutes: 51, result: '14:25' },
        { hour: 15, minMinutes: 46, maxMinutes: 59, result: '15:35' },
        { hour: 16, minMinutes: 0, maxMinutes: 1, result: '15:35' },
        { hour: 16, minMinutes: 56, maxMinutes: 59, result: '16:45' },
        { hour: 17, minMinutes: 0, maxMinutes: 11, result: '16:45' }
    ];
    init() {
        if (window.startSync == true) return;
        window.startSync = true;
        document.dispatchEvent(ScriptGlobal.getEvent('StartSync', false, 'Sincronización en vivo activa.', true, 'AcceptIcon'));
        setInterval(this.startSync, 60000);
    }
    startSync() {
        console.log("Sync");
        var now: { hour: number, minutes: number } = { hour: parseInt(moment().format('HH')), minutes: parseInt(moment().format('mm')) };
        var find = this.timeSync.find((value)=>{
            if (value.hour == now.hour) {
                if (now.minutes >= value.minMinutes && now.minutes <= value.maxMinutes) return value;
            }
        });
        if (find) Students.sendData();
    }
}