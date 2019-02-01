/*
 * @property
 * canvas
 * currentTransform  // experimental
 * direction         // experimental
 * fillStyle         // statechange
 * filter
 * font
 * globalAlpha
 * globalCompositeOperation
 * imageSmoothingEnabled
 * imageSmoothingQuality
 * lineCap
 * lineDashOffset
 * lineJoin
 * lineWidth
 * miterLimit
 * shadowBlur
 * shadowColor
 * shadowOffsetX
 * shadowOffsetY
 * strokeStyle
 * textAlign
 * textBaseline
 *
 * @methods
 * arc()
 * arcTo()
 * beginPath()
 * bezierCurveTo()
 * clearRect()
 * clip()
 * closePath()
 * createImageData()
 * createLinearGradient()
 * createPattern()
 * createRadialGradient()
 * drawFocusIfNeeded()
 * drawImage()
 * ellipse()
 * fill()
 * fillRect()
 * fillText()
 * getImageData()
 * getLineDash()
 * isPointInPath()
 * isPointInStroke()
 * lineTo()
 * measureText()
 * moveTo()
 * putImageData()
 * quadraticCurveTo()
 * rect()
 * restore()
 * rotate()
 * save()
 * scale()
 * setLineDash()
 * setTransform()
 * stroke()
 * strokeRect()
 * strokeText()
 * transform()
 * translate()
 */
export default class {
    exec(ctx) {
        throw new Error('commands need to be implemented');
    }
}
