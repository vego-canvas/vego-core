import Layer from './Layer';
import Graphic from '../graphic';
import { getNewCanvas } from '../canvas';

class TextDisplayObject extends Layer {
    constructor(text, {
        font, color, textAlign, textBaseline,
        // maxWidth,
        outline, lineWidth, lineHeight,
        nocache, textVerticalAlign,
    }) {
        super();
        // this.uid = uid;

        this.boundingBox = {};
        const graphic = new Graphic(this._graphicRender.bind(this), this._aftergraphicRender.bind(this));

        // text properties
        this.text = text;
        this.font = font;
        this.color = color;
        // this.maxWidth = maxWidth;
        this.textAlign = textAlign || 'left';
        this.textBaseline = textBaseline || 'top';
        this.textVerticalAlign = textVerticalAlign || 'top';

        this.outline = outline || 0;
        this.lineHeight = lineHeight || 0;
        this.lineWidth = lineWidth || null;
        this.nocache = nocache || false;

        Object.defineProperty(this, '$graphic', {
            value: graphic,
        });
    }

    _graphicRender(g) {
        if (!this.text)
            return;
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
        const lineHeight = this.lineHeight || this.getMeasuredLineHeight();
        this.lineHeight = lineHeight;
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
            let paragraphs;
            let textWidth;
            let y = 0;
            let needReturn = false;

            for (i = 0; i < words.length; i++) {
                test = words[i];
                paragraphs = test.split('\n');
                if (paragraphs.length > 1) {
                    test = paragraphs[0];
                    needReturn = true;
                }
                textWidth = this._getMeasuredWidth(test);
                while (textWidth > maxWidth) {
                    // Determine how much of the word will fit
                    test = test.substring(0, test.length - 1);
                    textWidth = this._getMeasuredWidth(test);
                }

                if (words[i] !== test) {
                    words.splice(i + 1, 0, words[i].substr(paragraphs.length > 1 ? test.length + 1 : test.length));
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
                if (needReturn) {
                    this._drawTextLine(g, test, y);
                    line = '';
                    y += lineHeight;
                }
            }
            this._drawTextLine(g, line, y);
            this.boundingBox = {
                width: maxWidth,
                height: ~~(lineHeight + y),
            };
        } else {
            this._drawTextLine(g, this.text, 0);
            this.boundingBox = {
                width: this._getMeasuredWidth(this.text),
                height: ~~lineHeight,
            };
        }
    }

    _drawTextLine(g, text, y) {
        if (this.outline)
            g.strokeText(text, 0, y);
        else
            g.fillText(text, 0, y);
    }

    _aftergraphicRender() {
        if (this.textVerticalAlign === 'middle'
            && this.$parant.boundingBox.height
            && this.boundingBox.height) {
            this.$geometry.y = (this.$parant.boundingBox.height
                - this.boundingBox.height * this.$geometry.scaleY
                + this.lineHeight * this.$geometry.scaleY) / 2;
            this._appendTransform();
        }
        if (!this.text || this.nocache)
            return;
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
        return this._getMeasuredWidth('M') * 1.5;
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
