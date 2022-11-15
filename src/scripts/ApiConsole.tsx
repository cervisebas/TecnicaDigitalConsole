import { decode, encode } from "base-64";
import moment from "moment";
import BarcodeScanner from "simple-barcode-scanner";
import { Students } from "./ApiTecnica";
import ScriptGlobal from "./ScriptGlobal";
import { AssistList, AssistTurnsList, StudentsData, TimesAccept } from "./scripts/types";
import { startTimer } from "./Utils";

declare global {
    interface Window {
        testBarCode: (code: string)=>any;
        testListAssistTurns: (idStudent: string)=>void;
        listAssist: AssistList[] | undefined;
        listAssistTurns: AssistTurnsList[] | undefined;
        activeConsole: boolean | undefined;
    }
};

const scanner = BarcodeScanner();
var dayNow = moment().format('DD/MM');

export default new class ApiConsole {
    constructor() {
        this.processNow = this.processNow.bind(this);
        this.syncStudents = this.syncStudents.bind(this);
        this.detectDay = this.detectDay.bind(this);
        this.reSyncStudents = this.reSyncStudents.bind(this);
        this.checkTurn = this.checkTurn.bind(this);
    }
    private onRequestStudents: boolean = false;
    private firsBoot: boolean = false;
    init() {
        scanner.on(this.processNow);
        window.testBarCode = (code: string)=>this.processNow(code);
        window.testListAssistTurns = this.checkTurn;
        this.detectDay();
        this.reSyncStudents();
        document.dispatchEvent(ScriptGlobal.getEvent('StartEvents', false, 'Eventos iniciados.', true, 'AcceptIcon'));
    }
    async detectDay() {
        const here = moment().format('DD/MM');
        if (dayNow !== here) {
            dayNow = here;
            ScriptGlobal.clearConsole();
            window.listAssistTurns = [];
            setTimeout(()=>document.dispatchEvent(ScriptGlobal.getEvent('StartEvents', false, 'Consola limpiada.', true, 'AcceptIcon')), 500);
        }
        setTimeout(this.detectDay, 5000);
    }
    reSyncStudents() {
        if (this.firsBoot) this.syncStudents(true); else this.firsBoot = true;
        setTimeout(this.reSyncStudents, 3600000);
    }
    syncStudents(force?: boolean | undefined) {
        if (this.onRequestStudents) return;
        this.onRequestStudents = true;
        window.activeConsole = false;
        var className = (force)? `load-${(Math.floor(Math.random() * (9999999 - 1000000)) + 1000000).toString()}`: 'load-0';
        document.dispatchEvent(ScriptGlobal.getEvent(className, true, 'Cargando lista de alumnos...', false));
        Students.getAll(force)
            .then(()=>{
                document.dispatchEvent(ScriptGlobal.getEvent(className, false, 'El listado de alumnos se guardo y almaceno de forma correcta.', true, 'AcceptIcon', (force)? 'green': undefined));
                window.activeConsole = true;
                this.onRequestStudents = false;
            })
            .catch(()=>{
                document.dispatchEvent(ScriptGlobal.getEvent(className, false, 'Ocurrió un error al cargar el listado de alumnos.', true, 'CancelIcon', 'red'));
                this.onRequestStudents = false;
            });
    }
    async processNow(code: string, event?: KeyboardEvent | undefined) {
        if (event) event.preventDefault();
        if (!window.activeConsole) return;
        const className = (Math.floor(Math.random() * (9999999 - 1000000)) + 1000000).toString();
        document.dispatchEvent(ScriptGlobal.getEvent(className, true, 'Procesando código de barras...', false));
        await this.waitTime();
        if (this.checkCode(code)) {
            return Students.getAll().then((values)=>{
                const dni = code.replace('eest', '');
                const find = values.find((v)=>decode(v.dni) == dni);
                if (find) {
                    if (find.curse == 'RG9jZW50ZQ==') return this.processTeacher(find, code, className);
                    if (this.checkHour()) {
                        if (this.checkTurn(find.id)) return document.dispatchEvent(ScriptGlobal.getEvent(className, false, `La asistencia ya ha sido registrada hoy #${this.processId(find.id)}.`, false));
                        const res = this.pushAssist(find);
                        if (res == 2) return document.dispatchEvent(ScriptGlobal.getEvent(className, false, `La asistencia ya ha sido registrada anteriormente #${this.processId(find.id)}.`, false));
                        return document.dispatchEvent(ScriptGlobal.getEvent(className, false, `Se proceso la asistencia del alumno #${this.processId(find.id)}`, true, 'AcceptIcon', 'green'));
                    }
                    return document.dispatchEvent(ScriptGlobal.getEvent(className, false, `No se encontró un tiempo valido registrado #${this.processId(find.id)}.`, true, 'CancelIcon', 'red'));
                }
                return document.dispatchEvent(ScriptGlobal.getEvent(className, false, `No se encontró un alumno registrado ("${code}").`, true, 'CancelIcon', 'red'));
            });
        }
        document.dispatchEvent(ScriptGlobal.getEvent(className, false, `No se reconoció el código de barras ("${code}").`, true, 'CancelIcon', 'red'));
    }
    processTeacher(data: StudentsData, _code: string, className: string) {
        if (this.checkHourTeacher()) {
            document.dispatchEvent(ScriptGlobal.getEvent(className, true, `Enviando datos del docente #${this.processId(data.id)}...`, false));
            return Students.sendDataTeacher(data.id, moment().format('HH:mm'))
                .then(()=>document.dispatchEvent(ScriptGlobal.getEvent(className, false, `Se proceso la asistencia del docente #${this.processId(data.id)}`, true, 'AcceptIcon', 'green')))
                .catch(({ cause, code })=>{
                    const reIntent = code == 1;
                    document.dispatchEvent(ScriptGlobal.getEvent(className, false, `${cause} - ${(reIntent)? 'Reintentando en 00:30 minutos...': 'Sin reintentos.'}`, true, 'CancelIcon', 'red'));
                    if (reIntent) {
                        setTimeout(()=>this.processTeacher(data, _code, className), 30000);
                        startTimer(29, (time)=>document.dispatchEvent(ScriptGlobal.getEvent(className, false, `${cause} - ${`Reintentando en ${time} minutos...`}`, true, 'CancelIcon', 'red')));
                    }
                })
        }
        return document.dispatchEvent(ScriptGlobal.getEvent(className, false, `No se encontró un tiempo valido registrado #${this.processId(data.id)}.`, true, 'CancelIcon', 'red'));
    }
    checkTurn(idStudent: string) {
        const nowDate = moment().format('DD/MM/YYYY');
        const nowHour = this.checkHour(true) as string;
        const nowTurn = (nowHour == '7:15' || nowHour == '8:40' || nowHour == '9:50' || nowHour == '11:00')? 'morning': 'afternoon';
        if (window.listAssistTurns) {
            const findForTime = window.listAssistTurns.findIndex(({ date, turn })=>(date == nowDate && turn == nowTurn));
            if (findForTime !== -1) {
                const findStudent = window.listAssistTurns[findForTime].listIds.find((v)=>v == idStudent);
                if (findStudent) return true;
                window.listAssistTurns[findForTime].listIds.push(idStudent);
                return false;
            }
            window.listAssistTurns.push({
                date: nowDate,
                turn: nowTurn,
                listIds: [idStudent]
            });
            return false;
        }
        window.listAssistTurns = [{
            date: nowDate,
            turn: nowTurn,
            listIds: [idStudent]
        }];
        return false;
    }
    pushAssist(data: StudentsData): number {
        var newList = window.listAssist!;
        var newData = data;
        newData['hour'] = encode(moment().format('HH:mm'));
        newData['date'] = encode(moment().format('DD/MM/YYYY'));
        if (window.listAssist) {
            var findIndex = window.listAssist.findIndex((value)=>data.curse == value.curse);
            if (findIndex !== -1) {
                var findList = newList[findIndex].list.find((v)=>v.id == data.id);
                if (findList) return 2;
                newList[findIndex].list.push(newData);
                window.listAssist = newList;
                return 1;
            }
            newList.push({
                curse: newData.curse,
                date: newData.date,
                hour: encode(this.checkHour(true) as string),
                list: [newData]
            });
            window.listAssist = newList;
            return 1;
        }
        var createList = [{
            curse: newData.curse,
            date: newData.date,
            hour: encode(this.checkHour(true) as string),
            list: [newData]
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
    checkCode(code: string) {
        if (code.indexOf('eest') !== -1) {
            var key = code.replace('eest', '');
            if (key.length == 8) return true;
        }
        return false;
    }
    checkHour(get?: boolean | undefined) {
        var now: { hour: number, minutes: number } = { hour: parseInt(moment().format('HH')), minutes: parseInt(moment().format('mm')) };
        var times: TimesAccept[] = [
        /* ##### Mañana ##### */
            /* ##### 7:15 ##### */
            { hour: 7, minMinutes: 0, maxMinutes: 45, result: '7:15' },
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
        if (get) return (find)? find.result: false;
        /*if (find) return true;
        return false;*/
        return !!find;
        //return true;
    }
    checkHourTeacher() {
        const now: { hour: number, minutes: number } = { hour: parseInt(moment().format('HH')), minutes: parseInt(moment().format('mm')) };
        const times: TimesAccept[] = [
            /* ##### Mañana ##### */
            { hour: 7, minMinutes: 0, maxMinutes: 59, result: '7:15' },
            { hour: 8, minMinutes: 0, maxMinutes: 59, result: '7:15' },
            { hour: 9, minMinutes: 0, maxMinutes: 59, result: '7:15' },
            { hour: 10, minMinutes: 0, maxMinutes: 59, result: '7:15' },
            { hour: 11, minMinutes: 0, maxMinutes: 59, result: '7:15' },
            { hour: 12, minMinutes: 0, maxMinutes: 15, result: '7:15' },
            /* ##### Tarde ##### */
            { hour: 12, minMinutes: 30, maxMinutes: 59, result: '13:15' },
            { hour: 13, minMinutes: 0, maxMinutes: 59, result: '13:15' },
            { hour: 14, minMinutes: 0, maxMinutes: 59, result: '13:15' },
            { hour: 15, minMinutes: 0, maxMinutes: 59, result: '13:15' },
            { hour: 16, minMinutes: 0, maxMinutes: 59, result: '13:15' },
            { hour: 17, minMinutes: 0, maxMinutes: 45, result: '13:15' }
        ];
        var find = times.find((value)=>{
            if (value.hour == now.hour)
                if (now.minutes >= value.minMinutes && now.minutes <= value.maxMinutes)
                    return value;
        });
        return !!find;
    }
    waitTime() { return new Promise((res)=>setTimeout(()=>res(true), 1200)); }
}