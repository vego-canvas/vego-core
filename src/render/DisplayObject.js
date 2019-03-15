import Layer from './Layer';
import Graphic from '../graphic';
export { default as TextDisplayObject } from './TextDisplayObject';

export default class DisplayObject extends Layer {
    constructor(uid, render, afterRender) {
        super();
        this.uid = uid;
        const graphic = new Graphic(render, afterRender);

        Object.defineProperty(this, '$graphic', {
            value: graphic,
        });
        // this.$render = render;
    }

    /*
     * _update() {
     *     this.$render(this.$graphic);
     * }
     */
}
