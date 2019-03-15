import { DisplayObject, VegoCanvas, TextDisplayObject } from '..';

let uid = 0;
/*
 * const circle = new DisplayObject(uid++, (g) => {
 *     g.clear()
 *         .beginFill('red')
 *         .drawCircle(0, 0, 50);
 * });
 */
const circle = new DisplayObject(uid++, (g) => {
    g.beginPath()
        .setFillStyle('red')
        .arc(0, 0, 50, 0, Math.PI * 2)
        .fill();
});
circle.$geometry.x = 50;
circle.$geometry.y = 50;
circle._appendTransform();
const text = '阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大';
const words = new TextDisplayObject(uid++, text, {
    lineWidth: 100,
    textAlign: 'center',
});
// circle._update();

/*
 * const circle2 = new DisplayObject(uid++, (g) => {
 *     g.clear()
 *         .beginFill('red')
 *         .drawCircle(0, 0, 50);
 * });
 */
const circle2 = new DisplayObject(uid++, (g) => {
    g.beginPath()
        .setFillStyle('red')
        .arc(0, 0, 50, 0, Math.PI * 2)
        .fill();
});
circle2.$geometry.x = 30;
circle2.$geometry.y = 30;
circle2._appendTransform();
// circle2._update();

circle.addChild(circle2);

const canvasEle = document.createElement('canvas');
document.body.appendChild(canvasEle);
const canvas = new VegoCanvas(canvasEle);
canvas.addChild(circle);
canvas.addChild(words);
canvas.render();
