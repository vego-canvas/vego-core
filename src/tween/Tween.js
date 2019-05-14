import Easing from './Easing';
import { isFunction } from '../util';
import Tweenlet from './Tweenlet';
import ColorTweenlet from './ColorTweenlet';
const nextFrame = window.requestAnimationFrame;
const lets = [
    Tweenlet,
    ColorTweenlet,
];
/*
 * Tween 要解决的问题：
 * 1、值变化 2、中断动画时
 */
class Tween {
    constructor(duration, easing) {
        let easeFunc = easing;
        if (typeof easeFunc === 'string') {
            easeFunc = Easing[easeFunc];
        }
        // console.log(easeFunc, isFunction(easeFunc))
        if (!isFunction(easeFunc))
            easeFunc = Easing.linear;
            // throw new Error('easing need to be a function');
        if (!duration)
            throw new Error('duration need to be set');
        this.tweenlets = new Map();
        this.duration = duration;
        this.easing = easeFunc;

        this._begin = null;
        this._end = null;
        this._pause = false;
        this._next = null;
    }

    addTweenlet(tweenlet, prefix) {
        if (this.tweenlets.has(prefix)) {
            const curr = this.tweenlets.get(prefix).value;
            this.tweenlets.set(prefix, tweenlet.reset({
                start: curr,
            }));
        } else {
            this.tweenlets.set(prefix, tweenlet);
        }
    }

    _animate(t, res) {
        if (!this._begin) {
            this._begin = t;
            this._end = t + this.duration;
        }
        if (t > this._end) {
            this.tweenlets.forEach((i) => i.theEnd());
            res();
            return;
        }
        const ratio = this.easing((t - this._begin) / this.duration);
        this.tweenlets.forEach((i) => i.run(ratio));
        nextFrame((t) => {
            this._animate(t, res);
        });
    }

    run() {
        return new Promise((res, rej) => {
            nextFrame((t) => {
                this._animate(t, res);
            });
        });
    }
}
function isPrimary(obj) {
    return ['number', 'boolean', 'string', 'undefined'].indexOf(typeof obj) !== -1;
}
function isArray(obj) {
    return Array.isArray(obj);
}
function tweenletFactory(curr, end, context, k) {
    const p = `${curr}`;
    const T = lets.find((l) => l.pattern(p));
    if (!T) {
        throw new Error('no matching tweenlet!');
    }
    return new T(curr, end, context, k);
}

function walkInProps(props, tw, prefix, wrapper) {
    if (!wrapper) {
        wrapper = (content) => `.${content}`;
    }
    if (!isPrimary(props)) {
        // throw 'need a object root from top scope';
        for (const k in props) {
            if (!this.hasOwnProperty(k))
                continue;
            const end = props[k];
            const curr = this[k];
            const endIsPrimary = isPrimary(end);
            const currIsPrimary = isPrimary(curr);

            if (!endIsPrimary && !currIsPrimary) {
                if (isArray(curr) && isArray(end)) {
                    walkInProps.call(curr, end, tw, `${k}`, (content) => `[${content}]`);
                } else {
                    walkInProps.call(curr, end, tw, `${k}`);
                }
            }
            if (endIsPrimary && currIsPrimary && typeof end === typeof curr) {
                const tweenlet = tweenletFactory(curr, end, this, k);
                tw.addTweenlet(
                    tweenlet,
                    `${prefix}${wrapper(k)}`
                );
            }
        }
    }
}
export default function TweenMixin(proto) {
    proto.$to = function (props, duration, easing) {
        const tween = new Tween(duration, easing);
        walkInProps.call(this, props, tween);
        return tween.run();
    };
}
