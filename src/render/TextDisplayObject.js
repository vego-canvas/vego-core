import Layer from './Layer';
import Graphic from '../graphic';
import { getNewCanvas } from '../canvas';

class TextDisplayObject extends Layer {
    constructor(uid, text, {
        font, color, textAlign, textBaseline,
        // maxWidth,
        outline, lineWidth, lineHeight,
    }) {
        super();
        this.uid = uid;

        // text properties
        this.text = text;
        this.font = font;
        this.color = color;
        // this.maxWidth = maxWidth;
        this.textAlign = textAlign || 'left';
        this.textBaseline = textBaseline || 'top';

        this.outline = outline || 0;
        this.lineHeight = lineHeight || 0;
        this.lineWidth = lineWidth || null;

        this.boundingBox = {};
        const graphic = new Graphic(this._graphicRender.bind(this), this._aftergraphicRender.bind(this));

        Object.defineProperty(this, '$graphic', {
            value: graphic,
        });
    }

    _graphicRender(g) {
        const col = this.color || '#000';

        if (this.outline)
            g.setStrokeStyl(col).setLineWidth(this.outline * 1);
        else
            g.setFillStyle(col);

        this._drawText(this._prepareContext(g));
    }

    _prepareContext(g) {
        return g.setFont(this.font || '12px sans-serif')
            .setTextAlign(this.textAlign || 'left')
            .setTextBaseline(this.textBaseline || 'top')
            .setLineJoin('miter')
            .setMiterLimit(2.5);
    }

    _drawText(g) {
        console.log(this);
        const lineHeight = this.lineHeight || this.getMeasuredLineHeight();
        if (this.lineWidth) {
            /*
             * text wrapping
             * const w = this._getMeasuredWidth(this.text);
             */
            const words = this.text.split(' ');
            const maxWidth = this.lineWidth;
            let line = '';
            let i;
            let test;
            let textWidth;
            let y = 0;

            for (i = 0; i < words.length; i++) {
                test = words[i];
                textWidth = this._getMeasuredWidth(test);
                while (textWidth > maxWidth) {
                    // Determine how much of the word will fit
                    test = test.substring(0, test.length - 1);
                    textWidth = this._getMeasuredWidth(test);
                }

                if (words[i] !== test) {
                    words.splice(i + 1, 0, words[i].substr(test.length));
                    words[i] = test;
                }

                test = line + words[i] + ' ';
                textWidth = this._getMeasuredWidth(test);

                if (textWidth > maxWidth && i > 0) {
                    this._drawTextLine(g, line, y);
                    line = words[i] + ' ';
                    y += lineHeight;
                } else {
                    line = test;
                }
            }
            this._drawTextLine(g, line, y);
            this.boundingBox = {
                width: maxWidth,
                height: lineHeight + y,
            };
        } else {
            this._drawTextLine(g, this.text, 0);
            this.boundingBox({
                width: this._getMeasuredWidth(this.text),
                height: lineHeight,
            });
        }
    }

    _drawTextLine(g, text, y) {
        if (this.outline)
            g.strokeText(text, 0, y);
        else
            g.fillText(text, 0, y);
    }

    _aftergraphicRender() {
        const {
            width, height,
        } = this.boundingBox;
        switch (this.textAlign) {
            case 'start':
            case 'left':
                this.$graphic.cache(0, 0, width, height);
                break;
            case 'center':
                this.$graphic.cache(-width / 2, 0, width, height);
                break;
            case 'right':
            case 'end':
                this.$graphic.cache(-width, 0, width, height);
                break;
            default:
                break;
        }
    }

    getMeasuredLineHeight() {
        return this._getMeasuredWidth('M') * 1.2;
    }

    _getMeasuredWidth(text) {
        let g = TextDisplayObject._workingContext;
        g.save();
        g = this._prepareContext(g);
        const w = g.ctx.measureText(text).width;
        g.restore();
        return w;
    }
}
const {
    canvas, ctx,
} = getNewCanvas();
TextDisplayObject._workingContext = new Graphic().setContext(ctx);

canvas.width = canvas.height = 1;

export default TextDisplayObject;
