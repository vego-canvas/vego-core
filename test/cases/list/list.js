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

class Rectangle extends DisplayObject {
    constructor(uid, color, width, height) {
        super(uid, (g) => {
            g.beginPath()
                .setFillStyle(this.color)
                .fillRect(0, 0, width, height);
        });
        this.color = color;
        this.boundingBox = {
            width, height,
        };
    }
}

function generateRectangle(x, y, color, width, height) {
    const rect = new Rectangle(uid++, color, width, height);
    rect.$geometry.x = x;
    rect.$geometry.y = y;
    rect._appendTransform();
    return rect;
}

const canvasEle = document.createElement('canvas');
canvasEle.width = 800;
canvasEle.height = 600;
document.body.appendChild(canvasEle);
const canvas = new VegoCanvas(canvasEle, {
    enableMouseOver: 16,
});

const columns = 5;
const padding = 5;
const width = 30;
const height = 30;

let x = 0;
let y = 0;
const sortedBlock = blocks.sort((a, b) => a.service.localeCompare(b.service));
sortedBlock.forEach((block, i) => {
    const { averageResponseTime } = block;
    const color = mapping(averageResponseTime);
    if (i % columns === 0 && i > 0) {
        x = 0;
        y += (height + padding);
    }
    const rect = generateRectangle(x, y, color, width, height);

    const words = new TextDisplayObject(uid++, '', {
        lineWidth: (width - 2) * 10,
        textAlign: 'center',
        textVerticalAlign: 'middle',
        font: '40px sans-serif',
        // nocache: true,
    });
    words.$geometry.x = width / 2;
    words.$geometry.scaleX = words.$geometry.scaleY = 0.1;
    words._appendTransform();

    block.vegowords = words;
    canvas.addChild(rect);
    rect.addChild(words);
    // rect.$regist('mouseenter', () => {
    //     rect.color = '#000';
    //     canvas.render();
    // });
    // rect.$regist('mouseleave', () => {
    //     rect.color = color;
    //     canvas.render();
    // });
    x += (width + padding);
});
let lock = false;
canvas.$regist('wheel', () => {
    const scale = canvas.$geometry.scaleX;
    if (scale > 3 && !lock) {
        lock = true;
        sortedBlock.forEach(({ vegowords, service, averageResponseTime }) => {
            vegowords.text = service + '\n' + averageResponseTime.toFixed(2) + 'ms';
        });
        console.log('add');
    }
    if (scale < 3 && lock) {
        lock = false;
        sortedBlock.forEach(({ vegowords }) => {
            vegowords.text = '';
        });
        console.log('remove');
    }

    // if (scale > 3) {
    //     sortedBlock.forEach(({ vegowords }) => {
    //         canvas.addChild(vegowords);
    //     });
    // } else {

    // }
});
canvas.render();
// function animate(t) {
//     canvas.$geometry.x = Math.cos(t * Math.PI / 3600) * 200;
//     canvas.$geometry.y = Math.sin(t * Math.PI / 3600) * 200;
//     canvas._appendTransform();
//     canvas.render();
//     requestAnimationFrame(animate);
// }
// requestAnimationFrame(animate);

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
