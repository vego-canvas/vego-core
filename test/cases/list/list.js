import {
    DisplayObject, VegoCanvas, TextDisplayObject,
} from '../../../index';
const DEFAULT = {
    width: 30,
    height: 30,
    padding: 5,
};

// class Rectangle extends DisplayObject {
//     constructor(uid, color, width, height) {
//         super(uid, (g) => {
//             g.beginPath()
//                 .setFillStyle(this.color)
//                 .fillRect(0, 0, width, height);
//         });
//         this.color = color;
//         this.boundingBox = {
//             width, height,
//         };
//     }
// }

function generateRectangle(x, y, color, width, height) {
    // const rect = new Rectangle(uid++, color, width, height);
    const rect = new DisplayObject({ render(g) {
        g.beginPath()
            .setFillStyle(color)
            .fillRect(0, 0, width, height);
    } });
    rect.boundingBox = {
        width, height,
    };
    rect.$geometry.x = x;
    rect.$geometry.y = y;
    rect._appendTransform();
    return rect;
}

class BlockDashboard {
    constructor({
        canvasEle,
        width, height,
        padding,
        pointviewCallback,
        stateChangeCallback,
    }) {
        this.canvasEle = canvasEle;
        this.blockWidth = width || DEFAULT.width;
        this.blockHeight = height || DEFAULT.height;
        this.blockPadding = padding || DEFAULT.padding;
        const bounding = this.canvasEle.getBoundingClientRect();
        this.width = bounding.width;
        this.height = bounding.height;
        // this.columns = (this.width + this.blockPadding) / (this.blockWidth + this.blockPadding);

        /* eslint-disable-next-line */
        this.stateChangeCallback = stateChangeCallback || (() => {});
        const canvas = this.canvas = new VegoCanvas(canvasEle, {
            enableMouseOver: 16,
        });
        canvas.NAME = 'board';
        const r = () => {
            console.log('canvasmove');
            this.renderIndicator(pointviewCallback);
        };
        this.canvas.$regist('wheel', r);
        this.canvas.$regist('canvasmove', r);
        this.sortedBlock = [];
        let lock = false;
        canvas.$regist('wheel', () => {
            const scale = canvas.$geometry.scaleX;
            if (scale > 3 && !lock) {
                lock = true;
                this.toggleText(true);
            }
            if (scale < 3 && lock) {
                lock = false;
                this.toggleText(false);
            }
        });
    }

    toggleText(flag) {
        this.sortedBlock.forEach(({ vegowords, service, indicator }) => {
            if (flag)
                vegowords.text = service + '\n' + indicator.toFixed(2) + 'ms';
            vegowords.$visible = flag;
        });
    }

    colorMapping(blocks, key) {
        let min;
        let max;
        min = max = blocks[0][key];
        blocks.forEach((b) => {
            const i = b[key];
            min = min > i ? i : min;
            max = max > i ? max : i;
        });
        const step = Math.ceil((max - min) / 3);
        const arr = this.colorMappingArr = [
            { max: min + step, color: '#8EB7FF' },
            { max: min + step * 2, color: '#3B72E2' },
            { max: min + step * 3, color: '#F88D29' },
        ];
        return function (t) {
            const p = arr.find(({ max, color }) => {
                if (t <= max)
                    return color;
                return false;
            }).color;
            return p;
        };
    }

    reflow() {
        const {
            width, height,
            blockWidth,
            blockHeight,
            blockPadding,
        } = this;
        const length = this.sortedBlock.length;
        const columnCapacity = Math.ceil(Math.sqrt(length));
        const AllWidth = blockWidth * columnCapacity + blockPadding * (columnCapacity - 1);
        const rowCapacity = Math.ceil(length / columnCapacity);
        const AllHeight = blockHeight * rowCapacity + blockPadding * (rowCapacity - 1);
        const container = new DisplayObject({
            render() {},
        });
        const scale = Math.min(Math.max(1, (height - blockPadding * 2) / AllHeight), 4);
        container.$geometry.x = (width - AllWidth) / 2;
        container.$geometry.y = (height - AllHeight) / 2;
        container._appendTransform();
        return {
            scale,
            container,
            columnCapacity,
            rowCapacity,
        };
    }

    draw(blocks, key) {
        const mapping = this.colorMapping(blocks, key);

        const {
            blockWidth,
            blockHeight,
            blockPadding,
            canvas,
        } = this;
        canvas.$children = [];
        canvas.$geometry = { x: 0,
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            skewY: 0,
            regX: 0,
            regY: 0 };
        canvas._appendTransform();
        let x = 0;
        let y = 0;
        const sortedBlock = this.sortedBlock = blocks.sort((a, b) => a.service.localeCompare(b.service));
        const {
            scale,
            container,
            columnCapacity,
            rowCapacity,
        } = this.reflow();
        canvas.addChild(container);
        sortedBlock.forEach((block, i) => {
            const indicator = block[key];
            const color = mapping(indicator);
            if (i % columnCapacity === 0 && i > 0) {
                x = 0;
                y += (blockHeight + blockPadding);
            }
            const rect = generateRectangle(x, y, color, blockWidth, blockHeight);
            const words = new TextDisplayObject('', {
                lineWidth: (blockWidth - 2) * 10,
                textAlign: 'center',
                textVerticalAlign: 'middle',
                font: '40px sans-serif',
                // nocache: true,
            });
            words.$geometry.x = blockWidth / 2;
            words.$geometry.scaleX = words.$geometry.scaleY = 0.1;
            words._appendTransform();

            block.vegowords = words;
            block.indicator = indicator;
            container.addChild(rect);
            rect.addChild(words);
            rect.$regist('mouseenter', () => {
                const payload = { x: blockWidth / 2, y: 0 };
                const point = rect.localToGlobal(payload);
                this.stateChangeCallback({
                    state: true,
                    target: block,
                    x: point.x,
                    y: point.y,
                });
            });
            rect.$regist('mouseleave', () => {
                this.stateChangeCallback({
                    state: false,
                    target: block,
                });
            });
            x += (blockWidth + blockPadding);
        });
        if (canvas.$geometry.scaleX > 3) {
            this.toggleText(true);
        }

        canvas.render();
        const img = canvas.saveImage();
        canvas.scaleAboutPoint({
            x: this.width / 2,
            y: this.height / 2,
        }, scale);
        canvas.render();
        return img;
    }

    renderIndicator(callback) {
        const geo = this.canvas.$geometry;
        const x = geo.x / geo.scaleX;
        const y = geo.y / geo.scaleY;
        const width = this.width / geo.scaleX;
        const height = this.height / geo.scaleY;
        const ratio = 4;
        callback({
            width: width / ratio,
            height: height / ratio,
            left: -x / ratio,
            top: -y / ratio,
        });
    }
}

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

class Minimap {
    constructor({
        canvasEle,
    }) {
        const bounding = canvasEle.getBoundingClientRect();
        this.width = bounding.width;
        this.height = bounding.height;

        this.canvas = new VegoCanvas(canvasEle, {
            enableMouseOver: 0,
            disableCanvasmove: true,
        });
        this.canvas.NAME = 'Minimap';
        this.mask = {
            x: 0, y: 0, width: this.width, height: this.height,
        };
        const maskDisp = new DisplayObject({
            render: (g) => {
                const {
                    x, y, width, height,
                } = this.mask;
                g.beginPath()
                    .rect(x, y, width, height)
                    .clip()
                    .setFillStyle('#fff')
                    .fillRect(0, 0, this.width, this.height);
                if (this.bgImg)
                    g.drawImage(this.bgImg, 0, 0, this.width, this.height);
            },
        });
        const bg = new DisplayObject({
            render: (g) => {
                if (this.bgImg)
                    g.drawImage(this.bgImg, 0, 0, this.width, this.height);
                g.setFillStyle('rgba(0,0,0,0.2)');
                g.fillRect(0, 0, this.width, this.height);
            },
        });
        this.canvas.addChild(bg);
        this.canvas.addChild(maskDisp);
    }

    draw(bgImg) {
        this.bgImg = new Image();
        this.bgImg.src = bgImg;
    }

    update(x, y, width, height) {
        this.mask = {
            x, y, width, height,
        };
        this.canvas.render();
    }
}
const canvasContainer2 = document.createElement('div');
canvasContainer2.style.position = 'relative';
const canvasEle2 = document.createElement('canvas');
canvasEle2.width = 200;
canvasEle2.height = 150;
canvasContainer2.appendChild(canvasEle2);
document.body.appendChild(canvasContainer2);
const miniMap = new Minimap({
    canvasEle: canvasEle2,
});
miniMap.NAME = 'miniMap';

const stringifyStyle = ({
    left, top, width, height,
}) => {
    // this.thumbnailStyle = `width: ${width}px; height: ${height}px; left: ${left}px; top: ${top}px; background-position: ${-left}px ${-top}px;`;
    miniMap.update(left, top, width, height);
};

const board = new BlockDashboard({
    canvasEle,
    pointviewCallback: stringifyStyle,
    stateChangeCallback: (args) => { console.log(args); },
});

const json = require('./block.json');
console.log(json);

const breifimage = board.draw(json.result.result, 'averageResponseTime');
miniMap.draw(breifimage);
board.renderIndicator(stringifyStyle);
