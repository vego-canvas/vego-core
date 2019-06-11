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

const canvasContainer = document.createElement('div');
canvasContainer.style.position = 'relative';
const canvasEle = document.createElement('canvas');
canvasEle.width = 800;
canvasEle.height = 600;
canvasEle.style.border = '1px solid #000';
canvasContainer.style.marginLeft = '100px';
canvasContainer.style.marginTop = '100px';
document.body.appendChild(canvasContainer);
canvasContainer.appendChild(canvasEle);
const canvas = new VegoCanvas(canvasEle, {
    enableMouseOver: 16,
});

const floatBlock = document.createElement('div');
const floatBlockTitle = document.createElement('h1');
const floatBlockContent = document.createElement('p');
floatBlock.appendChild(floatBlockTitle);
floatBlock.appendChild(floatBlockContent);
function renderFloatBlock(title, content, x, y) {
    floatBlockTitle.innerText = title;
    floatBlockContent.innerText = content;
    floatBlock.style.display = 'block';
    floatBlock.style.left = `${x}px`;
    floatBlock.style.top = `${y}px`;
}
function hideFloatBlock() {
    floatBlock.style.display = 'none';
}
floatBlock.style.position = 'absolute';
floatBlock.style.left = '0';
floatBlock.style.top = '0';
floatBlock.style.display = 'none';
floatBlock.style.transform = 'translate(-50%, -100%)';
floatBlock.style.background = '#000';
floatBlock.style.color = '#fff';
canvasContainer.appendChild(floatBlock);

const thumbnail = document.createElement('div');
thumbnail.style.width = '200px';
thumbnail.style.height = '150px';
thumbnail.style.border = '1px solid #000';
thumbnail.style.position = 'relative';
// thumbnail.style.overflow = 'hidden';
document.body.appendChild(thumbnail);

const thumbnailIndicator = document.createElement('div');
thumbnailIndicator.style.width = '200px';
thumbnailIndicator.style.height = '150px';
thumbnailIndicator.style.border = '1px solid #000';
thumbnailIndicator.style.position = 'absolute';
// thumbnailIndicator.style.left = '-300px';
// thumbnailIndicator.style.top = '-225px';
thumbnailIndicator.style['transform-origin'] = 'center';
thumbnail.appendChild(thumbnailIndicator);

const padding = 5;
const width = 30;
const height = 30;
const columns = (800 + padding) / (width + padding);

let x = padding;
let y = padding;
const sortedBlock = blocks.sort((a, b) => a.service.localeCompare(b.service)).slice(0, 3);
sortedBlock.forEach((block, i) => {
    const { averageResponseTime } = block;
    const color = mapping(averageResponseTime);
    if (i % columns === 0 && i > 0) {
        x = padding;
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
    // rect.addChild(words);
    console.log(block.service);
    const px = x;
    const py = y;
    rect.$regist('mouseenter', () => {
        rect.color = '#000';
        const payload = { x: width / 2, y: 0 };
        const point = rect.localToGlobal(payload);
        canvas.render();
        renderFloatBlock(block.service, block.averageResponseTime, point.x, point.y);
        console.log(point);
    });
    rect.$regist('mouseleave', () => {
        rect.color = color;
        canvas.render();
        hideFloatBlock();
    });
    x += (width + padding);
});
let lock = false;
canvas.$regist('wheel', () => {
    const scale = canvas.$geometry.scaleX;
    if (scale > 3 && !lock) {
        lock = true;
        sortedBlock.forEach(({ vegowords, service, averageResponseTime }) => {
            vegowords.text = service + '\n' + averageResponseTime.toFixed(2) + 'ms';
            vegowords.$visible = true;
        });
        console.log('add');
    }
    if (scale < 3 && lock) {
        lock = false;
        sortedBlock.forEach(({ vegowords }) => {
            vegowords.$visible = false;
        });
        console.log('remove');
    }
});

function renderIndicator() {
    const geo = canvas.$geometry;
    const x = geo.x / geo.scaleX;
    const y = geo.y / geo.scaleY;
    const width = 800 / geo.scaleX;
    const height = 600 / geo.scaleY;
    const ratio = 4;
    thumbnailIndicator.style.width = `${width / ratio}px`;
    thumbnailIndicator.style.height = `${height / ratio}px`;
    thumbnailIndicator.style.left = `${-x / ratio}px`;
    thumbnailIndicator.style.top = `${-y / ratio}px`;
}
canvas.$regist('wheel', renderIndicator);
canvas.$regist('canvasmove', renderIndicator);
canvas.render();
const img = canvas.saveImage();
const imgEl = document.createElement('img');
imgEl.src = img;
imgEl.style.width = '100%';
thumbnail.appendChild(imgEl);

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
