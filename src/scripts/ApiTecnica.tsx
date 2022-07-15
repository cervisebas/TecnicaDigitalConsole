import moment from "moment";
import { encode, decode } from "base-64";
import StudentSystem from "./scripts/students";

//const UrlBase = "http://localhost/TecnicaDigitalApi";
const UrlBase = "https://tecnica-digital.ga/";
const KeyAccess = encode("Zr4u7x!A%D*G-KaNdRgUkXp2s5v8y/B?E(H+MbQeShVmYq3t6w9z$C&F)J@NcRfU");
const GetKeyVerify = ()=>{
    var keyAccess = decode("VUdMV011UDcwZTZjTm9MTFRIZjZwTjVPOEFDZFJZR3BlVjNJczJ2TXE5QmRoenFtYkk=");
    var dateAccess = encode(moment().format("DD/MM/YYYY"));
    return { keyAccess, dateAccess };
};

const Students = new StudentSystem(UrlBase, KeyAccess, GetKeyVerify());

export {
    UrlBase,
    Students
};
