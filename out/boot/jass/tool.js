"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeComment = void 0;
const tool_1 = require("../tool");
function removeComment(content, deleteLineComment = false) {
    let state = 0;
    content = content.replace(/\r\n/g, "\n");
    const len = content.length;
    const chars = [];
    for (let index = 0; index < len; index++) {
        const char = content.charAt(index);
        const nextChar = content.charAt(index + 1);
        if (state == 0) {
            if (char == "/") {
                if (nextChar == "/") {
                    state = 1;
                    if (deleteLineComment == false) {
                        chars.push(char);
                    }
                }
                else if (nextChar == "*") {
                    state = 2;
                }
                else {
                    chars.push(char);
                }
            }
            else if (char == "\"") {
                state = 4;
                chars.push(char);
            }
            else {
                chars.push(char);
            }
        }
        else if (state == 1) {
            if (deleteLineComment == false) {
                chars.push(char);
            }
            if (!nextChar || tool_1.isNewLine(nextChar)) {
                state = 0;
            }
        }
        else if (state == 2) {
            if (nextChar == "*") {
                state = 3;
            }
            if (tool_1.isNewLine(char)) {
                chars.push("\n");
            }
        }
        else if (state == 3) {
            if (nextChar == "/") {
                state = 6;
            }
            else {
                state = 2;
            }
        }
        else if (state == 6) {
            state = 0;
        }
        else if (state == 4) {
            if (nextChar == "\"") {
                state = 0;
            }
            else if (nextChar == "\\") {
                state = 5;
            }
            else if (tool_1.isNewLine(nextChar)) {
                state = 0;
            }
            chars.push(char);
        }
        else if (state == 5) {
            if (tool_1.isNewLine(nextChar)) {
                state = 0;
            }
            else {
                state = 4;
            }
            chars.push(char);
        }
    }
    return chars.join("");
}
exports.removeComment = removeComment;
