import React, { Component } from 'react';

type IProps = {
    style?: React.CSSProperties | undefined;
};
type IState = {};

export default class Config extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    componentDidMount() {
        
    }
    render(): React.ReactNode {
        return(<div style={{ ...this.props.style, flex: 1, width: '100%', height: '100%' }}>
        </div>);
    }
}