export function findmax(array, key, condition) {
    let max = 0;
    let target = null;
    const a = array.length;
    if (a === 0)
        return target;
    let counter;

    for (counter = 0; counter < a; counter++) {
        if (array[counter][key] >= max && condition(array[counter])) {
            max = array[counter][key];
            target = array[counter];
        }
    }
    return target;
}
export function throttle(ctx, fn, delay) {
    let lastExec = 0;
    const wrapper = function (...param) {
        if (lastExec + delay < Date.now()) {
            lastExec = Date.now();
            fn.apply(ctx, param);
        }
    };
    return wrapper;
}

export function isFunction(t) {
    return t && Object.prototype.toString.call(t) === '[object Function]';
}

export function isPureObject(obj) {
    return (obj.constructor && obj.constructor === Object);
}

export function transformPoint(point, mtx) {
    return {
        x: mtx[0] * point.x + mtx[2] * point.y + mtx[4],
        y: mtx[1] * point.x + mtx[3] * point.y + mtx[5],
    };
}

let uid = 0;
export function getUID() { return uid++; }

export function getCTXStates(ctx) {
    return ['fillStyle',
        'font',
        'globalAlpha',
        'globalCompositionOperation',
        'lineCap',
        'lineJoin',
        'lineWidth',
        'miterLimit',
        'shadowBlur',
        'shadowColor',
        'shadowOffsetX',
        'shadowOffsetY',
        'strokeStyle',
        'strokeStyle',
        'textAlign',
        'textBaseline'].map((k) => `${k}:${ctx[k]}`);
}
