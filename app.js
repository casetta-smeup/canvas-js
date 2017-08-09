class Color {

    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toString() {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
}

const GRAPHIC_ELEMENT_MARKER_SPLITTER = "\\";
const GRAPHIC_ELEMENT_SPLITTER = "\\AND\\"
const DEFAULT_BGD_COLOR = "BCOLOR;R255G000B000";
const DEBUG = false;
const DEFAULT_COLOR = new Color(0, 0, 0);

function onload() {

    new GraphicCell('canvas00', 'R255G128B000;20,58\\HEIGHT;60').draw();
    new GraphicCell('canvas01', 'R255G000B000;12,4\\SEP;25,00;R000G000B255;5\\R255G255B000;74,00\\GRID;20').draw();
    new GraphicCell('canvas02', 'R000G255B128;33,3\\ARW;50,00\\R255G255B051;66,5\\R220G000B000;100,0\\GRID;3').draw();
}

class GraphicElement {

    constructor(markers) {
        this.width = 100.0;
        this.height = 100.0;
        this.color = null;
        this.shape = 'bar';

        this.init(markers);
    }

    init(markers) {
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];

            if (marker.toUpperCase().startsWith('HEIGHT;')) {
                this.initHeight(marker);
            } else if (marker.toUpperCase().startsWith('SHAPE;')) {
                this.initShape(marker);
            } else if (marker.toUpperCase().startsWith('BCOLOR;')) {
                // TODO ?
            } else {
                this.initColor(marker);
            }
        }
    }

    initColor(rgbString) {
        if (rgbString.length > 11 && this.isValidColor(rgbString)) {
            this.color = getColorFromString(rgbString.substring(0, 12));

            try {
                this.width = parseFloat(rgbString.substring(13).replace(',', '.'));
            } catch (e) {
                console.error(e);
            }
        } else if (rgbString.toUpperCase() == '*NONE') {
            try {
                this.width = parseFloat(rgbString.substring(6).replace(',', '.'));
            } catch (e) {
                console.error(e);
            }
        }
    }

    isTrasparent() {
        return this.color == null;
    }

    initHeight(height) {
        if (height) {
            var toBeParsed = height.substring("HEIGHT;".length).replace(',', '.');

            this.height = parseFloat(toBeParsed);
        }
    }

    initShape(shape) {
        shape = shape.substring("SHAPE;".length);
        var vLastSemicolonIndex = shape.indexOf(";");
        var vShapeTypeString = shape;
        if (vLastSemicolonIndex > -1) {
            vShapeTypeString = shape.substring(0, vLastSemicolonIndex);

            try {
                // this.width = parseFloat(shape.substring(vLastSemicolonIndex + 1).replace(',', '.');
            } catch (err) {
                console.error(err);
            }
        }

        switch (vShapeTypeString.toLowerCase()) {
            case "circle":
                this.shape = "circle";
                break;

            case "tril":
                this.shape = "tril";
                break;

            case "trir":
                this.shape = "trir";
                break;
        }
    }

    isValidColor(color) {
        // TODO
        return true;
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    getShape() {
        return this.shape;
    }

    getColor() {
        return this.color;
    }
}

function getColorFromString(rgb) {
    var rIndex = rgb.indexOf('R');
    var gIndex = rgb.indexOf('G');
    var bIndex = rgb.indexOf('B');

    if (rIndex < 0
        || gIndex < 0
        || bIndex < 0) {

        return;
    }

    var r = rgb.substring(rIndex + 1, rIndex + 4);
    var g = rgb.substring(gIndex + 1, gIndex + 4);
    var b = rgb.substring(bIndex + 1, bIndex + 4);

    try {
        return new Color(parseInt(r), parseInt(g), parseInt(b));
    } catch (e) {
        console.error(e);
    }

    return null;
}

class GraphicCell {

    constructor(canvasID, value) {
        this.canvasID = canvasID;
        this.value = value;
    }

    draw() {
        var canvas = document.getElementById(this.canvasID);
    
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
    
            this.drawGraphicCell(ctx, this.value);
        }
    }
    
    drawGraphicCell(ctx, value) {
        var vGraphicElementDefinitionArr = value.split(GRAPHIC_ELEMENT_SPLITTER);
    
        for (var i = 0; i < vGraphicElementDefinitionArr.length; i++) {
            var vGraphicElementArray = [];
    
            var graphicElem = vGraphicElementDefinitionArr[i];
    
            var vShapeMarker = "SHAPE;BAR";
            var vBGColorMarker = DEFAULT_BGD_COLOR;
            var vHeightPctMarker = "HEIGHT;100";
    
            var vMarkersArray = graphicElem.split(GRAPHIC_ELEMENT_MARKER_SPLITTER);
    
            var shapesArray = [];
            var vSeparatorsList = [];
    
            for (var j = 0; j < vMarkersArray.length; j++) {
                var vString = vMarkersArray[j];
    
                if (this.isShapeMarker(vString)) {
                    vShapeMarker = vString;
                } else if (this.isBgColorMarker(vString)) {
                    vBGColorMarker = vString;
                } else if (this.isHeightMarker(vString)) {
                    vHeightPctMarker = vString;
                } else if (this.isDecoratorMarker(vString)) {
                    vSeparatorsList.push(vString);
                } else {
                    shapesArray.push(vString);
                }
            }
    
            shapesArray.forEach(shape => {
                var elem = new GraphicElement([vShapeMarker, vBGColorMarker, vHeightPctMarker, shape]);
                vGraphicElementArray.push(elem);
            })
    
            // se e' il primo giro, imposto lo sfondo
            if (i == 0 && vBGColorMarker != DEFAULT_BGD_COLOR) {
                // TODO
            }
    
            var startX = 0;
    
            vGraphicElementArray.forEach(elem => {
                switch (elem.getShape()) {
                    case 'circle':
                        break;
    
                    case 'tril':
                        break;
    
                    case 'trir':
                        break;
    
                    default:
                        // bar
                        startX = this.getNewStarXFromBar(ctx, startX, elem);
                        break;
                }
            })
        }
    
        vSeparatorsList.forEach(sep => {
            if (DEBUG) {
                console.log(sep);
            }
    
            if (sep.startsWith("SEP") || sep.startsWith("DIV")) {
                this.drawSeparator(ctx, sep);
            } else if (sep.startsWith("ARW")) {
                this.drawArrow(ctx, sep);
            } else if (sep.startsWith("GRID")) {
                this.drawGrid(ctx, sep);
            }
        });
    }
    
    drawSeparator(ctx, sep) {
    
        var vSeparatorPart = sep.substring("SEP;".length).split(";");
        var vColor = "R000G000B000";
        var vThickness = 2;
        var vPositionPart = vSeparatorPart[0];
        if (vSeparatorPart.length > 1) {
            vColor = vSeparatorPart[1];
        }
        if (vSeparatorPart.length > 2) {
            vThickness = parseInt(vSeparatorPart[2]);
        }
    
        // I dont know, but it's a fucking copia incolla
        if (vPositionPart.indexOf(",") > -1) {
            vPositionPart = vPositionPart.replace(',', '.');
        }
    
        var x = this.getDim(ctx.canvas.width, parseFloat(vPositionPart));
    
        this.drawRect(ctx, x, 0, vThickness, ctx.canvas.height, getColorFromString(vColor));
    }
    
    drawGrid(ctx, sep) {
        var vPart = sep.substring("GRID;".length);
        if (vPart.indexOf(",") > -1) {
            vPart = vPart.replace(',', '.');
        }
        var vTickNum = parseInt(vPart);
        var vTickDist = ctx.canvas.width / vTickNum;
    
        var tickH = ctx.canvas.height / 5;
        var y = ctx.canvas.height - tickH;
    
        var tickW = 1;
        for (var i = vTickDist; i < ctx.canvas.width; i = i + vTickDist) {
            this.drawRect(ctx, i, y, tickW, tickH, DEFAULT_COLOR);
        }
    }
    
    drawArrow(ctx, sep) {
        var vPart = sep.substring("ARW;".length);
        if (vPart.indexOf(',') > -1) {
            vPart = vPart.replace(',', '.');
        }
    
        ctx.fillStyle = DEFAULT_COLOR.toString();
    
        var startX = this.getDim(ctx.canvas.width, parseFloat(vPart));
        var height = ctx.canvas.height;
        var arrSpan = parseInt(height / 3);
        var arrSpanHalf = arrSpan / 2;
    
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX - arrSpan, height / 2);
        ctx.lineTo(startX - arrSpanHalf, height / 2);
        ctx.lineTo(startX - arrSpanHalf, height);
        ctx.lineTo(startX + arrSpanHalf, height);
        ctx.lineTo(startX + arrSpanHalf, height / 2);
        ctx.lineTo(startX + arrSpan, height / 2);
        ctx.fill();
    }
    
    isShapeMarker(value) {
        if (value) {
            return value.toUpperCase().startsWith("SHAPE;")
        }
        return false;
    }
    
    isBgColorMarker(value) {
        if (value) {
            return value.toUpperCase().startsWith("BCOLOR;")
        }
        return false;
    }
    
    isHeightMarker(value) {
        if (value) {
            return value.toUpperCase().startsWith("HEIGHT;")
        }
        return false;
    }
    
    isDecoratorMarker(value) {
        if (value) {
            return value.toUpperCase().startsWith("SEP;")
                || value.toUpperCase().startsWith("DIV;")
                || value.toUpperCase().startsWith("ARW;")
                || value.toUpperCase().startsWith("GRID;");
        }
        return false;
    }
    
    getDim(dimPixel, dimPerc) {
        return parseInt((dimPixel / 100) * dimPerc);
    }
    
    getNewStarXFromBar(ctx, startX, elem) {
        var elemWidth = this.getDim(ctx.canvas.width, elem.getWidth());
        var elemHeight = this.getDim(ctx.canvas.height, elem.getHeight());
        var y = ctx.canvas.height - elemHeight;
    
        if (!elem.isTrasparent()) {
            this.drawRect(ctx, startX, y, elemWidth, elemHeight, elem.getColor());
        }
    
        return elemWidth;
    }
    
    drawRect(ctx, x, y, width, height, c) {
        if (DEBUG) {
            console.log('x', x);
            console.log('y', y);
            console.log('w', width);
            console.log('h', height);
            console.log('c', c);
        }
    
        ctx.fillStyle = c.toString();
        ctx.fillRect(x, y, width, height);
    }
}