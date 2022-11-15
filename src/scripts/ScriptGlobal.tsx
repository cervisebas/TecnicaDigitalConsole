export default new class ScriptGlobal {
    constructor() {}
    getEvent(className: string, isLoading: boolean, message: string, showIcon: boolean, iconName?: string, iconColor?: string) {
        return new CustomEvent('update-console-render', {
            detail: {
                class: className,
                isLoading,
                message,
                showIcon,
                iconName,
                iconColor
            }
        });
    }
    clearConsole() {
        return document.dispatchEvent(new CustomEvent('clear-console-render', { detail: {} }));
    }
}