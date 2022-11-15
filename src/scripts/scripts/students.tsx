import axios from "axios";
import { encode } from "base-64";
import qs from "qs";
import ScriptGlobal from "../ScriptGlobal";
import { AssistList, StudentsData, tipical } from "./types";

declare global {
    interface Window {
        studentsDatas: StudentsData[] | undefined;
        listAssist: AssistList[] | undefined;
        activeConsole: boolean | undefined;
    }
}

export default class StudentSystem {
    private urlBase: string = '';
    private header_access: { headers: { Authorization: string; } } = { headers: { Authorization: '' } };
    private dataVerify: { keyAccess: string; dateAccess: string; } = { keyAccess: '', dateAccess: '' };
    private onConsult: boolean = false;
    constructor(setUrl: string, setHeaderAccess: string, dataVerify: { keyAccess: string; dateAccess: string; }) {
        this.urlBase = setUrl;
        this.header_access.headers.Authorization = setHeaderAccess;
        this.dataVerify = dataVerify;
    }
    getAll(force?: boolean | undefined): Promise<StudentsData[]> {
        return new Promise(async(resolve, reject)=>{
            try {
                if (window.studentsDatas && force != true) return resolve(window.studentsDatas);
                if (force) await new Promise((finish)=>setTimeout(finish, 2500));
                var postData = qs.stringify({
                    ...this.dataVerify,
                    getAllStudentsConsole: true
                });
                axios.post(`${this.urlBase}/index.php`, postData, this.header_access).then((value)=>{
                    var res: tipical = value.data;
                    if (res.ok) {
                        window.studentsDatas = res.datas;
                        return resolve(res.datas);
                    }
                    reject({ ok: false, cause: (res.cause)? res.cause: 'Ocurrio un error inesperado.' });
                }).catch((error)=>reject({ ok: false, cause: 'Error de conexión.', error }));
            } catch (error) {
                reject({ ok: false, cause: 'Ocurrio un error inesperado.', error });
            }
        });
    }
    sendData(force?: boolean | undefined) {
        const className = (Math.floor(Math.random() * (9999999 - 1000000)) + 1000000).toString();
        if (!window.listAssist) {
            (force)&&document.dispatchEvent(ScriptGlobal.getEvent(className, false, `No se encontraron datos que enviar.`, true, 'CancelIcon', 'red'));
            return;
        }
        if (window.listAssist.length == 0) {
            (force)&&document.dispatchEvent(ScriptGlobal.getEvent(className, false, `No se encontraron datos que enviar.`, true, 'CancelIcon', 'red'));
            return;
        }
        if (this.onConsult) return;
        window.activeConsole = false;
        this.onConsult = true;
        document.dispatchEvent(ScriptGlobal.getEvent(className, true, 'Enviando datos de asistencia...', false));
        const postData = qs.stringify({
            ...this.dataVerify,
            data: encode(JSON.stringify(window.listAssist)),
            setConsoleListAssist: true
        });
        axios.post(`${this.urlBase}/index.php`, postData, this.header_access).then((html)=>{
            try {
                const result: tipical = html.data;
                if (result.ok) {
                    window.listAssist = [];
                    window.activeConsole = true;
                    this.onConsult = false;
                    return document.dispatchEvent(ScriptGlobal.getEvent(className, false, `Datos de asistencia enviados satisfactoriamente.`, true, 'AcceptIcon', 'green'));
                }
                window.activeConsole = true;
                this.onConsult = false;
                return document.dispatchEvent(ScriptGlobal.getEvent(className, false, (result.cause)? result.cause: `Ocurrió un error inesperado al enviar los datos de asistencia.`, true, 'CancelIcon', 'red'));
            } catch {
                window.activeConsole = true;
                this.onConsult = false;
                return document.dispatchEvent(ScriptGlobal.getEvent(className, false, `Ocurrió un error inesperado al enviar los datos de asistencia.`, true, 'CancelIcon', 'red'));
            }
        }).catch(()=>{
            window.activeConsole = true;
            this.onConsult = false;
            return document.dispatchEvent(ScriptGlobal.getEvent(className, false, `Ocurrió un error de red al enviar los datos de asistencia.`, true, 'CancelIcon', 'red'));
        });
    }
    sendDataTeacher(idTeacher: string, time: string): Promise<void> {
        return new Promise((resolve, reject: (reason: { cause: string; code: number; })=>void)=>{
            const postData = qs.stringify({
                ...this.dataVerify,
                setTeacherConsole: true,
                idTeacher,
                time: encode(time)
            });
            axios.post(`${this.urlBase}/index.php`, postData, this.header_access).then((html)=>{
                try {
                    const result: tipical = html.data;
                    if (result.ok) resolve();
                    console.log(result);
                    return reject((result.cause)? (result.cause == 'exist-row')? { cause: 'Ya se registro la asistencia del docente', code: 0 }: { cause: result.cause, code: 1 }: { cause: 'Ocurrió un error inesperado al enviar los datos de asistencia', code: 1 });
                } catch {
                    return reject({
                        cause: 'Ocurrió un error inesperado al enviar los datos de asistencia',
                        code: 1
                    });
                }
            }).catch(()=>{
                return reject({
                    cause: 'Ocurrió un error de red al enviar los datos de asistencia',
                    code: 1
                });
            });
        });
    }
}