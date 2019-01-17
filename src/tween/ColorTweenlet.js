import Tweenlet from './Tweenlet';
import { Color } from 'css-fruit';
export default class ColorTweenlet extends Tweenlet {
    calcDistance(end, start) {
        const e = new Color(end);
        const s = new Color(start);
        return [
            e.r - s.r,
            e.g - s.g,
            e.b - s.b,
        ];
    }

    calcNextStep(start, step) {
        const s = new Color(start);
        const span = this.span;
        const ppp = new Color(
            s.r + step * span[0],
            s.g + step * span[1],
            s.b + step * span[2]
        );
        return ppp.toHex(false);
    }
}
ColorTweenlet.pattern = (p) => new Color(p).valid;

/*
 * import colorString from 'color-string';
 * export default class ColorTweenlet extends Tweenlet {
 *     calcDistance(end, start){
 *         const e = colorString.get(end).value
 *         const s = colorString.get(start).value
 *         return e.map((o, i) => o - s[i]);
 *     }
 *     calcNextStep(start, step){
 *         const s = colorString.get(start).value
 *         const span = this.span;
 *         const ppp = s.map((o, i) => ~~(o + step * span[i]));
 *         // console.log(colorString.to.hex(ppp))
 *         return colorString.to.hex(ppp);
 *     }
 * }
 */
