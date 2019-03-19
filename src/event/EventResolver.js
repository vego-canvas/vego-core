import { throttle } from '../util';
// DOM ordinary EventResolver
class EventResolver {
    constructor(vegocanvas, options = {
        enableMouseOver: 50,
    }) {
        this.vegocanvas = vegocanvas;

        this.enableMouseOver = options.enableMouseOver;
        this.lastPos = null;
        this.lastTarget = null;
        // mouse in out indicator!
        this.oldTarget = null;
        this.canvasboundingbox = this.vegocanvas.canvas.getBoundingClientRect();

        this.init();
    }

    init() {
        const canvas = this.vegocanvas.canvas;
        canvas.addEventListener('click', this.eventExtract(this.clickAtPointHandler).bind(this));
        canvas.addEventListener('mousedown', this.eventExtract(this.startHander).bind(this));
        if (this.enableMouseOver > 0) {
            canvas.addEventListener('mousemove', throttle(this, this.eventExtract(this.moveHandler), this.enableMouseOver));
        }
        canvas.addEventListener('mouseup', this.eventExtract(this.endHandler).bind(this));
    }

    getPointFromEvent(e) {
        // DOM implementaion
        return {
            x: e.offsetX,
            y: e.offsetY,
        };
    }

    eventExtract(fn) {
        return (e) => {
            const {
                x, y,
            } = this.getPointFromEvent(e);
            fn.call(this, x, y);
        };
    }

    clickAtPointHandler(x, y) {
        const target = this.vegocanvas.getTarget(x, y);
        if (!target)
            return;

        this.vegocanvas.dispatchMouseEvent(target, {
            x, y, type: 'click', target, bubble: false,
        });
    }

    startHander(x, y) {
        const target = this.vegocanvas.getTarget(x, y);
        if (target) {
            this.lastPos = { x, y };
            this.lastTarget = target;
            this.vegocanvas.dispatchMouseEvent(this.lastTarget, {
                x,
                y,
                type: 'pressed',
                target: this.lastTarget,
            });
        }
    }

    moveHandler(x, y) {
        if (this.lastTarget) {
            // press
            this.vegocanvas.dispatchMouseEvent(this.lastTarget, {
                x, y,
                type: 'pressmove',
                vecX: x - this.lastPos.x,
                vecY: y - this.lastPos.y,
                target: this.lastTarget,
            });
        } else {
            const target = this.vegocanvas.getTarget(x, y);
            // no press
            if (this.oldTarget !== target) {
                this.vegocanvas.dispatchMouseEvent(this.oldTarget, {
                    x, y,
                    type: 'mouseleave',
                    target: this.oldTarget,
                });
                this.vegocanvas.dispatchMouseEvent(target, {
                    x, y,
                    type: 'mouseenter',
                    target,
                });
            }
            this.vegocanvas.dispatchMouseEvent(target, {
                x, y,
                type: 'mousemove',
                target,
            });
            this.oldTarget = target;
        }
    }

    endHandler(x, y) {
        const target = this.lastTarget || this.vegocanvas.getTarget(x, y);
        this.vegocanvas.dispatchMouseEvent(target, {
            x, y,
            type: 'unpressed',
            target,
        });
        this.lastPos = null;
        this.lastTarget = null;
    }
}
export default EventResolver;
