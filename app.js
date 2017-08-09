import { GraphicElement } from './graphic-element';

const values = ['R255G128B000;20,58\\HEIGHT;60'];
const GRAPHIC_ELEMENT_MARKER_SPLITTER = "\\";
const GRAPHIC_ELEMENT_SPLITTER = "\\AND\\"
const DEFAULT_BGD_COLOR = "BCOLOR;R255G255B255";

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
        let vGraphicElementArray = [];

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
            console.log(shape);
            var elem = new GraphicElement({ shape, vShapeMarker, vBGColorMarker, vHeightPctMarker });
            vGraphicElementArray.push(elem);
        })

        // se e' il primo giro, imposto lo sfondo
        if (i == 0 && vBGColorMarker != DEFAULT_BGD_COLOR) {
            // TODO
        }

        vGraphicElementArray.forEach(elem => {
            console.log(elem);
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

class GraphicElement {

    height = 100.0;
    width = 100.0;
    shape;
    color = new Color(0, 0, 0);

    constructor(options) {
        this.init(options);
    }

    init(options) {
        this.initHeight(options.vHeightPctMarker);
        this.initShape(options.vShapeMarker);
        this.initColor(options.vBGColorMarker);
    }

    initColor(rgbString) {
        if (rgbString.length > 11 && this.isValidColor(rgbString)) {
            // TODO
            this.color = new Color(255, 255, 255);
        } else if (rgbString.toUpperCase() == '*NONE') {
            try {
                this.width = parseFloat(rgbString.substring(6).replace(',', '.'));
            } catch (e) {
                console.error(e);
            }
        }
    }

    initHeight(height) {
        if (height) {
            let toBeParsed = height.substring("HEIGHT;".length).replace(',', '.');

            this.height = parseFloat(toBeParsed);
        }
    }

    initShape(shape) {
        shape = shape.substring("SHAPE;".length);
        let vLastSemicolonIndex = shape.indexOf(";");
        let vShapeTypeString = shape;
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
                this.shape = "";
                break;

            case "tril":
                this.shape = "";
                break;

            case "trir":
                this.shape = "";
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

    r = 0;
    g = 0;
    b = 0;

    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    get red() {
        return this.r;
    }

    get green() {
        return this.g;
    }

    get blue() {
        return this.b;
    }
}