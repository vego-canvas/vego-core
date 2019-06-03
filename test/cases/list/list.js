import { DisplayObject, VegoCanvas, TextDisplayObject } from '../../../';
import data from './block.json';
let uid = 0;
const blocks = data.result.result;
/*
 * const circle = new DisplayObject(uid++, (g) => {
 *     g.clear()、
 *         .beginFill('red')
 *         .drawCircle(0, 0, 50);
 * });
 */

function colorMapping(blocks) {
    let min;
    let max;
    min = max = blocks[0].averageResponseTime;
    blocks.forEach(({ averageResponseTime }) => {
        min = min > averageResponseTime ? averageResponseTime : min;
        max = max > averageResponseTime ? max : averageResponseTime;
    });
    const step = Math.ceil((max - min) / 3);
    const arr = [
        { max: min + step, color: '#8EB7FF' },
        { max: min + step * 2, color: '#3B72E2' },
        { max: min + step * 3, color: '#F88D29' },
    ];
    return function (t) {
        return arr.find(({ max, color }) => {
            if (t < max)
                return color;
            return false;
        }).color;
    };
}
const mapping = colorMapping(blocks);

function generateRectangle(x, y, color, width, height) {
    const Rectangle = new DisplayObject(uid++, (g) => {
        g.beginPath()
            .setFillStyle(color)
            .fillRect(0, 0, width, height);
    });
    Rectangle.$geometry.x = x;
    Rectangle.$geometry.y = y;
    Rectangle._appendTransform();
    return Rectangle;
}

const canvasEle = document.createElement('canvas');
canvasEle.width = 800;
canvasEle.height = 600;
document.body.appendChild(canvasEle);
const canvas = new VegoCanvas(canvasEle);

const columns = 5;
const padding = 5;
const width = 100;
const height = 125;

let x = 0;
let y = 0;
blocks.forEach(({ averageResponseTime, service }, i) => {
    const color = mapping(averageResponseTime);
    if (i % columns === 0 && i > 0) {
        x = 0;
        y += (height + padding);
    }
    const rect = generateRectangle(x, y, color, width, height);
    const words = new TextDisplayObject(uid++, service, {
        lineWidth: width - 2,
        textAlign: 'center',
    });
    rect.addChild(words);
    canvas.addChild(rect);
    x += (width + padding);
});
canvas.render();

/*
 * const circle = new DisplayObject(uid++, (g) => {
 *     g.beginPath()
 *         .setFillStyle('red')
 *         .arc(0, 0, 50, 0, Math.PI * 2)
 *         .fill();
 * });
 * circle.$geometry.x = 50;
 * circle.$geometry.y = 50;
 * circle._appendTransform();
 * const text = '阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大阿斯达大';
 * const words = new TextDisplayObject(uid++, text, {
 *     lineWidth: 100,
 *     textAlign: 'center',
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
