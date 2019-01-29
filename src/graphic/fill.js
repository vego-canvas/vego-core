export default class Fill {
    constructor() {
        /*
         * color
         * A DOMString parsed as CSS <color> value.
         * gradient
         * A CanvasGradient object (a linear or radial gradient).
         * pattern
         * A CanvasPattern object (a repeating image).
         */
        this.fillStyle = '#000';
    }

    begin(ctx) {
        ctx.fillStyle = this.fillStyle;
    }
}
