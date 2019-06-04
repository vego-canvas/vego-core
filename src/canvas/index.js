import Layer from '../render/Layer';
import hitTest, { hitTestSpace } from '../util/hitTest';
import { MouseEvent } from '../event/Event';
import EventResolver from '../event/EventResolver';
import TouchEventResolver from '../event/TouchEventResolver';
import { findmax } from '../util';
import { mat2d } from 'gl-matrix';

// 引入 eventPlugin
import ClickPlugin from '../event/eventPlugins/ClickPlugin';
import CanvasMovePlugin from '../event/eventPlugins/CanvasMovePlugin';
import WheelPlugin from '../event/eventPlugins/WheelPlugin';
import MouseInOutPlugin from '../event/eventPlugins/MouseInOutPlugin';
import PressMovePlugin from '../event/eventPlugins/PressMovePlugin';

function transformPoint(point, mtx) {
    return {
        x: mtx[0] * point.x + mtx[2] * point.y + mtx[4],
        y: mtx[1] * point.x + mtx[3] * point.y + mtx[5],
    };
}

export default class VegoCanvas extends Layer {
    constructor(canvas, options = {
        enableMouseOver: 50, // TODO: lower cpu usage, 0 to disable mouseover event
        enableTouch: false, // TODO: enable touch events
    }) {
        super();
        this.canvas = matchDevicePixelRatio(canvas);
        this.ctx = this.canvas.getContext('2d');
        this.ratio = getDevicePixelRatio();
        this.hitTestSpaceCtx = hitTestSpace.ctx;
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

        // plugin event resolvers
        this.eventPlugins = [
            new ClickPlugin(this, this.eventResolver),
            new CanvasMovePlugin(this, this.eventResolver),
            new WheelPlugin(this, this.eventResolver),
            new MouseInOutPlugin(this, this.eventResolver),
            new PressMovePlugin(this, this.eventResolver),
        ];

        this._registGesture();
    }

    setRepaintRect(target) {
        // TODO 获取目标元素的位置 并赋值给 repaintRect , 类似 getBoundingRect(target)
    }

    _registGesture() {
        let cache = null;
        this.$regist('canvaspressed', () => {
            cache = { x: this.$geometry.x, y: this.$geometry.y };
        });
        this.$regist('canvasmove', ({ vecX, vecY, x, y }) => {
            this.$geometry.x = cache.x + vecX;
            this.$geometry.y = cache.y + vecY;
            this._appendTransform();
            this.render();
        });

        this.$regist('wheel', (payload) => {
            let scale = this.$matrix[0] + payload.delta.y * -0.01;
            scale = Math.min(Math.max(1, scale), 4);
            const invertMtx = mat2d.create();
            const nextMtx = mat2d.create();
            mat2d.invert(invertMtx, this.$matrix);
            const point = transformPoint(payload, invertMtx);
            nextMtx[0] = scale;
            nextMtx[3] = scale;
            const after = transformPoint(point, nextMtx);
            nextMtx[4] += payload.x - after.x;
            nextMtx[5] += payload.y - after.y;
            this.$matrix = nextMtx;
            this._decompose();
            this.render();
        });
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

    saveImage() {
        return this.canvas.toDataURL();
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
export function matchDevicePixelRatioWH(canvas, width, height) {
    const ratio = getDevicePixelRatio();
    if (ratio !== 1) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
    } else {
        canvas.width = width;
        canvas.height = height;
    }
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    return canvas;
}

export function matchDevicePixelRatio(canvas) {
    const ratio = getDevicePixelRatio();
    const { width, height } = canvas;
    if (ratio !== 1) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
    } else {
        canvas.width = width;
        canvas.height = height;
    }
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    return canvas;
}
