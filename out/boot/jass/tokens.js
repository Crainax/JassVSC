"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.tokens = exports.Token = void 0;
const tool_1 = require("../tool");
const range_1 = require("./range");
class Token {
    constructor(type, value, line, position) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.position = position;
        this.end = this.position + this.value.length;
    }
    isId() {
        return this.type === "id";
    }
    isOp() {
        return this.type === "op";
    }
    isInt() {
        return this.type === "int";
    }
    isReal() {
        return this.type === "real";
    }
    isString() {
        return this.type === "string";
    }
    isMark() {
        return this.type === "mark";
    }
    isError() {
        return this.type === "error";
    }
    isMacro() {
        return this.type === "macro";
    }
    isComment() {
        return this.type === "comment";
    }
    isBlockComment() {
        return this.type === "block_comment";
    }
    isNewLine() {
        return this.isOp() && this.value == "\n";
    }
}
exports.Token = Token;
class VToken {
    constructor(type, value) {
        this.loc = new range_1.Location();
        this.type = type;
        this.value = value;
    }
    isId() {
        return this.type === "id";
    }
    isOp() {
        return this.type === "op";
    }
    isInt() {
        return this.type === "int";
    }
    isReal() {
        return this.type === "real";
    }
    isString() {
        return this.type === "string";
    }
    isComment() {
        return this.type === "comment";
    }
    isBlockComment() {
        return this.type === "block_comment";
    }
    isMacro() {
        return this.type === "macro";
    }
    isOther() {
        return this.type === "other";
    }
}
function _isLetter(char) {
    if (!char) {
        return false;
    }
    return /[a-zA-Z]/.test(char);
}
function _isNumerical(char) {
    if (!char) {
        return false;
    }
    return /\d/.test(char);
}
function _isNumerical_0_7(char) {
    return ["0", "1", "2", "3", "4", "5", "6", "7"].includes(char);
}
function _isNumerical_16(char) {
    if (!char) {
        return false;
    }
    return _isNumerical(char) || /[a-fA-F]/.test(char);
}
function _isIdentifier(char) {
    if (!char) {
        return false;
    }
    return _isLetter(char) || _isNumerical(char) || char === "_";
}
function _isSpace(char) {
    if (!char) {
        return false;
    }
    return /\s/.test(char);
}
class TokenOption {
    constructor() {
        this.needParseNewHex = true;
        this.needParseZincReturnOp = false;
        this.ignoreZinc = true;
    }
}
function tokens(content) {
    const tokens = [];
    let lineNumber = 0;
    let position = 0;
    let state = 0;
    const next = (index) => {
        return content[index + 1];
    };
    const values = [];
    const push = (char) => {
        values.push(char);
    };
    const pushToken = (type) => {
        const value = values.join("");
        tokens.push(new Token(type, value, lineNumber, position - value.length + 1));
        values.length = 0;
        if (state != 0) {
            state = 0;
        }
    };
    const bad = () => {
        pushToken("error");
    };
    for (let index = 0; index < content.length; index++) {
        const char = content[index];
        const nextChar = next(index);
        if (state == 0) {
            if (char == "/") {
                push(char);
                if (nextChar && nextChar == "/") {
                    state = 20;
                }
                else if (nextChar && nextChar == "*") {
                    state = 21;
                }
                else {
                    pushToken("op");
                }
            }
            else if (tool_1.isLetter(char)) {
                push(char);
                if (nextChar && tool_1.isLetter(nextChar) || nextChar == "_" || tool_1.isNumber(nextChar)) {
                    state = 1;
                }
                else {
                    pushToken("id");
                }
            }
            else if (char == "0") {
                push(char);
                if (nextChar && tool_1.is0_7(nextChar)) {
                    state = 2;
                }
                else if (nextChar && nextChar == "x") {
                    state = 3;
                }
                else if (nextChar && nextChar == ".") {
                    state = 9;
                }
                else {
                    pushToken("int");
                }
            }
            else if (char == "\"") {
                push(char);
                if (nextChar && nextChar == "\"") {
                    state = 4;
                }
                else if (nextChar && nextChar == "\\") {
                    state = 5;
                }
                else if (nextChar && tool_1.isNotNewLine(nextChar)) {
                    state = 6;
                }
                else {
                    bad();
                }
            }
            else if (tool_1.is1_9(char)) {
                push(char);
                if (nextChar && tool_1.isNumber(nextChar)) {
                    state = 8;
                }
                else if (nextChar && nextChar == ".") {
                    state = 9;
                }
                else {
                    pushToken("int");
                }
            }
            else if (char == ".") {
                push(char);
                if (nextChar && tool_1.isNumber(nextChar)) {
                    state = 10;
                }
                else {
                    pushToken("op");
                }
            }
            else if (char == "+") {
                push(char);
                pushToken("op");
            }
            else if (char == "-") {
                push(char);
                if (nextChar && nextChar == ">") {
                    state = 11;
                }
                else {
                    pushToken("op");
                }
            }
            else if (char == "*") {
                push(char);
                pushToken("op");
            }
            else if (char == "=") {
                push(char);
                if (nextChar && nextChar == "=") {
                    state = 12;
                }
                else {
                    pushToken("op");
                }
            }
            else if (char == ">") {
                push(char);
                if (nextChar && nextChar == "=") {
                    state = 13;
                }
                else {
                    pushToken("op");
                }
            }
            else if (char == "<") {
                push(char);
                if (nextChar && nextChar == "=") {
                    state = 14;
                }
                else {
                    pushToken("op");
                }
            }
            else if (char == "|") {
                push(char);
                if (nextChar && nextChar == "|") {
                    state = 15;
                }
                else {
                    bad();
                }
            }
            else if (char == "&") {
                push(char);
                if (nextChar && nextChar == "&") {
                    state = 16;
                }
                else {
                    bad();
                }
            }
            else if (char == "!") {
                push(char);
                if (nextChar && nextChar == "=") {
                    state = 17;
                }
                else {
                    pushToken("op");
                }
            }
            else if (char == "(") {
                push(char);
                pushToken("op");
            }
            else if (char == ")") {
                push(char);
                pushToken("op");
            }
            else if (char == "[") {
                push(char);
                pushToken("op");
            }
            else if (char == "]") {
                push(char);
                pushToken("op");
            }
            else if (char == "{") {
                push(char);
                pushToken("op");
            }
            else if (char == "}") {
                push(char);
                pushToken("op");
            }
            else if (char == ",") {
                push(char);
                pushToken("op");
            }
            else if (char == ";") {
                push(char);
                pushToken("op");
            }
            else if (char == "'") {
                push(char);
                if (nextChar && (tool_1.isNumber(nextChar) || tool_1.isLetter(nextChar))) {
                    state = 18;
                }
                else {
                    bad();
                }
            }
            else if (char == "%") {
                push(char);
                pushToken("op");
            }
            else if (char == "$") {
                push(char);
                if (nextChar && tool_1.is0_16(nextChar)) {
                    state = 4;
                }
                else {
                    bad();
                }
            }
            else if (char == "\n") {
                push(char);
                pushToken("op");
            }
            else if (tool_1.isSpace(char) || tool_1.isNewLine(char)) {
            }
            else {
                push(char);
                bad();
            }
        }
        else if (state == 1) {
            push(char);
            if (nextChar && tool_1.isLetter(nextChar) || nextChar == "_" || tool_1.isNumber(nextChar)) {
            }
            else {
                pushToken("id");
            }
        }
        else if (state == 2) {
            push(char);
            if (nextChar && tool_1.is0_7(nextChar)) {
            }
            else {
                pushToken("int");
            }
        }
        else if (state == 3) {
            push(char);
            if (nextChar && tool_1.is0_16(nextChar)) {
                state = 4;
            }
            else {
                bad();
            }
        }
        else if (state == 4) {
            push(char);
            if (nextChar && tool_1.is0_16(nextChar)) {
            }
            else {
                pushToken("int");
                state = 0;
            }
        }
        else if (state == 5) {
            push(char);
            if (nextChar && nextChar == "\"") {
                state = 7;
            }
            else if (nextChar && tool_1.isNotNewLine(nextChar)) {
                state = 6;
            }
            else {
                bad();
            }
        }
        else if (state == 6) {
            push(char);
            if (nextChar && nextChar == "\"") {
                state = 4;
            }
            else if (nextChar && nextChar == "\\") {
                state = 5;
            }
            else if (nextChar && tool_1.isNotNewLine(nextChar)) {
            }
            else {
                bad();
            }
        }
        else if (state == 7) {
            push(char);
            if (nextChar && nextChar == "\"") {
                state = 4;
            }
            else if (nextChar && tool_1.isNotNewLine(nextChar)) {
                state = 6;
            }
            else {
                bad();
            }
        }
        else if (state == 8) {
            push(char);
            if (nextChar && tool_1.isNumber(nextChar)) {
            }
            else if (nextChar && nextChar == ".") {
                state = 9;
            }
            else {
                pushToken("int");
            }
        }
        else if (state == 9) {
            push(char);
            if (nextChar && tool_1.isNumber(nextChar)) {
                state = 10;
            }
            else {
                pushToken("real");
            }
        }
        else if (state == 10) {
            push(char);
            if (nextChar && tool_1.isNumber(nextChar)) {
            }
            else {
                pushToken("real");
            }
        }
        else if (state == 11) {
            push(char);
            pushToken("op");
        }
        else if (state == 12) {
            push(char);
            pushToken("op");
        }
        else if (state == 13) {
            push(char);
            pushToken("op");
        }
        else if (state == 14) {
            push(char);
            pushToken("op");
        }
        else if (state == 15) {
            push(char);
            pushToken("op");
        }
        else if (state == 16) {
            push(char);
            pushToken("op");
        }
        else if (state == 17) {
            push(char);
            pushToken("op");
        }
        else if (state == 18) {
            push(char);
            if (nextChar && nextChar == "'") {
                state = 19;
            }
            else if (nextChar && (tool_1.isNumber(nextChar) || tool_1.isLetter(nextChar))) {
            }
            else {
                bad();
            }
        }
        else if (state == 19) {
            push(char);
            pushToken("mark");
        }
        else if (state == 20) {
            push(char);
            if (!nextChar || tool_1.isNewLine(nextChar)) {
                pushToken("comment");
            }
        }
        else if (state == 21) {
            push(char);
            if (!nextChar) {
                bad();
            }
            else if (nextChar == "*") {
                state = 22;
            }
        }
        else if (state == 22) {
            push(char);
            if (!nextChar) {
                bad();
            }
            else if (nextChar == "*") {
            }
            else if (nextChar == "/") {
                state = 23;
            }
            else {
                state = 21;
            }
        }
        else if (state == 23) {
            push(char);
            pushToken("block_comment");
        }
        if (char == "\n") {
            lineNumber++;
            position = 0;
        }
        else {
            position++;
        }
    }
    return tokens;
}
exports.tokens = tokens;
function tokenize(content) {
    return tokens(content);
}
exports.tokenize = tokenize;
