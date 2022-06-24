import React, { PureComponent } from "react";
import { Separator, Spinner, SpinnerSize } from "@fluentui/react";
import { Text } from '@fluentui/react/lib/Text';
import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';

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
export class CustomItem extends PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    render(): React.ReactNode {
        return(<div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 36, alignItems: 'center', position: 'relative' }}>
            {(!this.props.isLoading && this.props.showIcon)&&<Icon aria-label={this.props.iconName} iconName={this.props.iconName!} className={(this.props.iconColor)? (this.props.iconColor == 'red')? iconColor.red: iconColor.green: iconStyle} />}
            {(this.props.isLoading)&&<Spinner size={SpinnerSize.small} style={{ paddingLeft: 12 }} />}
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 12 }}>
                <Text style={{ color: '#CCCCCC' }}>{this.props.message}</Text>
            </div>
            {(this.props.separator)&&<Separator className={styles.separator} />}
        </div>);
    }
}
const styles = mergeStyleSets({
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