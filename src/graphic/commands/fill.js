import Base from './basic';

class BeginFill extends Base {
    constructor(style) {
        super();
        this.fillStyle = style;
    }

    exec(ctx) {
        ctx.fillStyle = this.fillStyle;
    }
}
