import Layer from '../render/Layer';
import hitTest, { hitTestSpace } from '../util/hitTest';
// import EventResolver from '../event/EventResolver';
import { MouseEvent } from '../event/Event';
import EventResolver from '../event/EventResolver';
import TouchEventResolver from '../event/TouchEventResolver';
import { findmax } from '../util';
/*
 * import Graphics from '../render/graphics';
 * import { setContext2d, sethitCtx } from '../graphic';
 */

export default class VegoCanvas extends Layer {
    constructor(canvas, options = {
        enableMouseOver: 50, // TODO: lower cpu usage, 0 to disable mouseover event
        enableTouch: false, // TODO: enable touch events
    }) {
        super();
        this.canvas = matchDevicePixelRatio(canvas);
        this.ctx = this.canvas.getContext('2d');
        this.ratio = getDevicePixelRatio();
        // cachedRect is for partial rendering
        this.repaintRect = undefined;
        // inject events
        if (options.enableTouch) {
            this.touchEventResolver = new TouchEventResolver(this, {
                enableMouseOver: options.enableMouseOver,
            });
        } else {
            this.eventResolver = new EventResolver(this, {
                enableMouseOver: options.enableMouseOver,
            });
        }
        /*
         * inject Graphic context
         * setContext2d(this.ctx);
         * sethitCtx(hitTestSpace.ctx);
         */

        /*
         * const graphic = new Graphics();
         * Object.defineProperty(this, '$graphic', {
         *     value: graphic,
         * });
         */
    }

    setRepaintRect(target) {
        // TODO 获取目标元素的位置 并赋值给 repaintRect , 类似 getBoundingRect(target)
    }

    render() {
        const ctx = this.ctx;
        const {
            width, height,
        } = this.canvas;
        const ratio = this.ratio;
        // auto clear is default
        if (this.repaintRect) {
            const { x, y, width, height } = this.repaintRect;
            ctx.clearRect(x, y, width, height);
        } else {
            ctx.clearRect(0, 0, width + 1, height + 1);
        }

        ctx.save();
        ctx.scale(ratio, ratio);

        if (this.repaintRect) {
            const { x, y, width, height } = this.repaintRect;
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.clip();
        }

        this._render(ctx);
        ctx.restore();
    }

    getTargetsUnderPoint(x, y) {
        const targets = [];
        const ratio = getDevicePixelRatio();
        this._getTargets({
            x, y, targets,
            condition: (x, y, currentLayerMtx, g) => hitTest(x, y, currentLayerMtx, g, ratio),
        });
        return targets;
    }

    dispatchMouseEvent(target, options) {
        if (!target || !target._dispatch)
            return;
        const event = new MouseEvent(options);
        target._dispatch(event);
    }

    getTarget(x, y) {
        return findmax(this.getTargetsUnderPoint(x, y), 'uid');
    }
}

export function getNewCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return {
        canvas,
        ctx,
    };
}

export function getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
}

export function matchDevicePixelRatio(canvas) {
    const ratio = getDevicePixelRatio();
    const { width, height } = canvas;
    if (ratio !== 1) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    } else {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = '';
        canvas.style.height = '';
    }
    return canvas;
}
