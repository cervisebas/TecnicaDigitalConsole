"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var main_1 = require("@electron/remote/main");
var main_2 = require("electron-react-titlebar/main");
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var electron_serve_1 = __importDefault(require("electron-serve"));
var path_1 = __importDefault(require("path"));
var appWindow = null;
var loadURL = (0, electron_serve_1.default)({ directory: path_1.default.join(__dirname, './app/'), scheme: 'app' });
function init() {
    (0, main_1.initialize)();
    (0, main_2.initialize)();
    appWindow = new electron_1.BrowserWindow({
        fullscreen: !electron_is_dev_1.default,
        minHeight: 619,
        minWidth: 886,
        darkTheme: true,
        frame: false,
        show: true,
        autoHideMenuBar: true,
        icon: "".concat(__dirname, "/assets/icon.png"),
        webPreferences: {
            nodeIntegration: true,
            devTools: electron_is_dev_1.default
        }
    });
    appWindow.menuBarVisible = false;
    appWindow.removeMenu();
    (electron_is_dev_1.default) && appWindow.webContents.openDevTools();
    (electron_is_dev_1.default) ? appWindow.loadURL("http://localhost:3000/") : loadURL(appWindow);
    (0, main_1.enable)(appWindow.webContents);
    appWindow.on('closed', function () { return appWindow = null; });
}
electron_1.app.on('ready', function () { return init(); });
electron_1.app.on('activate', function () { return (appWindow === null) && init(); });
electron_1.app.on('window-all-closed', function () { return (process.platform !== 'darwin') && electron_1.app.quit(); });
