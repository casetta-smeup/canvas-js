const GRAPHIC_ELEMENT_MARKER_SPLITTER = "\\";
const GRAPHIC_ELEMENT_SPLITTER = "\\AND\\"
const DEFAULT_BGD_COLOR = "BCOLOR;R255G000B000";
const DEBUG = true;

function onload() {
    draw('canvas00', 'R255G128B000;20,58\\HEIGHT;60');
    draw('canvas01', 'R255G000B000;12,4\\SEP;25,00;R000G000B255;5\\R255G255B000;74,00\\GRID;20');
}

function draw(canvasID, value) {
    var canvas = document.getElementById(canvasID);
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        drawGraphicCell(ctx, value);
    }
}

function drawGraphicCell(ctx, value) {
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

            if (isShapeMarker(vString)) {
                vShapeMarker = vString;
            } else if (isBgColorMarker(vString)) {
                vBGColorMarker = vString;
            } else if (isHeightMarker(vString)) {
                vHeightPctMarker = vString;
            } else if (isDecoratorMarker(vString)) {
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
                    startX = getNewStarXFromBar(ctx, startX, elem);
                    break;
            }
        })
    }

    vSeparatorsList.forEach(sep => {
        if (DEBUG) {
            console.log(sep);
        }

        if (sep.startsWith("SEP") || sep.startsWith("DIV")) {
            drawSeparator(ctx, sep);
        } else if (sep.startsWith("ARW")) {
            // drawArrow(sep, width);
        } else if (sep.startsWith("GRID")) {
            // drawGrid(sep, shapes, width);
        }
    });
}

function drawSeparator(ctx, sep) {

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

    var x = getDim(ctx.canvas.width, parseFloat(vPositionPart));

    drawRect(ctx, x, 0, vThickness, ctx.canvas.height, getColorFromString(vColor));
}

function isShapeMarker(value) {
    if (value) {
        return value.toUpperCase().startsWith("SHAPE;")
    }
    return false;
}

function isBgColorMarker(value) {
    if (value) {
        return value.toUpperCase().startsWith("BCOLOR;")
    }
    return false;
}

function isHeightMarker(value) {
    if (value) {
        return value.toUpperCase().startsWith("HEIGHT;")
    }
    return false;
}

function isDecoratorMarker(value) {
    if (value) {
        return value.toUpperCase().startsWith("SEP;")
            || value.toUpperCase().startsWith("DIV;")
            || value.toUpperCase().startsWith("ARW;")
            || value.toUpperCase().startsWith("GRID;");
    }
    return false;
}

function getDim(dimPixel, dimPerc) {
    return parseInt((dimPixel / 100) * dimPerc);
}

function getNewStarXFromBar(ctx, startX, elem) {
    var elemWidth = getDim(ctx.canvas.width, elem.getWidth());
    var elemHeight = getDim(ctx.canvas.height, elem.getHeight());
    var y = ctx.canvas.height - elemHeight;

    if (!elem.isTrasparent()) {
        drawRect(ctx, startX, y, elemWidth, elemHeight, elem.getColor());
    }

    return elemWidth;
}

function drawRect(ctx, x, y, width, height, c) {
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