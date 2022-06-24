import axios from "axios";
import qs from "qs";
import { StudentsData, tipical } from "./types";

declare global {
    interface Window {
        studentsDatas: StudentsData[] | undefined;
    }
}

export default class StudentSystem {
    private urlBase: string = '';
    private header_access: { headers: { Authorization: string; } } = { headers: { Authorization: '' } };
    private dataVerify: { keyAccess: string; dateAccess: string; } = { keyAccess: '', dateAccess: '' };
    constructor(setUrl: string, setHeaderAccess: string, dataVerify: { keyAccess: string; dateAccess: string; }) {
        this.urlBase = setUrl;
        this.header_access.headers.Authorization = setHeaderAccess;
        this.dataVerify = dataVerify;
    }
    getAll(): Promise<StudentsData[]> {
        return new Promise((resolve, reject)=>{
            try {
                if (window.studentsDatas) return resolve(window.studentsDatas);
                var postData = qs.stringify({
                    ...this.dataVerify,
                    getAllStudentsConsole: true
                });
                axios.post(`${this.urlBase}/index.php`, postData, this.header_access).then((value)=>{
                    var res: tipical = value.data;
                    if (res.ok) {
                        window.studentsDatas = res.datas;
                        resolve(res.datas);
                    } else reject({ ok: false, cause: (res.cause)? res.cause: 'Ocurrio un error inesperado.' });
                }).catch((error)=>reject({ ok: false, cause: 'Error de conexión.', error }));
            } catch (error) {
                reject({ ok: false, cause: 'Ocurrio un error inesperado.', error });
            }
        });
    }
}