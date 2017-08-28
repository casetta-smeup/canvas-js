const GRAPHIC_ELEMENT_MARKER_SPLITTER = "\\";
const GRAPHIC_ELEMENT_SPLITTER = "\\AND\\"
const DEFAULT_BGD_COLOR = "BCOLOR;R255G000B000";
const DEFAULT_COLOR = new Color(0, 0, 0);

function onload() {
  new GraphicCell('canvas00', 'R255G128B000;20,58\\HEIGHT;60').draw();
  new GraphicCell('canvas01', 'R255G000B000;12,4\\SEP;25,00;R000G000B255;5\\R255G255B000;74,00\\GRID;20').draw();
  new GraphicCell('canvas02', 'R000G255B128;33,3\\ARW;50,00\\R255G255B051;66,5\\R220G000B000;100,0\\GRID;3').draw();
  new GraphicCell('canvas03', 'SHAPE;CIRCLE\\R000G255B128;33,3\\R255G255B051;66,5\\R220G000B000;100,0').draw();
  new GraphicCell('canvas04', 'SHAPE;TRIR\\R000G255B128;33,3\\R255G255B051;66,5\\R220G000B000;100,0').draw();
  new GraphicCell('canvas05', 'SHAPE;TRIL\\R000G255B128;33,3\\R255G255B051;66,5\\R220G000B000;100,0').draw();
  new GraphicCell('canvas06', 'SHAPE;TRIR;50\\BCOLOR;R102G255B178\\*NONE;33,3\\R255G255B051;66,5').draw();
  new GraphicCell('canvas07', 'SHAPE;TRIR\\R000G255B128;33,3\\AND\\SHAPE;TRIL\\*NONE;33,3\\R255G255B051;66,6\\AND\\SHAPE;CIRCLE\\R000G000B255;66,6').draw();
}

function GraphicElement() {

  this.width = 100.0;
  this.height = 100.0;
  this.color = null;
  this.shape = 'bar';

  this.init = function(markers) {
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

  this.initColor = function(rgbString) {
    if (rgbString.length > 11 && this.isValidColor(rgbString)) {
      this.color = getColorFromString(rgbString.substring(0, 12));

      try {
        this.width = parseFloat(rgbString.substring(13).replace(',', '.'));
      } catch (e) {
        console.error(e);
      }
    } else if (rgbString.startsWith('*NONE')) {
      try {
        this.width = parseFloat(rgbString.substring(6).replace(',', '.'));
      } catch (e) {
        console.error(e);
      }
    }
  }

  this.isTrasparent = function() {
    return this.color == null;
  }

  this.initHeight = function(height) {
    if (height) {
      var toBeParsed = height.substring("HEIGHT;".length).replace(',', '.');

      this.height = parseFloat(toBeParsed);
    }
  }

  this.initShape = function(shape) {
    shape = shape.substring("SHAPE;".length);
    var vLastSemicolonIndex = shape.indexOf(";");
    var vShapeTypeString = shape;
    if (vLastSemicolonIndex > -1) {
      vShapeTypeString = shape.substring(0, vLastSemicolonIndex);

      try {
        this.width = parseFloat(shape.substring(vLastSemicolonIndex + 1).replace(',', '.'));
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

  this.isValidColor = function(color) {
    if (!color) {
      return false;
    }

    color = color.trim();

    var vRgb = [];

    var vError = false;

    var vColorKey = null;

    // red
    var vIndex = color.indexOf('R');
    if (vIndex > -1) {
      vColorKey = color.substring(vIndex + 1, vIndex + 4);
      vRgb[0] = parseInt(vColorKey);
      if (isNaN(vRgb[0])) {
        vError = true;
      }
    }

    // green
    var vIndex = color.indexOf('G');
    if (vIndex > -1) {
      vColorKey = color.substring(vIndex + 1, vIndex + 4);
      vRgb[1] = parseInt(vColorKey);
      if (isNaN(vRgb[1])) {
        vError = true;
      }
    }

    // blue
    var vIndex = color.indexOf('B');
    if (vIndex > -1) {
      vColorKey = color.substring(vIndex + 1, vIndex + 4);
      vRgb[2] = parseInt(vColorKey);
      if (isNaN(vRgb[2])) {
        vError = true;
      }
    }


    if (vError) {
      var vIndexR = aColorCode.indexOf('R');
      var vIndexG = aColorCode.indexOf('G');
      var vIndexB = aColorCode.indexOf('B');

      // Ricerca componente R
      vColorKey = aColorCode.substring(vIndexR + 1, vIndexG);
      vRgb[0] = parseInt(vColorKey);
      if (isNaN(vRgb[0])) {
        vError = true;
      }

      // Ricerca componente G
      vColorKey = aColorCode.substring(vIndexG + 1, vIndexB);
      vRgb[1] = parseInt(vColorKey);
      if (isNaN(vRgb[1])) {
        vError = true;
      }

      // Ricerca componente B
      vColorKey = aColorCode.substring(vIndexB + 1);
      vRgb[2] = parseInt(vColorKey);
      if (isNaN(vRgb[2])) {
        vError = true;
      }

      if (vError) {
        return false;
      }
    }

    // Controllo che tutti i valori siano compresi tra 0 e 255
    if ((vRgb[0] < 0) || (vRgb[0] > 255) || (vRgb[1] < 0) || (vRgb[1] > 255) || (vRgb[2] < 0) || (vRgb[2] > 255)) {
      return false;
    }

    // Se arrivo qui tutto va bene
    return true;
  }

  this.getHeight = function() {
    return this.height;
  }

  this.getWidth = function() {
    return this.width;
  }

  this.getShape = function() {
    return this.shape;
  }

  this.getColor = function() {
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

function GraphicCell(canvasID, value) {

  this.canvasID = canvasID;
  this.value = value;

  this.draw = function() {
    var canvas = document.getElementById(this.canvasID);
    this.canvas = canvas;

    if (canvas.getContext) {
      this.ctx = canvas.getContext('2d');

      this.drawGraphicCell();
    }
  }

  this.drawGraphicCell = function() {
    var vGraphicElementDefinitionArr = this.value.split(GRAPHIC_ELEMENT_SPLITTER);

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
        var elem = new GraphicElement();
        elem.init([vShapeMarker, vBGColorMarker, vHeightPctMarker, shape]);
        vGraphicElementArray.push(elem);
      })

      // se e' il primo giro, imposto lo sfondo
      if (i == 0 && vBGColorMarker != DEFAULT_BGD_COLOR) {
        var bgColor = getColorFromString(vBGColorMarker.substring('BCOLOR;'.length));
        this.drawRect(0, 0, this.canvas.width, this.canvas.height, bgColor);
      }

      var startX = 0;

      vGraphicElementArray.forEach(elem => {
        switch (elem.getShape()) {
          case 'circle':
            startX = this.getNewStarXFromCircle(startX, elem);
            break;

          case 'tril':
            startX = this.getNewStarXFromTril(startX, elem);
            break;

          case 'trir':
            startX = this.getNewStarXFromTrir(startX, elem);
            break;

          default:
            // bar
            startX = this.getNewStarXFromBar(startX, elem);
            break;
        }
      })
    }

    vSeparatorsList.forEach(sep => {
      if (sep.startsWith("SEP") || sep.startsWith("DIV")) {
        this.drawSeparator(sep);
      } else if (sep.startsWith("ARW")) {
        this.drawArrow(sep);
      } else if (sep.startsWith("GRID")) {
        this.drawGrid(sep);
      }
    });
  }

  this.drawSeparator = function(sep) {
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

    var x = this.getDim(this.canvas.width, parseFloat(vPositionPart));

    this.drawRect(x, 0, vThickness, this.canvas.height, getColorFromString(vColor));
  }

  this.drawGrid = function(sep) {
    var vPart = sep.substring("GRID;".length);
    if (vPart.indexOf(",") > -1) {
      vPart = vPart.replace(',', '.');
    }
    var vTickNum = parseInt(vPart);
    var vTickDist = this.canvas.width / vTickNum;

    var tickH = this.canvas.height / 5;
    var y = this.canvas.height - tickH;

    var tickW = 1;
    for (var i = vTickDist; i < this.canvas.width; i = i + vTickDist) {
      this.drawRect(i, y, tickW, tickH, DEFAULT_COLOR);
    }
  }

  this.drawArrow = function(sep) {
    var vPart = sep.substring("ARW;".length);
    if (vPart.indexOf(',') > -1) {
      vPart = vPart.replace(',', '.');
    }

    this.ctx.fillStyle = DEFAULT_COLOR.toString();

    var startX = this.getDim(this.canvas.width, parseFloat(vPart));
    var height = this.canvas.height;
    var arrSpan = parseInt(height / 3);
    var arrSpanHalf = arrSpan / 2;

    this.ctx.beginPath();
    this.ctx.moveTo(startX, 0);
    this.ctx.lineTo(startX - arrSpan, height / 2);
    this.ctx.lineTo(startX - arrSpanHalf, height / 2);
    this.ctx.lineTo(startX - arrSpanHalf, height);
    this.ctx.lineTo(startX + arrSpanHalf, height);
    this.ctx.lineTo(startX + arrSpanHalf, height / 2);
    this.ctx.lineTo(startX + arrSpan, height / 2);
    this.ctx.fill();
  }

  this.isShapeMarker = function(value) {
    if (value) {
      return value.toUpperCase().startsWith("SHAPE;")
    }
    return false;
  }

  this.isBgColorMarker = function(value) {
    if (value) {
      return value.toUpperCase().startsWith("BCOLOR;")
    }
    return false;
  }

  this.isHeightMarker = function(value) {
    if (value) {
      return value.toUpperCase().startsWith("HEIGHT;")
    }
    return false;
  }

  this.isDecoratorMarker = function(value) {
    if (value) {
      return value.toUpperCase().startsWith("SEP;")
        || value.toUpperCase().startsWith("DIV;")
        || value.toUpperCase().startsWith("ARW;")
        || value.toUpperCase().startsWith("GRID;");
    }
    return false;
  }

  this.getDim = function(dimPixel, dimPerc) {
    return parseInt((dimPixel / 100) * dimPerc);
  }

  this.getNewStarXFromBar = function(startX, elem) {
    var elemWidth = this.getDim(this.canvas.width, elem.getWidth());
    var elemHeight = this.getDim(this.canvas.height, elem.getHeight());
    var y = this.canvas.height - elemHeight;

    if (!elem.isTrasparent()) {
      this.drawRect(startX, y, elemWidth, elemHeight, elem.getColor());
    }

    return elemWidth;
  }

  this.getNewStarXFromCircle = function(startX, circle) {
    var newStartX = this.getDim(this.canvas.width, circle.getWidth());

    var x = (startX + newStartX) / 2;

    if (!circle.isTrasparent()) {
      this.drawArc(x, this.canvas.height / 2, circle.getColor());
    }

    return newStartX;
  }

  this.getNewStarXFromTril = function(startX, tril) {
    var newStartX = this.getDim(this.canvas.width, tril.getWidth());

    if (!tril.isTrasparent()) {
      this.drawTri(newStartX, 0, startX, this.canvas.height / 2, tril.getColor());
    }

    return newStartX;
  }

  this.getNewStarXFromTrir = function(startX, trir) {
    var newStartX = this.getDim(this.canvas.width, trir.getWidth());

    if (!trir.isTrasparent()) {
      this.drawTri(startX, 0, newStartX, this.canvas.height / 2, trir.getColor());
    }

    return newStartX;
  }

  this.drawArc = function(x, radius, c) {
    this.ctx.fillStyle = c.toString();
    this.ctx.beginPath();
    this.ctx.arc(x, radius, radius, 0, 2 * Math.PI, true);
    this.ctx.fill();
  }

  this.drawRect = function(x, y, width, height, c) {
    this.ctx.fillStyle = c.toString();
    this.ctx.fillRect(x, y, width, height);
  }

  this.drawTri = function(x1, y1, x2, y2, c) {
    this.ctx.fillStyle = c.toString();
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x1, this.canvas.height);
    this.ctx.fill();
  }
}

function Color(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;

  this.toString = function () {
    return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
  }
}