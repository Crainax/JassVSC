"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.Position = void 0;
class Position {
    constructor(line = 0, position = 0) {
        this.line = line;
        this.position = position;
    }
}
exports.Position = Position;
class Range {
    constructor(start = new Position(), end = new Position()) {
        this.start = start;
        this.end = end;
    }
    static default() {
        return new Range(new Position(0, 0), new Position(0, 0));
    }
    setRange(range) {
        this.start = range.start;
        this.end = range.end;
    }
    contains(positionOrRange) {
        if (positionOrRange instanceof Position) {
            return (this.start.line < positionOrRange.line || (this.start.line == positionOrRange.line && this.start.position < positionOrRange.position))
                &&
                    (this.end.line > positionOrRange.line || (this.end.line == positionOrRange.line && this.end.position > positionOrRange.position));
        }
        else {
            return (this.start.line < positionOrRange.start.line || (this.start.line == positionOrRange.start.line && this.start.position < positionOrRange.start.position))
                &&
                    (this.end.line > positionOrRange.end.line || (this.end.line == positionOrRange.end.line && this.end.position > positionOrRange.end.position));
        }
    }
}
exports.Range = Range;
