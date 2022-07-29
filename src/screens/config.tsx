import React, { Component } from 'react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import ApiConsole from '../scripts/ApiConsole';
import { Students } from '../scripts/ApiTecnica';

type IProps = {
    style?: React.CSSProperties | undefined;
};
type IState = {};

export default class Config extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.syncStudentsNow = this.syncStudentsNow.bind(this);
        this.syncAssistNow = this.syncAssistNow.bind(this);
    }
    goConsolePage() {
        document.dispatchEvent(new CustomEvent('change-page', { detail: { page: 'console' } }));
    }
    showToasMessage(message: string) {
        document.dispatchEvent(new CustomEvent('show-toast', { detail: { message } }));
    }
    syncStudentsNow() {
        this.goConsolePage();
        this.showToasMessage('La sincronización empezara en 5 segundos. Aguarde en la consola por favor.');
        setTimeout(()=>ApiConsole.syncStudents(true), 5000);
    }
    syncAssistNow() {
        this.goConsolePage();
        this.showToasMessage('La sincronización empezara en 5 segundos. Aguarde en la consola por favor.');
        setTimeout(()=>Students.sendData(true), 5000);
    }
    render(): React.ReactNode {
        return(<div style={{ ...this.props.style, flex: 1, width: '100%', height: 'calc(100% - 16px)', paddingTop: 16, paddingLeft: 16 }}>
            <PrimaryButton text={'Sincronizar alumnos'} onClick={this.syncStudentsNow} />
            <PrimaryButton style={{ marginLeft: 8 }} text={'Sincronizar datos de asistencia'} onClick={this.syncAssistNow} />
        </div>);
    }
}