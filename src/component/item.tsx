import React, { PureComponent } from "react";
import { Separator, Spinner, SpinnerSize } from "@fluentui/react";
import { Text } from '@fluentui/react/lib/Text';
import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';
import moment from "moment";

const iconStyle = mergeStyles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    paddingLeft: 12
});

const iconColor = mergeStyleSets({
    green: [{ color: '#00FF00' }, iconStyle],
    red: [{ color: '#FF0000' }, iconStyle]
});

type IProps = {
    isLoading: boolean;
    message: string;
    separator: boolean;
    showIcon?: boolean;
    iconName?: string;
    iconColor?: string;
};
type IState = {
    time: string;
};

export class CustomItem extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            time: 'Obteniendo...'
        };
    }
    componentDidMount(): void {
        this.setState({
            time: moment().format("HH:mm[hs]")
        });
    }
    render(): React.ReactNode {
        return(<div className={styles.item_contain}>
            {(!this.props.isLoading && this.props.showIcon)&&<Icon aria-label={this.props.iconName} iconName={this.props.iconName!} className={(this.props.iconColor)? (this.props.iconColor == 'red')? iconColor.red: iconColor.green: iconStyle} />}
            {(this.props.isLoading)&&<Spinner size={SpinnerSize.small} style={{ paddingLeft: 12 }} />}
            <div className={styles.item_content}>
                <Text style={{ color: '#CCCCCC' }}>{this.props.message}</Text>
            </div>
            <Text className={styles.item_time}>{this.state.time}</Text>
            {(this.props.separator)&&<Separator className={styles.separator} />}
        </div>);
    }
}
const styles = mergeStyleSets({
    item_contain: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 36,
        alignItems: 'center',
        position: 'relative'
    },
    item_content: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 12
    },
    item_time: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
        paddingRight: 12,
        color: '#CCCCCC',
        display: 'flex',
        alignItems: 'center'
    },
    separator: {
        position: 'absolute',
        bottom: 0,
        left: 8,
        right: 8,
        width: 'calc(100% - 16px)',
        padding: 0,
        height: 2,
        opacity: 0.15
    }
});