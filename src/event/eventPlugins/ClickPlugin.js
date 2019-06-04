export default class ClickPlugin {
    constructor(vegocanvas, eventResolver) {
        this.vegocanvas = vegocanvas;
        eventResolver.hooks.click.tap('clickPlugin', (event) => {
            this.clickAtPointHandler(event.coordinate.x, event.coordinate.y);
        });
    }

    clickAtPointHandler(x, y) {
        const target = this.vegocanvas.getTarget(x, y);
        if (!target)
            return;

        this.vegocanvas.dispatchMouseEvent(target, {
            x, y, type: 'click', target, bubble: false,
        });
    }
}

ClickPlugin.support = ['click'];
