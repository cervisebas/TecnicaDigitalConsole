import React from 'react';
import ReactDOM from 'react-dom/client';
import { Titlebar, Color } from 'custom-electron-titlebar';
import { Menu } from '@electron/remote';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ipcRenderer } from 'electron';
import { TitlebarOptions } from 'custom-electron-titlebar/dist/interfaces';

var titleOptions: TitlebarOptions = {
  backgroundColor: Color.fromHex('#0c0c0c'),
  titleHorizontalAlignment: 'left',
  menu: new Menu(),
  enableMnemonics: false
};

var titleBar: any = new Titlebar(titleOptions);

ipcRenderer.on('on-fullscreen', (_ev, value: boolean)=>{
  if (!value) return (titleBar == null)&&new Titlebar(titleOptions);
  if (titleBar !== null) {
    titleBar.dispose();
    titleBar = null;
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
