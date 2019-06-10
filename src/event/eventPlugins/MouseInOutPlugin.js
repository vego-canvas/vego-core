function hasMouseInOutListener(displayobj) {
    return displayobj._listeners.mouseenter.length || displayobj._listeners.mouseleave.length;
}
export default class MouseInOutPlugin {
    constructor(vegocanvas, eventResolver) {
        this.vegocanvas = vegocanvas;
        this.oldTarget = null;
        eventResolver.hooks.mousemove.tap('MouseInOutPlugin', (event) => {
            const { x, y } = event.coordinate;
            const target = event.vegoTarget || (event.vegoTarget = this.vegocanvas.getTarget(x, y, hasMouseInOutListener));
            if (this.oldTarget !== target) {
                if (this.oldTarget)
                    this.vegocanvas.dispatchMouseEvent(this.oldTarget, {
                        x, y,
                        type: 'mouseleave',
                        target: this.oldTarget,
                    });
                if (target)
                    this.vegocanvas.dispatchMouseEvent(target, {
                        x, y,
                        type: 'mouseenter',
                        target,
                    });
            }
            this.oldTarget = target;
        });
    }
}
MouseInOutPlugin.support = ['mouseenter', 'mouseleave'];
