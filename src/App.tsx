import React, { Component } from 'react';
import { ThemeProvider, Pivot, PivotItem } from '@fluentui/react';
import { registerIcons, setIconOptions } from '@fluentui/react/lib/Styling';
import { AcceptIcon, BackIcon, CancelIcon, ChromeBackIcon, ChromeBackMirroredIcon, RefreshIcon } from '@fluentui/react-icons-mdl2';
import { ToastContainer, toast } from 'react-toastify';
import Theme from './Theme';
import Console from './screens/console';
import Config from './screens/config';
import { Students } from './scripts/ApiTecnica';
import ApiConsole from './scripts/ApiConsole';
import 'react-toastify/dist/ReactToastify.css';
import { ipcRenderer } from 'electron';
import BrowserPage from './screens/browser';

type IProps = {};
type IState = {
  selectKey: string;
  mountBrowser: boolean;
};

declare global {
  interface Window {
    Students: any;
    activeConsole: boolean | undefined;
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
    window.Students = Students;
    ApiConsole.init();
    document.dispatchEvent(ApiConsole.getEvent('load-0', true, 'Cargando lista de alumnos...', false));
    Students.getAll()
      .then(()=>{
        window.activeConsole = true;
        document.dispatchEvent(ApiConsole.getEvent('load-0', false, 'El listado de alumnos se guardo y almaceno de forma correcta.', true, 'AcceptIcon'));
      })
      .catch(()=>document.dispatchEvent(ApiConsole.getEvent('load-0', false, 'Ocurrió un error al cargar el listado de alumnos.', true, 'CancelIcon')));
  }
  getTabId(itemKey: string) { return `pivot_panel_${itemKey}`; };
  render(): React.ReactNode {
    return(<ThemeProvider theme={Theme} style={{ width: '100%', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
        <Pivot
          headersOnly={true}
          selectedKey={this.state.selectKey}
          onLinkClick={(key)=>this.setState({ selectKey: key?.props.itemKey!, mountBrowser: true })}
          getTabId={this.getTabId}
          style={{ paddingLeft: 16 }}>
          <PivotItem headerText="Consola" itemKey='console' />
          <PivotItem headerText="Navegador WEB" itemKey='browser' />
          <PivotItem headerText="Configuraciones" itemKey='config' />
        </Pivot>
        <div className={'custom-scroll'} aria-labelledby={this.getTabId(this.state.selectKey)} role={'tabpanel'} style={{ width: '100%', height: '100%', backgroundColor: '#000000', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
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

/*

const appTheme: PartialTheme = {
  palette: {
    themePrimary: 'red'
    ...
  }
};

export const App = () => (
  <ThemeProvider theme={appTheme}>
    App content ...
  </ThemeProvider>
);
*/