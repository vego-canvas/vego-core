/*
 * import Fill from './commands/fill';
 * import Stroke from './commands/stroke';
 * import Shadow from './commands/shadow';
 * import text from './commands/text';
 */
/*
 * 我们的目标是：
 * 在整体减少 context2d 的切换次数
 * 策略：1、提取状态转换和转换后的指令集合，减少总体上的状态切换次数
 *      2、sprite 离屏绘制
 *      3、视野外的绘制，是否需要主动减少？这部留给框架，还是用户去解决？
 *      4、讲道理一般容器上绘制的图形变化是最小的，是否考虑启用手动调用离线缓存成图像，通过clip来绘制子组件位置
 *
 *                      正常    非法
 * line[Width/Join/Cap] 40+     100+
 * [fill/stroke]Style   100+    200+
 * font                 1000+   1000+
 * text[Align/Baseline] 60+     100+
 * shadow[Blur/OffsetX] 40+     100+
 * shadowColor          280+    400+
 */

// TODO: Graphic is a chainable API to construct instructions
import { getNewCanvas, getDevicePixelRatio, matchDevicePixelRatioWH } from '../canvas';
const properties = [
    'canvas',
    'currentTransform',
    'direction',
    'fillStyle',
    'filter',
    'font',
    'globalAlpha',
    'globalCompositeOperation',
    'imageSmoothingEnabled',
    'imageSmoothingQuality',
    'lineCap',
    'lineDashOffset',
    'lineJoin',
    'lineWidth',
    'miterLimit',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'strokeStyle',
    'textAlign',
    'textBaseline',
];

const methods = [
    'arc',
    'arcTo',
    'beginPath',
    'bezierCurveTo',
    'clearRect',
    'clip',
    'closePath',
    /*
     * These methods can not be chianed
     * 'createImageData',
     * 'createLinearGradient',
     * 'createPattern',
     * 'createRadialGradient',
     * 'measureText'
     */
    'drawFocusIfNeeded',
    'drawImage',
    'ellipse',
    'fill',
    'fillRect',
    'fillText',
    'getImageData',
    'getLineDash',
    'isPointInPath',
    'isPointInStroke',
    'lineTo',
    'moveTo',
    'putImageData',
    'quadraticCurveTo',
    'rect',
    'restore',
    'rotate',
    'save',
    'scale',
    'setLineDash',
    'setTransform',
    'stroke',
    'strokeRect',
    'strokeText',
    'transform',
    'translate',
];

function mkFnName(property) {
    return `set${property[0].toUpperCase()}${property.slice(1)}`;
}

function mkFn(properties) {
    const fn = {};
    properties.forEach((p) => {
        fn[mkFnName(p)] = function (val) {
            // lock style to increase hit test performace
            if (!this.noStyle && this._ctx[p] !== val) {
                this._ctx[p] = val;
            }
            return this;
        };
    });
    return fn;
}
function mkMethodFn(methods) {
    const fn = {};
    methods.forEach((m) => {
        fn[m] = function (...param) {
            this._ctx[m](...param);
            // console.log(`${m} ( ${param} )`);
            return this;
        };
    });
    return fn;
}
// 测试用
// const div = document.createElement('div');
// div.style.position = 'absolute';
// div.style.zIndex = '9999';
// div.style.background = '#fff';
// div.style.left = '280px';
// div.style.top = '770px';
// document.body.appendChild(div);
class Graphic {
    constructor(render, afterRender) {
        this.cached = null;
        this.noStyle = false;
        this.render = render;
        this.afterRender = afterRender;
        this.ratio = getDevicePixelRatio();
        this.uncache();
    }

    get ctx() {
        return this._ctx;
    }

    cache(x, y, width, height) {
        if (this.cached)
            return;
        this.cached = true;
        this.cacheCanvas.width = width;
        this.cacheCanvas.height = height;
        // 高分屏cache处理
        // const ratio = this.ratio;
        // if (ratio !== 1) {
        //     this.cacheCanvas.width = width * ratio;
        //     this.cacheCanvas.height = height * ratio;
        //     this.cacheCanvas.style.width = `${width}px`;
        //     this.cacheCanvas.style.height = `${height}px`;
        // }
        this.cacheMeta = {
            x, y, width, height,
        };
        const ctx = this._ctx;
        this._ctx = this.cacheCtx;

        // this._ctx.clearRect(0, 0, width * ratio + 1, height * ratio + 1);
        this._ctx.save();
        // this._ctx.scale(ratio, ratio);
        this._ctx.translate(-x, -y);
        this.render(this);

        this._ctx.restore();
        this._ctx = ctx;

        // div.appendChild(this.cacheCanvas);
    }

    uncache() {
        const {
            canvas, ctx,
        } = getNewCanvas();
        this.cacheCanvas = canvas;
        this.cacheCtx = ctx;
        this.cached = false;
    }

    setContext(ctx) {
        this._ctx = ctx;
        return this;
    }

    lockStyle() {
        this.noStyle = true;
        return this;
    }

    unlockStyle() {
        this.noStyle = false;
        return this;
    }

    draw() {
        if (this.cached) {
            const {
                x, y, width, height,
            } = this.cacheMeta;
            this.drawImage(this.cacheCanvas, x, y, width, height);
        } else {
            this.render(this);
        }
        return this;
    }

    // 针对cache做了一些处理，暂时先这么放着，主要是为了能够把cache好了的东西直接渲染上去，不渲染第一遍在图上的内容
    afterDraw() {
        if (!this.cached && this.afterRender) {
            this.afterRender(this);
            if (this.cached)
                this.draw();
        }
        return this;
    }
}
Object.assign(Graphic.prototype, mkFn(properties));
Object.assign(Graphic.prototype, mkMethodFn(methods));
export default Graphic;
