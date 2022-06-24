"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var main_1 = require("@electron/remote/main");
var electron_localshortcut_1 = __importDefault(require("electron-localshortcut"));
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var electron_serve_1 = __importDefault(require("electron-serve"));
var path_1 = __importDefault(require("path"));
// Otros comandos funcionales.
var _a = require("custom-electron-titlebar/main"), setupTitlebar = _a.setupTitlebar, attachTitlebarToWindow = _a.attachTitlebarToWindow;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
// Variables principales.
var appWindow = null;
var loadURL = (0, electron_serve_1.default)({ directory: path_1.default.join(__dirname, './app/'), scheme: 'app' });
function init() {
    // Inicializar librerias
    (0, main_1.initialize)();
    setupTitlebar();
    // Crear ventana principal customizada
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
            contextIsolation: false,
            webSecurity: false,
            devTools: electron_is_dev_1.default,
            webviewTag: true
        }
    });
    appWindow.menuBarVisible = false;
    appWindow.removeMenu();
    (electron_is_dev_1.default) && appWindow.webContents.openDevTools();
    (electron_is_dev_1.default) ? appWindow.loadURL("http://localhost:3000/") : loadURL(appWindow);
    (0, main_1.enable)(appWindow.webContents);
    attachTitlebarToWindow(appWindow);
    // Push FullScreen
    var waitFullScreen = false;
    var changeFullScreen = function () {
        if (!waitFullScreen) {
            waitFullScreen = true;
            var isFullScreen = appWindow.isFullScreen();
            appWindow.setFullScreen(!isFullScreen);
            return setTimeout(function () { waitFullScreen = false; }, 5000);
        }
        appWindow.webContents.send('on-message', 'Espere 5 segundos para volver a realizar la acción.');
    };
    // Eventos de la ventana principal.
    appWindow.on('closed', function () { return appWindow = null; });
    appWindow.on('enter-full-screen', function () { return appWindow.webContents.send('on-fullscreen', true); });
    appWindow.on('leave-full-screen', function () { return appWindow.webContents.send('on-fullscreen', false); });
    appWindow.on('ready-to-show', function () { return appWindow.webContents.send('on-fullscreen', appWindow.isFullScreen()); });
    electron_localshortcut_1.default.register(appWindow, 'Ctrl+Shift+F', changeFullScreen);
}
// Eventos principales del proceso.
electron_1.app.on('ready', function () { return init(); });
electron_1.app.on('activate', function () { return (appWindow === null) && init(); });
electron_1.app.on('window-all-closed', function () { return (process.platform !== 'darwin') && electron_1.app.quit(); });
