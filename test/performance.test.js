import { DisplayObject, VegoCanvas } from '..';
const nextFrame = window.requestAnimationFrame;
let uid = 0;
const canvasWidth = 960;
const canvasHeight = 380;
const canvasEle = document.createElement('canvas');
canvasEle.width = canvasWidth;
canvasEle.height = canvasHeight;
const canvas = new VegoCanvas(canvasEle);
document.body.appendChild(canvasEle);

const colorsP = ['#828b20', '#b0ac31', '#cbc53d', '#fad779', '#f9e4ad', '#faf2db', '#563512', '#9b4a0b', '#d36600', '#fe8a00', '#f9a71f'];
const rings = 40;
const radius = 50;
const circles = [];
const l = 200;

for (let i = 0; i < l; i++) {
    const colors = [];
    for (let j = rings; j > 0; j--) {
        colors.push(colorsP[~~(Math.random() * 10) | 0]);
    }
    const circle = new DisplayObject(uid++, (g) => {
        for (let j = rings; j > 0; j--) {
            g.beginPath()
                .setFillStyle(colors[j])
                .arc(0, 0, radius * j / rings, 0, Math.PI * 2)
                .fill();
        }
    });
    circle.$graphic.cache(-radius, -radius, radius * 2, radius * 2);
    circle.$geometry.x = Math.random() * canvasWidth;
    circle.$geometry.y = Math.random() * canvasHeight;
    circle.velX = Math.random() * 10 - 5;
    circle.velY = Math.random() * 10 - 5;
    circle._appendTransform();
    circles.push(circle);
    canvas.addChild(circle);
}

// circle._update();

/*
 * const circle2 = new DisplayObject(uid++, (g) => {
 *     g.clear()
 *         .beginFill('red')
 *         .drawCircle(0, 0, 50);
 * });
 */
/*
 * const circle2 = new DisplayObject(uid++, (g) => {
 *     g.beginPath()
 *         .setFillStyle('red')
 *         .arc(0, 0, 50, 0, Math.PI * 2)
 *         .fill();
 * });
 * circle2.$geometry.x = 30;
 * circle2.$geometry.y = 30;
 * circle2._appendTransform();
 * // circle2._update();
 */

// circle.addChild(circle2);

const tick = () => {
    for (let i = 0; i < l; i++) {
        const c = circles[i];
        const geo = c.$geometry;
        geo.x = (geo.x + radius + c.velX + canvasWidth) % canvasWidth - radius;
        geo.y = (geo.y + radius + c.velY + canvasHeight) % canvasHeight - radius;
        c._appendTransform();
    }
    canvas.render();

    nextFrame(tick);
};
nextFrame(tick);
