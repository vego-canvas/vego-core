class Shadow {
    constructor() {
        /*
         * color
         * A DOMString parsed as a CSS <color> value. The default value is fully-transparent black
         */
        this.shadowColor = '#000';
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 0;
        this.shadowBlur = 0;
    }

    begin(ctx) {
        ctx.shadowColor = this.shadowColor;
        ctx.shadowBlur = this.shadowBlur;
        ctx.shadowOffsetX = this.shadowOffsetX;
        ctx.shadowOffsetY = this.shadowOffsetY;
    }
}
