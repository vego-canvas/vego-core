import Layer from './Layer';
import Graphic from '../graphic';
export { default as TextDisplayObject } from './TextDisplayObject';

export default class DisplayObject extends Layer {
    constructor(options) {
        super(options);

        const render = options.render.bind(this);
        const graphic = new Graphic(render, options.afterRender);

        Object.defineProperty(this, '$graphic', {
            value: graphic,
        });
    }
}
