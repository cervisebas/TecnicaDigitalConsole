import { PureComponent, ReactNode } from "react";
import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import './browser.scss';
import { ProgressIndicator } from "@fluentui/react";

type IProps = {
    style?: React.CSSProperties | undefined;
};
type IState = {
    valueInput: string;
    isLoading: boolean;
    progressLoad: number | undefined;
    canGoBack: boolean;
    canGoForward: boolean;
};

const iconStyle = mergeStyles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    paddingLeft: 18
});

export default class BrowserPage extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            valueInput: '',
            isLoading: false,
            progressLoad: undefined,
            canGoBack: false,
            canGoForward: false
        };
        this._submitInput = this._submitInput.bind(this);
        this._updateUrlbar = this._updateUrlbar.bind(this);
        this._startLoad = this._startLoad.bind(this);
        this._stopLoad = this._stopLoad.bind(this);
        this._setProgress = this._setProgress.bind(this);
        this._reloadNow = this._reloadNow.bind(this);
    }
    private webview: Electron.WebviewTag | null = null;
    componentDidMount() {
        this.webview?.addEventListener('did-start-loading', this._startLoad);
        this.webview?.addEventListener('did-stop-loading', this._stopLoad);
        this.webview?.addEventListener('did-start-navigation', this._updateUrlbar);
    }
    componentDidUpdate() {
        if (this.webview?.canGoBack() !== undefined) {
            if (this.webview?.canGoBack() !== this.state.canGoBack) this.setState({ canGoBack: this.webview?.canGoBack()! });
            if (this.webview?.canGoForward() !== this.state.canGoForward) this.setState({ canGoForward: this.webview?.canGoForward()! });
        }
    }

    /* Functions WebView */
    _startLoad() {
        this.setState({ isLoading: true, progressLoad: 0 }, ()=>this._setProgress(0, 0.8, 300));
    }
    async _stopLoad() {
        var progress = this.state.progressLoad;
        await this._setProgress((progress)? progress: 0, 1, 100);
        setTimeout(()=>this.setState({ isLoading: false, progressLoad: undefined }), 100);
    }
    async _setProgress(s: number, e: number, v: number) {
        const nowWait: Promise<boolean> = new Promise((r)=>setTimeout(()=>r(true), v));
        for (let i = s; i < e; i += 0.1) {
            await nowWait;
            this.setState({ progressLoad: i });
        }
        return await nowWait;
    }
    _updateUrlbar(ev: Electron.DidStartNavigationEvent) {
        if (ev.url != "about:blank") this.setState({ valueInput: ev.url });
    }
    _validURL(str: string) {
        var pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i');
        return !!pattern.test(str);
    }
    _transformValidUrl(str: string) {
        return (str.indexOf('http') !== -1 || str.indexOf('https') !== -1)? str: `http://${str}`;
    }
    _submitInput(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key == "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
            var value = this.state.valueInput.trimStart().trimEnd();
            var go = (this._validURL(value))? this._transformValidUrl(value): `https://www.google.com/search?q=${encodeURI(value)}`;
            return this.webview?.loadURL(go);
        }
    }
    _reloadNow() {
        if (!this.state.isLoading)
            this.webview?.reload();
        else 
            this.webview?.stop();
    }
    /* ################# */

    render(): ReactNode {
        return(<div style={{ ...this.props.style, width: '100%', height: '100%' }}>
            <div id={'browser-app'} style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                <div style={{ width: '100%', height: 64, display: 'flex', alignItems: 'center', backgroundColor: '#0C0C0C', position: 'relative' }}>
                    <div className={'buttons'} style={{ height: '100%', display: 'flex', alignItems: 'center', marginRight: 18 }}>
                        {(this.state.canGoBack)&&<Icon iconName={'ChromeBackIcon'} className={`${iconStyle} v-button`} onClick={()=>this.webview?.goBack()} />}
                        <Icon iconName={(this.state.isLoading)? 'CancelIcon': 'RefreshIcon'} onClick={this._reloadNow} className={`${iconStyle} v-button`} />
                        {(this.state.canGoForward)&&<Icon iconName={'ChromeBackMirroredIcon'} className={`${iconStyle} v-button`} onClick={()=>this.webview?.goForward()} />}
                    </div>
                    <input
                        className={'input-search'}
                        placeholder={'Buscar o escribir dirección web'}
                        onKeyDown={this._submitInput}
                        onChange={(ev)=>this.setState({ valueInput: ev.target.value })}
                        type={'search'}
                        value={this.state.valueInput}
                        onFocus={(ev)=>ev.currentTarget.select()}
                    />
                    <ProgressIndicator
                        className="progress-web"
                        progressHidden={!this.state.isLoading}
                        percentComplete={this.state.progressLoad}
                    />
                </div>
                <webview
                    ref={(e: any)=>this.webview = e}
                    src={'https://google.com/'}
                    useragent={'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36.0 (KHTML, like Gecko) Chrome/102.0.5005.148 Safari/537.36.0'}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        outline: 'none'
                    }}
                />
            </div>
        </div>);
    }
}