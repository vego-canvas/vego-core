export default class WheelPlugin {
    constructor(vegocanvas, eventResolver) {
        this.vegocanvas = vegocanvas;
        eventResolver.hooks.wheel.tap('WheelPlugin', (event) => {
            this.wheelHandler(event.coordinate.x, event.coordinate.y, event);
        });
    }

    wheelHandler(x, y, e) {
        this.vegocanvas.dispatchMouseEvent(this.vegocanvas, {
            x, y,
            delta: {
                x: e.deltaX,
                y: e.deltaY,
                z: e.deltaZ,
            },
            type: 'wheel',
            target: this.vegocanvas,
        });
    }
}
WheelPlugin.support = ['wheel'];
