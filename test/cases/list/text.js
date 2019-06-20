import {
    DisplayObject, VegoCanvas, TextDisplayObject,
} from '../../../index';

const canvasContainer = document.createElement('div');
canvasContainer.style.position = 'relative';
canvasContainer.style.width = '800px';
canvasContainer.style.height = '600px';
const canvasEle = document.createElement('canvas');
canvasEle.width = 800;
canvasEle.height = 600;
canvasContainer.style.border = '1px solid #000';
canvasContainer.appendChild(canvasEle);
document.body.appendChild(canvasContainer);
const canvas = new VegoCanvas(canvasEle, {
    enableMouseOver: 16,
});

const words = new TextDisplayObject('星期一我要吃炸鸡', {
    lineWidth: 200,
    textAlign: 'center',
    textVerticalAlign: 'middle',
    font: '36px sans-serif',
    // nocache: true,
});
words.$geometry.x = 800 / 2;
words.$geometry.y = 600 / 2;
words._appendTransform();
const container = new DisplayObject({
    render(g) {
        g.setFillStyle('red');
        g.fillRect(0, 0, 600, 200);
    },
});
const text = new TextDisplayObject('星期二吃薯条！', {
    lineWidth: Math.ceil(600 / 8),
    textAlign: 'center',
    textVerticalAlign: 'middle',
    font: 'normal 12px Helvetica',
    color: '#fff',
});
const text2 = new TextDisplayObject('星期二吃薯条！', {
    lineWidth: Math.ceil(600 / 10),
    textAlign: 'center',
    textVerticalAlign: 'middle',
    font: 'normal 12px Helvetica',
    color: '#fff',
});
const text3 = new TextDisplayObject('星期二吃薯条！', {
    lineWidth: Math.ceil(600 / 11),
    textAlign: 'center',
    textVerticalAlign: 'middle',
    font: 'normal 12px Helvetica',
    color: '#fff',
});
container.$geometry.x = 100;
container.$geometry.y = 50;
container._appendTransform();
text.$geometry.x = 100;
text2.$geometry.x = 200;
text3.$geometry.x = 300;
text.$geometry.y = 100;
text._appendTransform();
text2._appendTransform();
text3._appendTransform();
canvas.addChild(words);
container.addChild(text);
container.addChild(text2);
container.addChild(text3);
canvas.addChild(container);
canvas.render();

canvasEle.addEventListener('mousemove', () => {
    canvas.render();
    console.log('render');
});
