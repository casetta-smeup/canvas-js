import { Color } from './color';
import { Shape } from './shape';

export class GraphicElement {

    private height = 100.0;
    private width = 100.0;
    private shape: Shape = Shape.BAR;
    private color = new Color(0, 0, 0);

    constructor(options) {
        this.init(options);
    }

    private init(options) {
        this.initHeight(options.vHeightPctMarker);
        this.initShape(options.vShapeMarker);
        this.initColor(options.vBGColorMarker);
    }

    private initColor(rgbString: string) {
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

    private initHeight(height: string) {
        if (height) {
            let toBeParsed = height.substring("HEIGHT;".length).replace(',', '.');

            this.height = parseFloat(toBeParsed);
        }
    }

    private initShape(shape: string) {
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
                this.shape = Shape.CIRCLE;
                break;

            case "tril":
                this.shape = Shape.TRIL;
                break;

            case "trir":
                this.shape = Shape.TRIR;
                break;
        }
    }

    private isValidColor(color: string) {
        // TODO
        return true;
    }
}