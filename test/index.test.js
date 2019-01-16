import { DisplayObject, VegoCanvas } from '..';

let uid = 0;
const circle = new DisplayObject(uid++, (g) => {
    g.clear()
        .beginFill('red')
        .drawCircle(0, 0, 50);
});
circle.$geometry.x = 50;
circle.$geometry.y = 50;
circle._appendTransform();
circle._update();

const circle2 = new DisplayObject(uid++, (g) => {
    g.clear()
        .beginFill('red')
        .drawCircle(0, 0, 50);
});
circle2.$geometry.x = 30;
circle2.$geometry.y = 30;
circle2._appendTransform();
circle2._update();

circle.addChild(circle2);

const canvasEle = document.createElement('canvas');
document.body.appendChild(canvasEle);
const canvas = new VegoCanvas(canvasEle);
canvas.addChild(circle);
canvas.render();
