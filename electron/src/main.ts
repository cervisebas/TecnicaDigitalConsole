import { app, BrowserWindow } from "electron";
import { enable as enableWebContents, initialize as inicializeRemote } from "@electron/remote/main";
import { initialize as initializeTitlebar } from "electron-react-titlebar/main";
import isDev from "electron-is-dev";
import serve from "electron-serve";
import path from "path";

var appWindow: BrowserWindow | null = null;
var loadURL = serve({ directory: path.join(__dirname, './app/'), scheme: 'app' });

function init() {
    inicializeRemote();
    initializeTitlebar();
    appWindow = new BrowserWindow({
        fullscreen: !isDev,
        minHeight: 619,
        minWidth: 886,
        darkTheme: true,
        frame: false,
        show: true,
        autoHideMenuBar: true,
        icon: `${__dirname}/assets/icon.png`,
        webPreferences: {
            nodeIntegration: true,
            devTools: isDev
        }
    });
    appWindow.menuBarVisible = false;
    appWindow.removeMenu();
    (isDev)&&appWindow.webContents.openDevTools();
    (isDev)? appWindow.loadURL("http://localhost:3000/"): loadURL(appWindow);
    enableWebContents(appWindow.webContents);
    appWindow.on('closed', ()=>appWindow = null);
}

app.on('ready', ()=>init());
app.on('activate', ()=>(appWindow === null)&&init());
app.on('window-all-closed', ()=>(process.platform !== 'darwin')&&app.quit());