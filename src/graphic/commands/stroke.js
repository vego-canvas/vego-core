export default class Stroke {
    constructor() {
        /* "butt" || "round" || "square"; */
        this.lineCap = 'butt';
        /*
         * 0.0
         * line dash 从何开始
         */
        this.lineDashOffset = 0.0;

        /*  "bevel" || "round" || "miter" */
        this.lineJoin = 'miter';
        /* miter line join default to 10.0 */
        this.miterLimit = 10.0;

        /* 线宽 */
        this.lineWidth = 1.0;
        /*
         * color
         * A DOMString parsed as CSS <color> value.
         * gradient
         * A CanvasGradient object (a linear or radial gradient).
         * pattern
         * A CanvasPattern object (a repeating image).
         */
        this.strokeStyle = '#000';

        /* style linked list */
        this.next = null;
        this.prev = null;
    }

    exec(ctx) {
        ctx.lineCap = this.lineCap;
        ctx.lineDashOffset = this.lineDashOffset;
        ctx.lineJoin = this.lineJoin;
        ctx.miterLimit = this.miterLimit;
        ctx.strokeStyle = this.strokeStyle;
    }
}
