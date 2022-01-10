"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marco = exports.LineComment = exports.Scanner = void 0;
const common_1 = require("../common");
const ast_1 = require("./ast");
const tool_1 = require("./tool");
class LineComment extends common_1.Range {
    constructor(raw) {
        super();
        this.raw = raw;
    }
    lineNumber() {
        return this.start.line;
    }
}
exports.LineComment = LineComment;
class Marco extends common_1.Range {
    constructor(raw) {
        super();
        this.raw = raw;
    }
}
exports.Marco = Marco;
const isLineCommentStartRegExp = /^\s*\/\/(?!\!)/;
function isLineComment(text) {
    return isLineCommentStartRegExp.test(text);
}
const isMarcoStartRegExp = /^\s*#/;
function isMarco(text) {
    return isMarcoStartRegExp.test(text);
}
function isZincStart(text) {
    return /^\s*\/\/! zinc\b/.test(text);
}
function isZincEnd(text) {
    return /^\s*\/\/! endzinc\b/.test(text);
}
class Scanner {
    constructor(content) {
        var _a, _b;
        this.lineComments = [];
        this.marcos = [];
        this.zincLines = [];
        this.jassLines = [];
        this.content = tool_1.removeComment(content);
        this.rawLines = (_b = (_a = this.content.match(/^.*$/gm)) === null || _a === void 0 ? void 0 : _a.map((value, index) => {
            const lineText = new ast_1.LineText(value);
            lineText.start = new common_1.Position(index, 0);
            lineText.end = new common_1.Position(index, value.length);
            return lineText;
        })) !== null && _b !== void 0 ? _b : [];
        Object.assign(this, {
            content: undefined
        });
        this.lineCount = this.rawLines.length;
        this.rawLines = this.rawLines.filter((lineText) => !lineText.isEmpty());
        this.scannerLineComments();
        this.jassLines.push(...this.rawLines);
        this.rawLines.length = 0;
        Object.assign(this, {
            rawLines: undefined
        });
    }
    scannerLineComments() {
        this.rawLines = this.rawLines.filter((lineText) => {
            if (isLineComment(lineText.text)) {
                const lineComment = new LineComment(lineText.text);
                lineComment.setRange(lineText);
                this.lineComments.push(lineComment);
                return false;
            }
            return true;
        });
    }
    scannerMarcos() {
        this.rawLines = this.rawLines.filter((lineText) => {
            if (isMarco(lineText.text)) {
                const marco = new Marco(lineText.text);
                marco.setRange(lineText);
                this.marcos.push(marco);
                return false;
            }
            return true;
        });
    }
    scannerZincLineText() {
        let inZinc = false;
        this.rawLines = this.rawLines.filter((lineText) => {
            if (isZincStart(lineText.text)) {
                inZinc = true;
                return false;
            }
            else if (isZincEnd(lineText.text)) {
                inZinc = false;
                return false;
            }
            else if (inZinc) {
                this.zincLines.push(lineText);
                return false;
            }
            return true;
        });
    }
    zincContent() {
        let content = "";
        for (let index = 0; index < this.lineCount; index++) {
            const lineText = this.zincLines.find(lineText => lineText.lineNumber() == index);
            if (lineText) {
                content += `${lineText.text}\n`;
            }
            else {
                content += "\n";
            }
        }
        return content;
    }
}
exports.Scanner = Scanner;
if (false) {
    const scanner = new Scanner(`
    a   
  b
  // a
  #define
  

  
  `);
    console.log(scanner);
    console.log(scanner.zincContent());
}
