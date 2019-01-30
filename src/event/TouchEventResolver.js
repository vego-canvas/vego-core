import { throttle } from '../util';
import EventResolver from './EventResolver';
class TouchEventResolver extends EventResolver {
    init() {
        const canvas = this.vegocanvas.canvas;
        canvas.addEventListener('touchstart', this.eventExtract(this.startHander).bind(this));
        canvas.addEventListener('touchmove', throttle(this, this.eventExtract(this.moveHandler), this.enableMouseOver));
        canvas.addEventListener('touchend', this.eventExtract(this.endHandler).bind(this));
    }

    getPointFromEvent(e) {
        // DOM implementaion
        const {
            left,
            top,
        } = this.canvasboundingbox;

        return {
            x: e.clientX - left,
            y: e.clientY - top,
        };
    }

    eventExtract(fn) {
        return (e) => {
            let x = 0;
            let y = 0;
            if (e.touches.length) {
                const touch = e.touches[0];
                const pos = this.getPointFromEvent(touch);
                x = pos.x;
                y = pos.y;
            }
            fn.call(this, x, y);
        };
    }
}

export default TouchEventResolver;
