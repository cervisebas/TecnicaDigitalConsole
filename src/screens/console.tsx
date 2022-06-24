import React, { Component } from 'react';
import { CustomItem } from '../component/item';

type ItemArray = {
    isLoading: boolean;
    message: string;
    class: string;
    showIcon: boolean;
    iconName?: string;
    iconColor?: string;
};

type IProps = {
    style?: React.CSSProperties | undefined;
};
type IState = {
    itemArray: ItemArray[];
};

export default class Console extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            itemArray: []
        };
        this.initEvent = this.initEvent.bind(this);
    }
    componentDidMount() {
        document.addEventListener('update-console-render', this.initEvent, false);
    }
    componentWillUnmount() {
        document.removeEventListener('update-console-render', this.initEvent, false);
    }
    initEvent(data: any) {
        var findIndex = this.state.itemArray.findIndex((v)=>v.class == data.detail.class);
        var itemArray = this.state.itemArray;
        if (findIndex !== -1) {
            itemArray[findIndex] = data.detail;
            this.setState({ itemArray: itemArray });
        } else {
            itemArray.push(data.detail);
            this.setState({ itemArray: itemArray });
        }
    }
    render(): React.ReactNode {
        return(<div style={{ ...this.props.style, flex: 1, width: '100%', height: '100%', flexDirection: 'column' }}>
            {(this.state.itemArray)&&this.state.itemArray.map((value, index)=><CustomItem
                key={value.class}
                isLoading={value.isLoading}
                message={value.message}
                separator={index !== (this.state.itemArray.length - 1)}
                showIcon={value.showIcon}
                iconName={value.iconName}
                iconColor={value.iconColor}
            />)}
        </div>);
    }
}