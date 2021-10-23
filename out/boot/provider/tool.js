"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functionKey = exports.Key = void 0;
const tokens_1 = require("../jass/tokens");
class Key {
    constructor() {
        this.keys = [];
        this.takeIndex = 0;
    }
    isSingle() {
        return this.keys.length == 1;
    }
    isEmpty() {
        return this.keys.length == 0;
    }
}
exports.Key = Key;
function functionKey(document, position) {
    const key = new Key();
    const lineText = document.lineAt(position.line);
    const ts = tokens_1.tokens(lineText.text.substring(lineText.firstNonWhitespaceCharacterIndex, position.character));
    let field = 0;
    let activeParameter = 0;
    let inName = false;
    let nameState = 0;
    for (let index = ts.length - 1; index >= 0; index--) {
        const token = ts[index];
        if (!token)
            break;
        if (inName) {
            if (nameState == 0) {
                if (token.isId()) {
                    key.keys.push(token.value);
                    nameState = 1;
                }
                else {
                    break;
                }
            }
            else if (nameState == 1) {
                if (token.isOp() && token.value == ".") {
                    nameState = 0;
                }
                else {
                    break;
                }
            }
        }
        else if (token.isOp() && token.value == ",") {
            if (field == 0) {
                activeParameter++;
            }
        }
        else if (token.isOp() && token.value == ")") {
            field++;
        }
        else if (token.isOp() && token.value == "(") {
            if (field > 0) {
                field--;
            }
            else {
                inName = true;
                key.takeIndex = activeParameter;
            }
        }
    }
    return key;
}
exports.functionKey = functionKey;
