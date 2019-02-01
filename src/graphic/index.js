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
    'createImageData',
    'createLinearGradient',
    'createPattern',
    'createRadialGradient',
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
    'measureText',
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
            return this;
        };
    });
    return fn;
}

class Graphic {
    constructor(render) {
        this.cached = null;
        this.noStyle = false;
        this.render = render;
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
        this.render(this);
        return this;
    }
}
Object.assign(Graphic.prototype, mkFn(properties));
Object.assign(Graphic.prototype, mkMethodFn(methods));

// export function setContext2d(ctx){

/*
 * }
 * export function setContext2d(ctx) {
 *     Object.defineProperty(Graphic.prototype, 'ctx', {
 *         value: ctx,
 *     });
 * }
 * export function sethitCtx(ctx) {
 *     Object.defineProperty(Graphic.prototype, 'hitCtx', {
 *         value: ctx,
 *     });
 * }
 */
export default Graphic;
