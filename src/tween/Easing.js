// --------------------------------------------------
// easing.js v0.5.4
// Generic set of easing functions with AMD support
// https://github.com/danro/easing-js
// This code may be freely distributed under the MIT license
// http://danro.mit-license.org/
// --------------------------------------------------
// All functions adapted from Thomas Fuchs & Jeremy Kahn
// Easing Equations (c) 2003 Robert Penner, BSD license
// https://raw.github.com/danro/easing-js/master/LICENSE
// --------------------------------------------------
export default {
    linear(pos) {
        return pos;
    },

    easeInQuad(pos) {
        return Math.pow(pos, 2);
    },

    easeOutQuad(pos) {
        return -(Math.pow((pos - 1), 2) - 1);
    },

    easeInOutQuad(pos) {
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(pos, 2);
        return -0.5 * ((pos -= 2) * pos - 2);
    },

    easeInCubic(pos) {
        return Math.pow(pos, 3);
    },

    easeOutCubic(pos) {
        return (Math.pow((pos - 1), 3) + 1);
    },

    easeInOutCubic(pos) {
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(pos, 3);
        return 0.5 * (Math.pow((pos - 2), 3) + 2);
    },

    easeInQuart(pos) {
        return Math.pow(pos, 4);
    },

    easeOutQuart(pos) {
        return -(Math.pow((pos - 1), 4) - 1);
    },

    easeInOutQuart(pos) {
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(pos, 4);
        return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
    },

    easeInQuint(pos) {
        return Math.pow(pos, 5);
    },

    easeOutQuint(pos) {
        return (Math.pow((pos - 1), 5) + 1);
    },

    easeInOutQuint(pos) {
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(pos, 5);
        return 0.5 * (Math.pow((pos - 2), 5) + 2);
    },

    easeInSine(pos) {
        return -Math.cos(pos * (Math.PI / 2)) + 1;
    },

    easeOutSine(pos) {
        return Math.sin(pos * (Math.PI / 2));
    },

    easeInOutSine(pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
    },

    easeInExpo(pos) {
        return (pos === 0) ? 0 : Math.pow(2, 10 * (pos - 1));
    },

    easeOutExpo(pos) {
        return (pos === 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
    },

    easeInOutExpo(pos) {
        if (pos === 0)
            return 0;
        if (pos === 1)
            return 1;
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(2, 10 * (pos - 1));
        return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
    },

    easeInCirc(pos) {
        return -(Math.sqrt(1 - (pos * pos)) - 1);
    },

    easeOutCirc(pos) {
        return Math.sqrt(1 - Math.pow((pos - 1), 2));
    },

    easeInOutCirc(pos) {
        if ((pos /= 0.5) < 1)
            return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
        return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
    },

    easeOutBounce(pos) {
        if ((pos) < (1 / 2.75)) {
            return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
            return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
            return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
            return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
    },

    easeInBack(pos) {
        const s = 1.70158;
        return (pos) * pos * ((s + 1) * pos - s);
    },

    easeOutBack(pos) {
        const s = 1.70158;
        return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
    },

    easeInOutBack(pos) {
        let s = 1.70158;
        if ((pos /= 0.5) < 1)
            return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));
        return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },

    elastic(pos) {
        return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
    },

    swingFromTo(pos) {
        let s = 1.70158;
        return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },

    swingFrom(pos) {
        const s = 1.70158;
        return pos * pos * ((s + 1) * pos - s);
    },

    swingTo(pos) {
        const s = 1.70158;
        return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
    },

    bounce(pos) {
        if (pos < (1 / 2.75)) {
            return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
            return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
            return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
            return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
    },

    bouncePast(pos) {
        if (pos < (1 / 2.75)) {
            return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
            return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
            return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
            return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
    },

    easeFromTo(pos) {
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(pos, 4);
        return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
    },

    easeFrom(pos) {
        return Math.pow(pos, 4);
    },

    easeTo(pos) {
        return Math.pow(pos, 0.25);
    },
};
