"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_packager_1 = __importDefault(require("electron-packager"));
var package_json_1 = __importDefault(require("../../package.json"));
var options = {
    overwrite: true,
    asar: true,
    platform: ['linux', 'win32'],
    arch: 'x64',
    icon: './electron/icons/win/icon.ico',
    prune: true,
    dir: './electron/app',
    out: './electron/build/packager',
    appVersion: package_json_1.default.version,
    name: 'TecnicaConsole',
    win32metadata: {
        CompanyName: 'TecnicaConsole',
        ProductName: package_json_1.default.name.charAt(0).toUpperCase() + package_json_1.default.name.slice(1),
        FileDescription: 'TecnicaConsole',
        OriginalFilename: "".concat(package_json_1.default.name.charAt(0).toUpperCase() + package_json_1.default.name.slice(1), ".exe")
    }
};
console.log("Compilando app Electron: \"".concat(options.name, "-V").concat(options.appVersion, "\""));
(0, electron_packager_1.default)(options).then(function (value) {
    console.log('Compilacion terminada!!!');
    console.log(value);
}).catch(function (reason) {
    console.log('Ocurrio un error.');
    console.log(reason);
});
