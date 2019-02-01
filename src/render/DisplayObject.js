import Layer from './Layer';
import Graphic from '../graphic';

export default class DisplayObject extends Layer {
    constructor(uid, render) {
        super();
        this.uid = uid;
        const graphic = new Graphic(render);

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
