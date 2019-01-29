import EventResolver from './EventResolver';
class TouchEventResolver extends EventResolver {
    constructor(...param) {
        super(param);
    }

    init() {
        const canvas = this.vegocanvas.canvas;
        // canvas.addEventListener('touchstart', this.)
    }

    getPointFromEvent(e) {
        // DOM implementaion
        return {
            x: e.offsetX,
            y: e.offsetY,
        };
    }
}
