"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.Position = void 0;
class Position {
    constructor(line, position = 0) {
        this.line = line;
        this.position = position;
    }
}
exports.Position = Position;
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    static default() {
        return new Range(new Position(0, 0), new Position(0, 0));
    }
}
exports.Range = Range;
