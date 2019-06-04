export default class PressMovePlugin {
    constructor(vegocanvas, eventResolver) {
        this.vegocanvas = vegocanvas;
        this.lastPoint = null;
        this.lastTarget = null;
        eventResolver.hooks.mousedown.tap('PressMovePlugin', (event) => {
            const { x, y } = event.coordinate;
            this.lastPoint = { x, y };
            const target = event.vegoTarget || (event.vegoTarget = this.vegocanvas.getTarget(x, y));
            this.lastTarget = target;
            if (target)
                this.vegocanvas.dispatchMouseEvent(target, {
                    x,
                    y,
                    type: 'pressed',
                    target,
                });
        });
        eventResolver.hooks.mousemove.tap('PressMovePlugin', (event) => {
            const { x, y } = event.coordinate;
            if (this.lastTarget) {
                this.vegocanvas.dispatchMouseEvent(this.lastTarget, {
                    x, y,
                    type: 'pressmove',
                    vecX: x - this.lastPoint.x,
                    vecY: y - this.lastPoint.y,
                    target: this.lastTarget,
                });
            }
        });
        eventResolver.hooks.mouseup.tap('PressMovePlugin', (event) => {
            const { x, y } = event.coordinate;
            if (this.lastTarget)
                this.vegocanvas.dispatchMouseEvent(this.lastTarget, {
                    x, y,
                    type: 'unpressed',
                    target: this.lastTarget,
                });
            this.lastPoint = null;
            this.lastTarget = null;
        });
    }
}
PressMovePlugin.support = ['pressed', 'pressmove', 'unpressed'];
