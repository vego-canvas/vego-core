import { throttle } from '../util';
import { SyncHook } from './tapable-modify';
// DOM ordinary EventResolver
class EventResolver {
    constructor(vegocanvas, options = {
        enableMouseOver: 16,
    }) {
        this.vegocanvas = vegocanvas;

        this.enableMouseOver = options.enableMouseOver;
        this.lastPos = null;
        this.lastTarget = null;
        // mouse in out indicator!
        this.oldTarget = null;
        this.canvasboundingbox = this.vegocanvas.canvas.getBoundingClientRect();

        this.canvasPressed = null;
        this.hooks = {
            click: new SyncHook(['event']),
            mousedown: new SyncHook(['event']),
            mousemove: new SyncHook(['event']),
            mouseup: new SyncHook(['event']),
            wheel: new SyncHook(['event']),
        };
        this.init();
    }

    init() {
        const canvas = this.vegocanvas.canvas;
        ['click', 'mousedown', 'mousemove', 'mouseup', 'wheel'].forEach((eventType) => {
            this.hooks[eventType].tap('eventResolver', (event) => {
                const x = event.offsetX;
                const y = event.offsetY;
                event.coordinate = { x, y };
            });
            let listener = (event) => {
                this.hooks[eventType].call(event);
            };
            if (eventType === 'mousemove') {
                if (this.enableMouseOver > 0) {
                    listener = throttle(this, listener, this.enableMouseOver);
                    canvas.addEventListener(eventType, listener);
                }
            } else {
                canvas.addEventListener(eventType, listener);
            }
        });

        /*
         * canvas.addEventListener('click', this.eventExtract(this.clickAtPointHandler).bind(this));
         * canvas.addEventListener('mousedown', this.eventExtract(this.startHander).bind(this));
         * if (this.enableMouseOver > 0) {
         *     canvas.addEventListener('mousemove', throttle(this, this.eventExtract(this.moveHandler), this.enableMouseOver));
         * }
         * canvas.addEventListener('mouseup', this.eventExtract(this.endHandler).bind(this));
         * canvas.addEventListener('wheel', this.eventExtract(this.wheelHandler).bind(this));
         */
    }

    // getPointFromEvent(e) {
    //     // DOM implementaion
    //     return {
    //         x: e.offsetX,
    //         y: e.offsetY,
    //     };
    // }

    // eventExtract(fn) {
    //     return (e) => {
    //         const {
    //             x, y,
    //         } = this.getPointFromEvent(e);
    //         fn.call(this, x, y, e);
    //     };
    // }

    // clickAtPointHandler(x, y) {
    //     const target = this.vegocanvas.getTarget(x, y);
    //     if (!target)
    //         return;

    //     this.vegocanvas.dispatchMouseEvent(target, {
    //         x, y, type: 'click', target, bubble: false,
    //     });
    // }

    // startHander(x, y) {
    //     let target = this.vegocanvas.getTarget(x, y);
    //     if (target) {
    //         this.lastPos = { x, y };
    //         this.lastTarget = target;
    //     } else {
    //         this.canvasPressed = { x, y };
    //     }
    //     target = this.lastTarget || this.vegocanvas;
    //     this.vegocanvas.dispatchMouseEvent(target, {
    //         x,
    //         y,
    //         type: 'pressed',
    //         target,
    //     });
    // }

    // moveHandler(x, y) {
    //     if (this.lastTarget) {
    //         // press
    //         this.vegocanvas.dispatchMouseEvent(this.lastTarget, {
    //             x, y,
    //             type: 'pressmove',
    //             vecX: x - this.lastPos.x,
    //             vecY: y - this.lastPos.y,
    //             target: this.lastTarget,
    //         });
    //     } else if (this.canvasPressed) {
    //         this.vegocanvas.dispatchMouseEvent(this.vegocanvas, {
    //             x, y,
    //             vecX: x - this.canvasPressed.x,
    //             vecY: y - this.canvasPressed.y,
    //             type: 'canvaspressmove',
    //             target: this.vegocanvas,
    //         });
    //     } else {
    //         const target = this.vegocanvas.getTarget(x, y);
    //         // no press
    //         if (this.oldTarget !== target) {
    //             this.vegocanvas.dispatchMouseEvent(this.oldTarget, {
    //                 x, y,
    //                 type: 'mouseleave',
    //                 target: this.oldTarget,
    //             });
    //             this.vegocanvas.dispatchMouseEvent(target, {
    //                 x, y,
    //                 type: 'mouseenter',
    //                 target,
    //             });
    //         }
    //         this.vegocanvas.dispatchMouseEvent(target, {
    //             x, y,
    //             type: 'mousemove',
    //             target,
    //         });
    //         this.oldTarget = target;
    //     }
    // }

    // endHandler(x, y) {
    //     const target = this.lastTarget || this.vegocanvas.getTarget(x, y);
    //     this.vegocanvas.dispatchMouseEvent(target, {
    //         x, y,
    //         type: 'unpressed',
    //         target,
    //     });
    //     this.lastPos = null;
    //     this.lastTarget = null;
    //     this.canvasPressed = null;
    // }

    // wheelHandler(x, y, e) {
    //     this.vegocanvas.dispatchMouseEvent(this.vegocanvas, {
    //         x, y,
    //         delta: {
    //             x: e.deltaX,
    //             y: e.deltaY,
    //             z: e.deltaZ,
    //         },
    //         type: 'wheel',
    //         target: this.vegocanvas,
    //     });
    // }
}
export default EventResolver;
