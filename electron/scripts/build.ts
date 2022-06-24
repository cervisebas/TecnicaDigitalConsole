import packager from "electron-packager";
import pkg from "../../package.json";

const options: packager.Options = {
    overwrite: true,
    asar: true,
    platform: ['linux', 'win32'],
    arch: 'x64',
    icon: './electron/icons/win/icon.ico',
    prune: true,
    dir: './electron/app',
    out: './electron/build/packager',
    appVersion: pkg.version,
    name: 'TecnicaConsole',
    win32metadata: {
    	CompanyName: 'TecnicaConsole',
    	ProductName: pkg.name.charAt(0).toUpperCase()+pkg.name.slice(1),
    	FileDescription: 'TecnicaConsole',
    	OriginalFilename: `${pkg.name.charAt(0).toUpperCase()+pkg.name.slice(1)}.exe`
    }
};

console.log(`Compilando app Electron: "${options.name}-V${options.appVersion}"`);

packager(options).then((value)=>{
    console.log('Compilacion terminada!!!');
    console.log(value);
}).catch((reason)=>{
    console.log('Ocurrio un error.');
    console.log(reason);
});