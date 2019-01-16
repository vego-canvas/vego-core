export default class Tweenlet {
    constructor(start, end, scope, key) {
        this.start = start;
        this.end = end;
        this.span = end - start;
        this.value = start;
        this.setValue = () => {
            scope[key] = this.value;
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
        this.span = end - start;
        this.value = start;
        return this;
    }

    run(step) {
        this.value = this.start + step * this.span;
        this.setValue();
    }

    theEnd() {
        this.value = this.end;
        this.setValue();
    }
}
