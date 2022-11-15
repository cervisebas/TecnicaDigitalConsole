import { app, BrowserWindow, dialog } from "electron";
import { enable as enableWebContents, initialize as inicializeRemote } from "@electron/remote/main";
import electronLocalshortcut from "electron-localshortcut";
import isDev from "electron-is-dev";
import serve from "electron-serve";
import path from "path";

// Otros comandos de funciones.
const { setupTitlebar, attachTitlebarToWindow } = require("custom-electron-titlebar/main");
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Variables principales.
var appWindow: BrowserWindow | null = null;
var splashscreen: BrowserWindow | null = null;
const loadURL = serve({ directory: path.join(__dirname, './app/'), scheme: 'app' });

function init() {
    // Inicializar librerias
    inicializeRemote();
    setupTitlebar();

    // Pantalla de carga
    splashscreen = new BrowserWindow({
        fullscreen: true,
        resizable: false,
        frame: true,
        transparent: true,
        show: false,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        icon: `${__dirname}/assets/icon.png`,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            //devTools: isDev,
            webviewTag: true
        }
    });
    splashscreen.menuBarVisible = false;
    splashscreen.removeMenu();
    splashscreen.loadFile('splashscreen/index.html');
    splashscreen.once('ready-to-show', async()=>{
        splashscreen.show();
        await waitTo(5000);
        splashscreen.webContents.executeJavaScript('window.goStart()');
        goWindowApp();
        await waitTo(4000);
        appWindow.show();
        await waitTo(6000);
        splashscreen.hide();
    });
}

function goWindowApp() {
    // Crear ventana principal customizada
    appWindow = new BrowserWindow({
        fullscreen: !isDev,
        minHeight: 619,
        minWidth: 886,
        darkTheme: true,
        frame: false,
        show: false,
        autoHideMenuBar: true,
        icon: `${__dirname}/assets/icon.png`,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            devTools: isDev,
            webviewTag: true
        }
    });
    appWindow.menuBarVisible = false;
    appWindow.removeMenu();
    (isDev)&&appWindow.webContents.openDevTools();
    (isDev)? appWindow.loadURL("http://localhost:3000/"): loadURL(appWindow);
    enableWebContents(appWindow.webContents);
    attachTitlebarToWindow(appWindow);
    
    // Push FullScreen
    var waitFullScreen: boolean = false;
    const changeFullScreen = ()=>{
        if (!waitFullScreen) {
            waitFullScreen = true;
            var isFullScreen = appWindow.isFullScreen();
            appWindow.setFullScreen(!isFullScreen);
            return setTimeout(()=>{ waitFullScreen = false; }, 5000);
        }
        appWindow.webContents.send('on-message', 'Espere 5 segundos para volver a realizar la acción.');
    };
    const openDevTools = ()=>{
        if (isDev) appWindow.webContents.openDevTools();
    };
    // Eventos de la ventana principal.
    appWindow.on('closed', ()=>appWindow = null);
    appWindow.on('enter-full-screen', ()=>appWindow.webContents.send('on-fullscreen', true));
    appWindow.on('leave-full-screen', ()=>appWindow.webContents.send('on-fullscreen', false));
    appWindow.on('ready-to-show', ()=>appWindow.webContents.send('on-fullscreen', appWindow.isFullScreen()));
    appWindow.on('close', async(event)=>{
        event.preventDefault();
        const { response } = await dialog.showMessageBox(appWindow, {
            type: 'question',
            buttons: ["Aceptar", "Cancelar"],
            title: "¡¡¡Espere por favor!!!",
            message: "Estas apunto de cerrar la aplicación.\n¿Estás seguro que quieres realizar esta acción?"
        });
        if (response == 0) {
            appWindow.destroy();
            (process.platform !== "darwin")&&app.quit();
            return;
        }
        console.log('Cancel');
    });
    appWindow.webContents.on("before-input-event", (event,input)=>(input.code=='F4'&&input.alt)&&event.preventDefault());
    electronLocalshortcut.register(appWindow, 'Ctrl+Shift+F', changeFullScreen);
    electronLocalshortcut.register(appWindow, 'Ctrl+Shift+I', openDevTools);
}

// Utils
function waitTo(time: number): Promise<void> {
    return new Promise((resolve)=>setTimeout(resolve, time));
}

// Eventos principales del proceso.
app.on('ready', ()=>setTimeout(init, 3000));
app.on('activate', ()=>(appWindow === null)&&init());
app.on('window-all-closed', ()=>(process.platform !== 'darwin')&&app.quit());