import React, { Component } from 'react';
import { ThemeProvider, Pivot, PivotItem } from '@fluentui/react';
import { registerIcons, setIconOptions } from '@fluentui/react/lib/Styling';
import { AcceptIcon, BackIcon, CancelIcon, ChromeBackIcon, ChromeBackMirroredIcon, RefreshIcon } from '@fluentui/react-icons-mdl2';
import { ToastContainer, toast } from 'react-toastify';
import Theme from './Theme';
import Console from './screens/console';
import Config from './screens/config';
import ApiConsole from './scripts/ApiConsole';
import 'react-toastify/dist/ReactToastify.css';
import { ipcRenderer } from 'electron';
import BrowserPage from './screens/browser';
import SyncData from './scripts/SyncData';

type IProps = {};
type IState = {
  selectKey: string;
  mountBrowser: boolean;
};

declare global {
  interface Window {
    activeConsole: boolean | undefined;
    startEventsApp: boolean | undefined;
  }
}

ipcRenderer.on('on-message', (_ev, value: string)=>toast.info(value, { theme: 'dark' }));

export default class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectKey: 'console',
      mountBrowser: false
    };
    this.getTabId = this.getTabId.bind(this);
  }
  componentDidMount() {
    registerIcons({
      icons: {
        AcceptIcon: <AcceptIcon />,
        CancelIcon: <CancelIcon />,
        // Browser
        BackIcon: <BackIcon />,
        ChromeBackIcon: <ChromeBackIcon />,
        ChromeBackMirroredIcon: <ChromeBackMirroredIcon />,
        RefreshIcon: <RefreshIcon />
      }
    });
    setIconOptions({ disableWarnings: true });
    ApiConsole.init();
    SyncData.init();
    ApiConsole.syncStudents();
    this.startEvents();
  }
  startEvents() {
    if (window.startEventsApp) return;
    window.startEventsApp = true;
    document.addEventListener('show-toast', (ev: any)=>toast.info(ev.detail.message, { theme: 'dark' }), false);
    document.addEventListener('change-page', (ev: any)=>this.setState({ selectKey: ev.detail.page }), false);
  }
  getTabId(itemKey: string) {
    return `pivot_panel_${itemKey}`;
  };
  render(): React.ReactNode {
    return(<ThemeProvider theme={Theme} style={{ width: '100%', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
        <Pivot
          headersOnly={true}
          selectedKey={this.state.selectKey}
          onLinkClick={(key)=>this.setState({ selectKey: key?.props.itemKey!, mountBrowser: true })}
          getTabId={this.getTabId}
          style={{ paddingLeft: 16, position: 'relative' }}>
          <PivotItem headerText="Consola" itemKey='console' />
          <PivotItem headerText="Navegador WEB" itemKey='browser' />
          <PivotItem headerText="Configuraciones" itemKey='config' />¿
        </Pivot>
        <div className={'custom-scroll'} id={'scroll-principal'} aria-labelledby={this.getTabId(this.state.selectKey)} role={'tabpanel'} style={{ width: '100%', height: '100%', backgroundColor: '#000000', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
          <Console style={{ display: (this.state.selectKey == 'console')? undefined: 'none' }} />
          <Config style={{ display: (this.state.selectKey == 'config')? undefined: 'none' }} />
          {(this.state.mountBrowser)&&<BrowserPage style={{ display: (this.state.selectKey == 'browser')? undefined: 'none' }} />}
        </div>
      </div>
      <ToastContainer
        position={'bottom-right'}
        autoClose={5000}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        closeButton={false}
      />
    </ThemeProvider>);
  }
}