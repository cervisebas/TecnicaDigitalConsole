import * as builder from 'electron-builder';
import pkg from '../../package.json';

console.log('Espere...');
builder.build({
    x64: true,
    linux: ['deb'],
    projectDir: 'electron/app',
    dir: true,
    config: {
        asar: true,
        buildVersion: pkg.version,
        directories: {
            output: '../build',
            buildResources: 'icons'
        },
        productName: 'TecnicaConsole',
        linux: {
            target: 'deb',
            category: 'Education'
        }
    }
})
.then(()=>console.log('Completado!'))
.catch(()=>console.log('Ocurrio un error.'));