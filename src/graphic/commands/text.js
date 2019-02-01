class Text {
    constructor() {
        /* direction */

        this.font = '10px sans-serif';
        /* "left" || "right" || "center" || "start" || "end"; */
        this.textAlign = 'start';
        /* "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom"; */
        this.textBaseline = 'alphabetic';
    }

    begin(ctx) {
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
    }
}
