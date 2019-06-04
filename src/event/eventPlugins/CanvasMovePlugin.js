export default class CanvasMovePlugin {
    constructor(vegocanvas, eventResolver) {
        this.vegocanvas = vegocanvas;
        this.lastPoint = null;
        eventResolver.hooks.mousedown.tap('CanvasMovePlugin', (event) => {
            const { x, y } = event.coordinate;
            this.lastPoint = { x, y };
            this.vegocanvas.dispatchMouseEvent(this.vegocanvas, {
                x,
                y,
                type: 'canvaspressed',
                target: this.vegocanvas,
            });
        });
        eventResolver.hooks.mousemove.tap('CanvasMovePlugin', (event) => {
            const { x, y } = event.coordinate;
            if (this.lastPoint)
                this.vegocanvas.dispatchMouseEvent(this.vegocanvas, {
                    x, y,
                    type: 'canvasmove',
                    vecX: x - this.lastPoint.x,
                    vecY: y - this.lastPoint.y,
                    target: this.vegocanvas,
                });
        });
        eventResolver.hooks.mouseup.tap('CanvasMovePlugin', (event) => {
            const { x, y } = event.coordinate;
            this.lastPoint = null;
            this.vegocanvas.dispatchMouseEvent(this.vegocanvas, {
                x,
                y,
                type: 'canvasunpressed',
                target: this.vegocanvas,
            });
        });
    }
}
CanvasMovePlugin.support = ['canvaspressed', 'canvasmove', 'canvasunpressed'];
