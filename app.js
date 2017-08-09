const values = ['R255G128B000;20,58\\HEIGHT;60'];
const GRAPHIC_ELEMENT_MARKER_SPLITTER = "\\";
const GRAPHIC_ELEMENT_SPLITTER = "\\AND\\"
const DEFAULT_BGD_COLOR = "BCOLOR;R255G000B000";

function draw() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        for (var i = 0; i < values.length; i++) {
            drawGraphicCell(ctx, values[i]);
        }
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
            rgbString = rgbString.substring(0, 12);

            var rIndex = rgbString.indexOf('R');
            var gIndex = rgbString.indexOf('G');
            var bIndex = rgbString.indexOf('B');

            if (rIndex < 0
                || gIndex < 0
                || bIndex < 0) {

                return;
            }

            var r = rgbString.substring(rIndex + 1, rIndex + 4);
            var g = rgbString.substring(gIndex + 1, gIndex + 4);
            var b = rgbString.substring(bIndex + 1, bIndex + 4);

            try {
                this.color = new Color(parseInt(r), parseInt(g), parseInt(b));
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
            console.log(toBeParsed);

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