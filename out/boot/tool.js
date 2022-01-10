"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.getPathFileName = exports.isZincFile = exports.isAiFile = exports.isJFile = exports.resolvePaths = exports.removeComment = exports.retainVjassBlock = exports.unique = exports.retainZincBlock = exports.isSpace = exports.isNumber = exports.isNotNewLine = exports.isNewLine = exports.isLetter = exports.is1_9 = exports.is0_7 = exports.is0_16 = void 0;
const fs = require("fs");
const path = require("path");
const letterRegExp = new RegExp(/[a-zA-Z]/);
const numberRegExp = new RegExp(/\d/);
const spaceRegExp = new RegExp(/[ \t]/);
const newLineRegExp = new RegExp(/[\r\n]/);
const idRegExp = new RegExp(/[a-zA-Z][a-zA-Z0-9_]*/);
function isLetter(char) {
    return letterRegExp.test(char);
}
exports.isLetter = isLetter;
function isNumber(char) {
    return numberRegExp.test(char);
}
exports.isNumber = isNumber;
function is1_9(char) {
    return new RegExp(/[1-9]/).test(char);
}
exports.is1_9 = is1_9;
function is0_7(char) {
    return new RegExp(/[0-7]/).test(char);
}
exports.is0_7 = is0_7;
function is0_16(char) {
    return isNumber(char) || /[a-fA-F]/.test(char);
}
exports.is0_16 = is0_16;
function isSpace(char) {
    return spaceRegExp.test(char);
}
exports.isSpace = isSpace;
function isNewLine(char) {
    if (!char)
        return false;
    return newLineRegExp.test(char);
}
exports.isNewLine = isNewLine;
function isNotNewLine(char) {
    return /[^\r\n]/.test(char);
}
exports.isNotNewLine = isNotNewLine;
const spaceCode = " ".charCodeAt(0);
function removeComment(content) {
    let status = 0;
    let blockStart = 0;
    let line = 0;
    content = content.replace(/\r\n/g, "\n");
    const len = content.length;
    const chars = [];
    for (let index = 0; index < len; index++) {
        const char = content.charAt(index);
        const nextChar = content.charAt(index + 1);
        if (status == 0) {
            if (char == "/") {
                blockStart = index;
                if (nextChar == "/") {
                    status = 1;
                }
                else if (nextChar == "*") {
                    status = 2;
                }
                else {
                    chars.push(char);
                }
            }
            else if (char == "\"") {
                status = 4;
                chars.push(char);
            }
            else {
                chars.push(char);
            }
        }
        else if (status == 1) {
            if (!nextChar || isNewLine(nextChar)) {
                status = 0;
            }
        }
        else if (status == 2) {
            if (nextChar == "*") {
                status = 3;
            }
            if (isNewLine(char)) {
                chars.push("\n");
            }
        }
        else if (status == 3) {
            if (nextChar == "/") {
                status = 6;
            }
            else {
                status = 2;
            }
        }
        else if (status == 6) {
            status = 0;
        }
        else if (status == 4) {
            if (nextChar == "\"") {
                status = 0;
            }
            else if (nextChar == "\\") {
                status = 5;
            }
            else if (isNewLine(nextChar)) {
                status = 0;
            }
            chars.push(char);
        }
        else if (status == 5) {
            if (isNewLine(nextChar)) {
                status = 0;
            }
            else {
                status = 4;
            }
            chars.push(char);
        }
        if (isNewLine(char)) {
            line++;
        }
    }
    return chars.join("");
}
exports.removeComment = removeComment;
function retainZincBlock(content) {
    let status = 0;
    let blockStart = 0;
    let line = 0;
    let isStag = true;
    let useless = false;
    let inZinc = false;
    content = content.replace(/\r\n/g, "\n");
    const len = content.length;
    const chars = [];
    for (let index = 0; index < len; index++) {
        const char = content.charAt(index);
        const nextChar = content.charAt(index + 1);
        if (status == 0) {
            if (char == "/") {
                blockStart = index;
                if (isStag) {
                    useless = false;
                }
                else {
                    useless = true;
                }
                if (nextChar == "/") {
                    status = 1;
                }
                else if (nextChar == "*") {
                    status = 2;
                }
                else {
                }
            }
            else if (char == "\"") {
                status = 4;
            }
            else if (inZinc) {
                chars.push(char);
            }
        }
        else if (status == 1) {
            if (!nextChar || isNewLine(nextChar)) {
                if (/\s*\/\/![ \t]+zinc/.test(content.substring(blockStart, index + 1))) {
                    inZinc = true;
                }
                else if (/\s*\/\/![ \t]+endzinc/.test(content.substring(blockStart, index + 1))) {
                    inZinc = false;
                }
                status = 0;
            }
        }
        else if (status == 2) {
            if (nextChar == "*") {
                status = 3;
            }
        }
        else if (status == 3) {
            if (nextChar == "/") {
                status = 6;
            }
            else if (nextChar == "*") {
            }
            else {
                status = 2;
            }
        }
        else if (status == 6) {
            status = 0;
        }
        else if (status == 4) {
            if (nextChar == "\"") {
                status = 0;
            }
            else if (nextChar == "\\") {
                status = 5;
            }
            else if (isNewLine(nextChar)) {
                status = 0;
            }
        }
        else if (status == 5) {
            if (isNewLine(nextChar)) {
                status = 0;
            }
            else {
                status = 4;
            }
        }
        if (isNewLine(char)) {
            isStag = true;
            line++;
            if (!inZinc) {
                chars.push("\n");
            }
        }
        else if (isStag && char != " " && char != "\t") {
            isStag = false;
        }
    }
    return chars.join("");
}
exports.retainZincBlock = retainZincBlock;
function retainVjassBlock(content, callBack = null) {
    let status = 0;
    let blockStart = 0;
    let line = 0;
    let isStag = true;
    let useless = false;
    let inZinc = false;
    content = content.replace(/\r\n/g, "\n");
    const len = content.length;
    const chars = [];
    for (let index = 0; index < len; index++) {
        const char = content.charAt(index);
        const nextChar = content.charAt(index + 1);
        if (status == 0) {
            if (char == "/") {
                blockStart = index;
                if (isStag) {
                    useless = false;
                }
                else {
                    useless = true;
                }
                if (nextChar == "/") {
                    status = 1;
                }
                else if (nextChar == "*") {
                    status = 2;
                }
                else {
                }
            }
            else if (char == "\"") {
                status = 4;
            }
            else if (!inZinc) {
                chars.push(char);
            }
        }
        else if (status == 1) {
            if (!nextChar || isNewLine(nextChar)) {
                const commentString = content.substring(blockStart, index + 1);
                if (/\s*\/\/![ \t]+zinc/.test(content.substring(blockStart, index + 1))) {
                    inZinc = true;
                }
                else if (/\s*\/\/![ \t]+endzinc/.test(content.substring(blockStart, index + 1))) {
                    inZinc = false;
                }
                else if (!useless) {
                    if (callBack) {
                        callBack(line, commentString.replace("//", ""));
                    }
                }
                status = 0;
            }
        }
        else if (status == 2) {
            if (nextChar == "*") {
                status = 3;
            }
        }
        else if (status == 3) {
            if (nextChar == "/") {
                status = 6;
            }
            else if (nextChar == "*") {
            }
            else {
                status = 2;
            }
        }
        else if (status == 6) {
            status = 0;
        }
        else if (status == 4) {
            if (nextChar == "\"") {
                status = 0;
            }
            else if (nextChar == "\\") {
                status = 5;
            }
            else if (isNewLine(nextChar)) {
                status = 0;
            }
        }
        else if (status == 5) {
            if (isNewLine(nextChar)) {
                status = 0;
            }
            else {
                status = 4;
            }
        }
        if (isNewLine(char)) {
            isStag = true;
            line++;
            if (inZinc) {
                chars.push("\n");
            }
        }
        else if (isStag && char != " " && char != "\t") {
            isStag = false;
        }
    }
    return chars.join("");
}
exports.retainVjassBlock = retainVjassBlock;
function countNewLine(content) {
    let count = 0;
    for (let index = 0; index < content.length; index++) {
        const char = content[index];
        if (isNewLine(char)) {
            count++;
        }
    }
    return count;
}
class BlockMark {
    constructor(line, content) {
        this.line = line;
        this.content = content;
        this.endLine = line + countNewLine(content);
    }
}
function retainJassBlock(content) {
    content = removeComment(content);
    const marks = new Array();
    content.replace(/(?:^globals\b[\s\S]+?^endglobals\b|^function\b[\s\S]+?^endfunction\b|(?:constant\s+)?native[\s\S]+?$)/gm, (text, index, origin) => {
        let lineNumber = countNewLine(origin.substring(0, index));
        marks.push(new BlockMark(lineNumber, text));
        text.replace(/^globals\b[\s\S]+?^endglobals\b/gm, (text, index, origin) => {
            let lineNumber = countNewLine(origin.substring(0, index));
            marks.push(new BlockMark(lineNumber, text));
            return "";
        });
        return "";
    });
    console.log(marks);
}
function unique(arr) {
    return Array.from(new Set(arr));
}
exports.unique = unique;
const maxFileNumber = 24;
class ResolvePathOption {
    constructor() {
        this.recursionNumber = maxFileNumber;
        this.checkExt = true;
    }
    static default() {
        const option = new ResolvePathOption();
    }
}
function resolvePaths(paths, options = new ResolvePathOption()) {
    if (paths.length == 0) {
        return [];
    }
    return paths.flatMap(val => {
        var _a;
        const arr = new Array();
        if (!fs.existsSync(val)) {
            return arr;
        }
        const stat = fs.statSync(val);
        if (stat.isFile()) {
            if (options.checkExt) {
                if (isJFile(val) || isAiFile(val)) {
                    arr.push(val);
                }
            }
            else {
                arr.push(val);
            }
        }
        else if (stat.isDirectory()) {
            const subPaths = fs.readdirSync(val).map(fileName => path.resolve(val, fileName));
            const recursionNumber = ((_a = options.recursionNumber) !== null && _a !== void 0 ? _a : maxFileNumber);
            arr.push(...resolvePaths(subPaths.length > recursionNumber ? subPaths.slice(0, recursionNumber) : subPaths));
        }
        return arr;
    });
}
exports.resolvePaths = resolvePaths;
function isJFile(filePath) {
    return path.parse(filePath).ext == ".j" || path.parse(filePath).ext == ".jass";
}
exports.isJFile = isJFile;
function isAiFile(filePath) {
    return path.parse(filePath).ext == ".ai";
}
exports.isAiFile = isAiFile;
function isZincFile(filePath) {
    return path.parse(filePath).ext == ".zn";
}
exports.isZincFile = isZincFile;
function getPathFileName(filePath) {
    return path.parse(filePath).base;
}
exports.getPathFileName = getPathFileName;
function compare(key, key2) {
    const keyParsedPath = path.parse(key);
    const key2ParsedPath = path.parse(key2);
    return keyParsedPath.root == key2ParsedPath.root && keyParsedPath.dir == key2ParsedPath.dir && keyParsedPath.base == key2ParsedPath.base;
}
exports.compare = compare;
