import EventDispatcher from '../event/EventDispatcher';
import { mat2d } from 'gl-matrix';
import { transformPoint } from '../util';
const DEG_TO_RAD = Math.PI / 180;
// let uid = 0;

export default class Layer extends EventDispatcher {
    constructor() {
        super();
        this.$matrix = mat2d.create();

        this.$geometry = {
            x: 0,
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            skewY: 0,
            regX: 0,
            regY: 0,
        };
        if (!this.$children)
            this.$children = [];
        this.$visible = true;
        this.$parant = null;
        /*
         * isDirty 表示了组件是否需要被重绘 这里应该放在呢？
         * this.isDirty = false;
         */
    }

    addChild(comp) {
        this.$children.push(comp);
        comp.$parant = this;
    }

    _applyTransform(ctx) {
        const mtx = this.$matrix;
        ctx.save();
        ctx.transform(mtx[0], mtx[1], mtx[2], mtx[3], mtx[4], mtx[5]);
    }

    _applyTransformBack(ctx) {
        ctx.restore();
    }

    _appendTransform() {
        const {
            x, y, rotation, scaleX, scaleY, regX, regY,
        } = this.$geometry;
        let {
            skewX, skewY,
        } = this.$geometry;
        let cos;
        let sin;
        const mtx = mat2d.create();
        if (rotation % 360) {
            const r = rotation * DEG_TO_RAD;
            cos = Math.cos(r);
            sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single append operation?
            skewX *= DEG_TO_RAD;
            skewY *= DEG_TO_RAD;
            mat2d.multiply(mtx, mtx, [Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y]);
            mat2d.multiply(mtx, mtx, [cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0]);
        } else {
            mat2d.multiply(mtx, mtx, [cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y]);
        }

        if (regX || regY) {
            // append the registration offset:
            mtx[4] -= regX * mtx[0] + regY * mtx[2];
            mtx[5] -= regX * mtx[1] + regY * mtx[3];
        }
        mat2d.copy(this.$matrix, mtx);
    }

    localToGlobal(payload) {
        const matlist = [this.$matrix];
        let layer = this.$parant;
        while (layer) {
            matlist.unshift(layer.$matrix);
            layer = layer.$parant;
        }
        const matall = mat2d.create();
        matlist.forEach((m) => {
            mat2d.mul(matall, matall, m);
        });
        const point = transformPoint(payload, matall);
        return point;
    }

    _decompose() {
        const target = this.$geometry;
        const mtx = this.$matrix;
        const a = mtx[0];
        const b = mtx[1];
        const c = mtx[2];
        const d = mtx[3];

        target.x = mtx[4];
        target.y = mtx[5];

        target.scaleX = Math.sqrt(a * a + b * b);
        target.scaleY = Math.sqrt(c * c + d * d);

        const skewX = Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);

        const delta = Math.abs(1 - skewX / skewY);
        if (delta < 0.00001) { // effectively identical, can use rotation:
            target.rotation = skewY / DEG_TO_RAD;
            if (this.a < 0 && this.d >= 0) {
                target.rotation += (target.rotation <= 0) ? 180 : -180;
            }
            target.skewX = target.skewY = 0;
        } else {
            target.skewX = skewX / DEG_TO_RAD;
            target.skewY = skewY / DEG_TO_RAD;
        }
        return target;
    }

    _render(ctx) {
        /*
         * 父组件先与子组件绘制
         * console.log(`${this.name} graphics ${this.$graphic.instructions.length}`)
         */
        if (!this.$visible)
            return;
        this._applyTransform(ctx);
        if (this.$graphic) {
            this.$graphic
                .setContext(ctx)
                .draw();
        }
        let i = 0;
        const length = this.$children.length;
        // 保证绘制时子节点增多不会造成问题
        if (length > 0) {
            /*
             * const children = this.$children.slice();
             * this.$children.forEach((comp) => {
             *     // 子组件绘制按写入顺序
             *     comp._render(ctx);
             * });
             */
            while (i < length) {
                this.$children[i]._render(ctx);
                i++;
            }
        }

        if (this.$graphic) {
            this.$graphic
                .setContext(ctx)
                .afterDraw();
        }

        this._applyTransformBack(ctx);
    }

    _getTargets({
        x, y, targets, condition,
    }, currentLayer, mtx) {
        currentLayer = currentLayer || 0;
        const currentLayerMtx = mat2d.create();
        if (!mtx)
            mat2d.copy(currentLayerMtx, this.$matrix);
        else
            mat2d.multiply(currentLayerMtx, mtx, this.$matrix);
        const children = this.$children;
        if (condition(x, y, currentLayerMtx, this.$graphic)) {
            targets.push(this);
        }
        children.forEach((comp) => {
            comp._getTargets({
                x, y, targets, condition,
            }, currentLayer + 1, currentLayerMtx);
        });
    }

    destroy() {
        this.$children = null;
        this.$parant = null;
        this.$matrix = null;
        this.$geometry = null;
    }
}
