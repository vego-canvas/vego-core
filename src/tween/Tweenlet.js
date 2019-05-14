export default class Tweenlet {
    constructor(start, end, scope, key, setFunc) {
        this.start = start;
        this.end = end;
        this.span = this.calcDistance(end, start);
        this.value = start;
        this.setValue = () => {
            setFunc(scope, key, this.value);
        };
    }

    reset({
        start, end,
    }) {
        if (start !== undefined) {
            this.start = start;
        }
        if (end !== undefined) {
            this.end = end;
        }
        this.span = this.calcDistance(end, start);
        this.value = start;
        return this;
    }

    run(step) {
        this.value = this.calcNextStep(this.start, step);
        this.setValue();
    }

    theEnd() {
        this.value = this.end;
        this.setValue();
    }

    calcDistance(end, start) {
        return end - start;
    }

    calcNextStep(start, step) {
        return start + step * this.span;
    }
}

Tweenlet.pattern = (p) => /^-?\d*(?:\.\d+)?$/.test(p);
