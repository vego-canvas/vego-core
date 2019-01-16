import Tweenlet from './Tweenlet';
import colorString from 'color-string';
export default class ColorTweenlet extends Tweenlet {
    calcDistance(end, start) {
        const e = colorString.get(end).value;
        const s = colorString.get(start).value;
        return e.map((o, i) => o - s[i]);
    }

    calcNextStep(start, step) {
        const s = colorString.get(start).value;
        const span = this.span;
        const ppp = s.map((o, i) => ~~(o + step * span[i]));
        // console.log(colorString.to.hex(ppp))
        return colorString.to.hex(ppp);
    }
}
ColorTweenlet.pattern = (p) => colorString.get(p);
