import { decode } from "base-64";
import moment from "moment";
import BarcodeScanner from "simple-barcode-scanner";
import { Students } from "./ApiTecnica";
import { StudentsData, TimesAccept } from "./scripts/types";

type AssistList = {
    curse: string;
    list: StudentsData[];
};

declare global {
    interface Window {
        testBarCode: (code: string)=>any;
        listAssist: AssistList[] | undefined;
        activeConsole: boolean | undefined;
    }
};

const scanner = BarcodeScanner();

export default new class ApiConsole {
    constructor() {
        this.processNow = this.processNow.bind(this);
    }
    init() {
        scanner.on(this.processNow);
        window.testBarCode = (code: string)=>this.processNow(code, undefined);
    }
    async processNow(code: string, event: KeyboardEvent | undefined) {
        (event)&&event.preventDefault();
        if (!window.activeConsole) return;
        var className = (Math.floor(Math.random() * (9999999 - 1000000)) + 1000000).toString();
        document.dispatchEvent(this.getEvent(className, true, 'Procesando código de barras...', false));
        await this.waitTime();
        if (this.checkCode(code)) {
            if (this.checkHour()) {
                return Students.getAll().then((values)=>{
                    var dni = code.replace('eest', '');
                    var find = values.find((v)=>decode(v.dni) == dni);
                    if (find) {
                        var res = this.pushAssist(find);
                        if (res == 2) return document.dispatchEvent(this.getEvent(className, false, `La asistencia ya ha sido registrada anteriormente.`, false));
                        return document.dispatchEvent(this.getEvent(className, false, `Se proceso la asistencia del alumno #${this.processId(find.id)}`, true, 'AcceptIcon', 'green'));
                    }
                    return document.dispatchEvent(this.getEvent(className, false, 'No se encontró un alumno registrado.', true, 'CancelIcon', 'red'));
                });
            }
            return document.dispatchEvent(this.getEvent(className, false, 'No se encontró un tiempo valido registrado.', true, 'CancelIcon', 'red'));
        }
        document.dispatchEvent(this.getEvent(className, false, 'No se reconoció el código de barras.', true, 'CancelIcon', 'red'));
    }
    pushAssist(data: StudentsData): number {
        var newList = window.listAssist!;
        if (window.listAssist) {
            var findIndex = window.listAssist.findIndex((value)=>data.curse == value.curse);
            if (findIndex !== -1) {
                var findList = newList[findIndex].list.find((v)=>v.id == data.id);
                if (findList) return 2; 
                newList[findIndex].list.push(data);
                window.listAssist = newList;
                return 1;
            }
            newList.push({
                curse: data.curse,
                list: [data]
            });
            window.listAssist = newList;
            return 1;
        }
        var createList = [{
            curse: data.curse,
            list: [data]
        }];
        window.listAssist = createList;
        return 1;
    }
    processId(id: string) {
        var zeros = 12 - id.length;
        var str = '';
        for (let i = 0; i < zeros; i++) {
            str += '0';
        }
        return `${str}${id}`;
    }
    getEvent(className: string, isLoading: boolean, message: string, showIcon: boolean, iconName?: string, iconColor?: string) {
        return new CustomEvent('update-console-render', {
            detail: {
                class: className,
                isLoading,
                message,
                showIcon,
                iconName,
                iconColor
            }
        });
    }
    checkCode(code: string) {
        if (code.indexOf('eest') !== -1) {
            var key = code.replace('eest', '');
            if (key.length == 8) return true;
        }
        return false;
    }
    checkHour() {
        var now: { hour: number, minutes: number } = { hour: parseInt(moment().format('HH')), minutes: parseInt(moment().format('mm')) };
        var times: TimesAccept[] = [
        /* ##### Mañana ##### */
            /* ##### 7:15 ##### */
            { hour: 7, minMinutes: 0, maxMinutes: 30, result: '7:15' },
            /* ##### 8:40 ##### */
            { hour: 8, minMinutes: 25, maxMinutes: 55, result: '8:40' },
            /* ##### 9:50 ##### */
            { hour: 9, minMinutes: 35, maxMinutes: 59, result: '9:50' },
            { hour: 10, minMinutes: 0, maxMinutes: 5, result: '9:50' },
            /* ##### 10:50 ##### */
            { hour: 10, minMinutes: 45, maxMinutes: 59, result: '11:00' },
            { hour: 11, minMinutes: 0, maxMinutes: 15, result: '11:00' },
        /* ##### Tarde ##### */
            /* ##### 13:15 ##### */
            { hour: 13, minMinutes: 0, maxMinutes: 30, result: '13:15' },
            /* ##### 14:25 ##### */
            { hour: 14, minMinutes: 5, maxMinutes: 35, result: '14:25' },
            /* ##### 10:35 ##### */
            { hour: 15, minMinutes: 15, maxMinutes: 45, result: '15:35' },
            /* ##### 10:45 ##### */
            { hour: 16, minMinutes: 25, maxMinutes: 55, result: '16:45' }
        ];
        var find = times.find((value)=>{
            if (value.hour == now.hour) {
                if (now.minutes >= value.minMinutes && now.minutes <= value.maxMinutes) return value;
            }
        });
        if (find) return true;
        //return false;
        return true;
    }
    waitTime() { return new Promise((res)=>setTimeout(()=>res(true), 1200)); }
}