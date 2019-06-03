/**
 *  just for SyncHook Abstract
 *
 */

class Hook {
    constructor(args) {
        if (!Array.isArray(args))
            args = [];
        this._args = args;
        this.taps = [];
        this.interceptors = [];
        this.call = this._call;
    }

    compile(options) {
        throw new Error('Abstract: should be overriden');
    }

    _createCall(type) {
        return this.compile({
            taps: this.taps,
            interceptors: this.interceptors,
            args: this._args,
            type,
        });
    }

    tap(options, fn) {
        if (typeof options === 'string')
            options = { name: options };
        if (typeof options !== 'object' || options === null)
            throw new Error(
                'Invalid arguments to tap(options: Object, fn: function)'
            );
        options = Object.assign({ type: 'sync', fn }, options);
        if (typeof options.name !== 'string' || options.name === '')
            throw new Error('Missing name for tap');
        options = this._runRegisterInterceptors(options);
        this._insert(options);
    }

    _resetCompilation() {
        this.call = this._call;
        this.callAsync = this._callAsync;
        this.promise = this._promise;
    }

    _insert(item) {
        this._resetCompilation();
        let before;
        if (typeof item.before === 'string')
            before = new Set([item.before]);
        else if (Array.isArray(item.before)) {
            before = new Set(item.before);
        }
        let stage = 0;
        if (typeof item.stage === 'number')
            stage = item.stage;
        let i = this.taps.length;
        while (i > 0) {
            i--;
            const x = this.taps[i];
            this.taps[i + 1] = x;
            const xStage = x.stage || 0;
            if (before) {
                if (before.has(x.name)) {
                    before.delete(x.name);
                    continue;
                }
                if (before.size > 0) {
                    continue;
                }
            }
            if (xStage > stage) {
                continue;
            }
            i++;
            break;
        }
        this.taps[i] = item;
    }
}
function createCompileDelegate(name, type) {
    return function lazyCompileHook(...args) {
        this[name] = this._createCall(type);
        return this[name](...args);
    };
}

Object.defineProperties(Hook.prototype, {
    _call: {
        value: createCompileDelegate('call', 'sync'),
        configurable: true,
        writable: true,
    },
});

class HookCodeFactory {
    constructor(config) {
        this.config = config;
        this.options = undefined;
        this._args = undefined;
    }

    init(options) {
        this.options = options;
        this._args = options.args.slice();
    }

    setup(instance, options) {
        instance._x = options.taps.map((t) => t.fn);
    }

    create(options) {
        this.init(options);
        /* eslint-disable */
        const fn = new Function(
            this.args(),
            '"use strict";\n'
                + this.header()
                + this.content({
                    onError: (err) => `throw ${err};\n`,
                    onResult: (result) => `return ${result};\n`,
                    resultReturns: true,
                    onDone: () => '',
                    rethrowIfPossible: true,
                })
        );
        /* eslint-enable */
        this.deinit();
        return fn;
    }

    args({ before, after } = {}) {
        let allArgs = this._args;
        if (before)
            allArgs = [before].concat(allArgs);
        if (after)
            allArgs = allArgs.concat(after);
        if (allArgs.length === 0) {
            return '';
        } else {
            return allArgs.join(', ');
        }
    }

    header() {
        let code = '';
        if (this.needContext()) {
            code += 'var _context = {};\n';
        } else {
            code += 'var _context;\n';
        }
        code += 'var _x = this._x;\n';
        if (this.options.interceptors.length > 0) {
            code += 'var _taps = this.taps;\n';
            code += 'var _interceptors = this.interceptors;\n';
        }
        for (let i = 0; i < this.options.interceptors.length; i++) {
            const interceptor = this.options.interceptors[i];
            if (interceptor.call) {
                code += `${this.getInterceptor(i)}.call(${this.args({
                    before: interceptor.context ? '_context' : undefined,
                })});\n`;
            }
        }
        return code;
    }

    callTap(tapIndex, { onError, onResult, onDone, rethrowIfPossible }) {
        let code = '';
        let hasTapCached = false;
        for (let i = 0; i < this.options.interceptors.length; i++) {
            const interceptor = this.options.interceptors[i];
            if (interceptor.tap) {
                if (!hasTapCached) {
                    code += `var _tap${tapIndex} = ${this.getTap(tapIndex)};\n`;
                    hasTapCached = true;
                }
                code += `${this.getInterceptor(i)}.tap(${
                    interceptor.context ? '_context, ' : ''
                }_tap${tapIndex});\n`;
            }
        }
        code += `var _fn${tapIndex} = ${this.getTapFn(tapIndex)};\n`;
        const tap = this.options.taps[tapIndex];
        if (!rethrowIfPossible) {
            code += `var _hasError${tapIndex} = false;\n`;
            code += 'try {\n';
        }
        if (onResult) {
            code += `var _result${tapIndex} = _fn${tapIndex}(${this.args({
                before: tap.context ? '_context' : undefined,
            })});\n`;
        } else {
            code += `_fn${tapIndex}(${this.args({
                before: tap.context ? '_context' : undefined,
            })});\n`;
        }
        if (!rethrowIfPossible) {
            code += '} catch(_err) {\n';
            code += `_hasError${tapIndex} = true;\n`;
            code += onError('_err');
            code += '}\n';
            code += `if(!_hasError${tapIndex}) {\n`;
        }
        if (onResult) {
            code += onResult(`_result${tapIndex}`);
        }
        if (onDone) {
            code += onDone();
        }
        if (!rethrowIfPossible) {
            code += '}\n';
        }
        return code;
    }

    callTapsSeries({
        onError,
        onResult,
        resultReturns,
        onDone,
        doneReturns,
        rethrowIfPossible,
    }) {
        if (this.options.taps.length === 0)
            return onDone();
        let code = '';
        let current = onDone;
        for (let j = this.options.taps.length - 1; j >= 0; j--) {
            const i = j;
            const done = current;
            const doneBreak = (skipDone) => {
                if (skipDone)
                    return '';
                return onDone();
            };
            const content = this.callTap(i, {
                onError: (error) => onError(i, error, done, doneBreak),
                onResult: onResult && ((result) => onResult(i, result, done, doneBreak)),
                onDone: !onResult && done,
                rethrowIfPossible,
            });
            current = () => content;
        }
        code += current();
        return code;
    }

    deinit() {
        this.options = undefined;
        this._args = undefined;
    }

    getTapFn(idx) {
        return `_x[${idx}]`;
    }

    getTap(idx) {
        return `_taps[${idx}]`;
    }

    getInterceptor(idx) {
        return `_interceptors[${idx}]`;
    }
}

class SyncHookCodeFactory extends HookCodeFactory {
    content({ onError, onDone, rethrowIfPossible }) {
        return this.callTapsSeries({
            onError: (i, err) => onError(err),
            onDone,
            rethrowIfPossible,
        });
    }
}

const factory = new SyncHookCodeFactory();

/**
 *  const h2 = new SyncHook(["test", "arg2"]);
 *  h2.tap("D", mock3);
 *  h2.call("1", 2);
 */
export class SyncHook extends Hook {
    compile(options) {
        factory.setup(this, options);
        return factory.create(options);
    }
}
