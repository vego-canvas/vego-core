export function findmax(array, key) {
    let max = 0;
    let target = null;
    const a = array.length;

    let counter;

    for (counter = 0; counter < a; counter++) {
        if (array[counter][key] > max) {
            max = array[counter][key];
            target = array[counter];
        }
    }
    return target;
}

export function isFunction(t) {
    return t && Object.prototype.toString.call(t) === '[object Function]';
}

export function isPureObject(obj) {
    return (obj.constructor && obj.constructor === Object);
}
