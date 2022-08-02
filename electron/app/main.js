"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    var _this = this;
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
    appWindow.on('close', function (event) { return __awaiter(_this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    return [4 /*yield*/, electron_1.dialog.showMessageBox(appWindow, {
                            type: 'question',
                            buttons: ["Aceptar", "Cancelar"],
                            title: "¡¡¡Espere por favor!!!",
                            message: "Estas apunto de cerrar la aplicación.\n¿Estás seguro que quieres realizar esta acción?"
                        })];
                case 1:
                    response = (_a.sent()).response;
                    if (response == 0) {
                        appWindow.destroy();
                        (process.platform !== "darwin") && electron_1.app.quit();
                        return [2 /*return*/];
                    }
                    console.log('Cancel');
                    return [2 /*return*/];
            }
        });
    }); });
    appWindow.webContents.on("before-input-event", function (event, input) { return (input.code == 'F4' && input.alt) && event.preventDefault(); });
    electron_localshortcut_1.default.register(appWindow, 'Ctrl+Shift+F', changeFullScreen);
}
// Eventos principales del proceso.
electron_1.app.on('ready', function () { return init(); });
electron_1.app.on('activate', function () { return (appWindow === null) && init(); });
electron_1.app.on('window-all-closed', function () { return (process.platform !== 'darwin') && electron_1.app.quit(); });
