import moment from "moment";
import { encode, decode } from "base-64";
import StudentSystem from "./scripts/students";

//const UrlBase = "http://localhost/TecnicaDigitalApi";
const UrlBase = "https://tecnicadigital.com.ar/";
const KeyAccess = encode("lDgI5wbTeo5lr6exK4a9GF494sn2t3&#kIVV240sDX#zQvxq4W");
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
