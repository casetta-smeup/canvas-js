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

        for (var j = 0; j < shapesArray.length; j++) {
            var shape = shapesArray[j];

            var elem = new GraphicElement({ shape, vShapeMarker, vBGColorMarker, vHeightPctMarker });
        }
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