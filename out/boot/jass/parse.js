"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const common_1 = require("../common");
const tool_1 = require("../tool");
const ast_1 = require("./ast");
const tokens_1 = require("./tokens");
class JassOption {
    constructor() {
        this.needParseInitExpr = false;
        this.needParseLocal = false;
        this.strict = false;
        this.needParseNative = false;
    }
    static default() {
        const option = new JassOption();
        return option;
    }
}
function parse(content, options = JassOption.default()) {
    const program = new ast_1.Program();
    const comments = [];
    const matchText = (line) => {
        var _a, _b;
        return (_b = (_a = comments.find((token) => token.line == line - 1)) === null || _a === void 0 ? void 0 : _a.value.replace("//", "")) !== null && _b !== void 0 ? _b : "";
    };
    let inZinc = false;
    let inLibrary = false;
    let inStruct = false;
    let inScopeState = 0;
    let inModule = false;
    let inTextMacro = false;
    let inInterface = false;
    const ts = tokens_1.tokens(content)
        .filter((token) => !token.isBlockComment())
        .filter(token => {
        if (token.isComment() && /\/\/![ \t]+zinc\b/.test(token.value)) {
            inZinc = true;
            return false;
        }
        else if (token.isComment() && /\/\/![ \t]+endzinc\b/.test(token.value)) {
            inZinc = false;
            return false;
        }
        else {
            return !inZinc;
        }
    })
        .filter(token => {
        if (token.isComment() && /\/\/![ \t]+textmacro\b/.test(token.value)) {
            inTextMacro = true;
            return false;
        }
        else if (token.isComment() && /\/\/![ \t]+endtextmacro\b/.test(token.value)) {
            inTextMacro = false;
            return false;
        }
        else {
            return !inTextMacro;
        }
    })
        .filter((token) => {
        if (token.value == "library" || token.value == "library_once") {
            inLibrary = true;
        }
        else if (token.value == "endlibrary") {
            inLibrary = false;
        }
        else if (token.value == "struct") {
            inStruct = true;
        }
        else if (token.value == "endstruct") {
            inStruct = false;
        }
        else if (token.value == "scope") {
            inScopeState++;
        }
        else if (token.value == "endscope") {
            if (inScopeState > 0) {
                inScopeState--;
            }
        }
        else if (token.value == "module") {
            inModule = true;
        }
        else if (token.value == "endmodule") {
            inModule = false;
        }
        else if (token.value == "interface") {
            inInterface = true;
        }
        else if (token.value == "endinterface") {
            inInterface = false;
        }
        return !(inLibrary || inStruct || inModule || inInterface || inScopeState > 0);
    })
        .filter((token) => {
        if (token.isComment()) {
            comments.push(token);
            return false;
        }
        return true;
    });
    if (options.strict) {
        program.errors.push(...ts.filter(token => token.isError()).map((token) => {
            const err = new ast_1.JassError(`Unexpected token '${token.value}'`);
            err.loc.start = new common_1.Position(token.line, token.position);
            err.loc.end = new common_1.Position(token.line, token.end);
            return err;
        }));
    }
    let expr = null;
    let inFunc = false;
    let inFuncStart = false;
    let funcState = 0;
    let inNative = false;
    let nativeState = 0;
    let inGlobals = false;
    let global = null;
    let globalState = 0;
    let isConstant = false;
    let take = null;
    let isSingleTake = false;
    let local = null;
    let inLocal = false;
    let localState = 0;
    const resetTakes = () => {
        take = null;
        isSingleTake = false;
    };
    const resetNative = () => {
        resetTakes();
        expr = null;
        nativeState = 0;
        inNative = false;
    };
    const resetFunc = () => {
        resetTakes();
        expr = null;
        funcState = 0;
        inFunc = false;
        inFuncStart = false;
    };
    const resetLocal = () => {
        inLocal = false;
        localState = 0;
        local = null;
    };
    const resetGlobal = () => {
        globalState = 0;
        isConstant = false;
        global = null;
    };
    let isStart = true;
    for (let index = 0; index < ts.length; index++) {
        const token = ts[index];
        const nextToken = ts[index + 1];
        const pushError = (message) => {
            const err = new ast_1.JassError(message);
            err.loc.start = new common_1.Position(token.line, token.position);
            err.loc.end = new common_1.Position(token.line, token.end);
            program.errors.push(err);
        };
        if (options.needParseNative && token.isId() && token.value == "native") {
            resetNative();
            resetGlobal();
            inNative = true;
            expr = new ast_1.Native("");
            expr.text = matchText(token.line);
            expr.loc.start = new common_1.Position(token.line, token.position);
            program.natives.push(expr);
            nativeState = 1;
        }
        else if (isStart && token.isId() && token.value == "function") {
            resetFunc();
            resetGlobal();
            inFunc = true;
            expr = new ast_1.Func("");
            expr.text = matchText(token.line);
            expr.loc.start = new common_1.Position(token.line, token.position);
            expr.loc.end = new common_1.Position(token.line + 1, 0);
            program.functions.push(expr);
            funcState = 1;
        }
        else if (token.isId() && token.value == "endfunction") {
            if (inFunc) {
                expr.loc.end = new common_1.Position(token.line, token.end);
                resetFunc();
            }
            else {
                pushError("Redundant endfunction");
            }
        }
        else if (inNative) {
            if (token.isNewLine()) {
                expr.loc.end = new common_1.Position(token.line, token.end);
                resetNative();
            }
            else if (token.isId() && token.value == "returns") {
                nativeState = 7;
            }
            else if (token.isId() && token.value == "takes") {
                resetTakes();
                nativeState = 3;
            }
            else if (nativeState == 1) {
                if (token.isId() && expr.name == "") {
                    expr.name = token.value;
                    nativeState = 2;
                }
                else {
                    pushError("Function name error");
                }
            }
            else if (nativeState == 2) {
                pushError("The expected token is takes");
            }
            else if (nativeState == 3) {
                if (token.isId() && token.value == "nothing") {
                    if (isSingleTake) {
                        pushError("Nothing is not a type that should be used in the argument declaration");
                        nativeState = 5;
                    }
                    else {
                        nativeState = 6;
                    }
                }
                else if (token.isId()) {
                    take = new ast_1.Take(token.value, "");
                    nativeState = 4;
                }
                else if (token.isOp() && token.value == ",") {
                    isSingleTake = true;
                    pushError("Nonholonomic parameter");
                }
                else {
                    pushError("Incorrect parameter type");
                }
            }
            else if (nativeState == 4) {
                if (token.isId()) {
                    take.name = token.value;
                    expr.takes.push(take);
                }
                else if (token.isOp() && token.value == ",") {
                    isSingleTake = true;
                    nativeState = 3;
                    pushError("Nonholonomic parameter");
                }
                else {
                    pushError("Incorrect parameter name");
                }
                nativeState = 5;
            }
            else if (nativeState == 5) {
                if (token.isOp() && token.value == ",") {
                    isSingleTake = true;
                    nativeState = 3;
                }
                else {
                    pushError("The expected token is returns");
                }
            }
            else if (nativeState == 6) {
                pushError("The current function has no arguments");
            }
            else if (nativeState == 7) {
                if (token.isId()) {
                    if (token.value != "nothing") {
                        expr.returns = token.value;
                    }
                    nativeState = 8;
                }
                else {
                    pushError("Return type error");
                }
            }
            else if (nativeState == 8) {
                pushError("unnecessary");
            }
        }
        else if (inFunc) {
            if (inFuncStart == false && token.isNewLine()) {
                if (funcState != 8) {
                    pushError("Incomplete function error");
                }
                inFuncStart = true;
                expr.loc.end = new common_1.Position(token.line, token.end);
            }
            else if (inFuncStart) {
                if (token.isNewLine()) {
                    resetLocal();
                }
                else if (options.needParseLocal && token.isId() && token.value == "local") {
                    resetLocal();
                    inLocal = true;
                    localState = 1;
                    local = new ast_1.Local("", "");
                    local.text = matchText(token.line);
                    if (!nextToken || nextToken.isNewLine()) {
                        pushError("Incomplete local error");
                    }
                }
                else if (inLocal) {
                    if (localState == 1) {
                        if (token.isId()) {
                            local.type = token.value;
                            local.loc.start = new common_1.Position(token.line, token.position);
                            localState = 2;
                        }
                        else {
                            pushError("Incorrect local type");
                        }
                        if (!nextToken || nextToken.isNewLine()) {
                            pushError("Incomplete local error");
                        }
                    }
                    else if (localState == 2) {
                        if (token.isId() && token.value == "array") {
                            if (local.isArray) {
                                pushError("Repetitively declared array");
                            }
                            else {
                                local.isArray = true;
                            }
                        }
                        else if (token.isId()) {
                            local.name = token.value;
                            expr.locals.push(local);
                            local.loc.end = new common_1.Position(token.line, token.end);
                            if (local.isArray) {
                                localState = 6;
                            }
                            else {
                                if (options.needParseInitExpr) {
                                    localState = 3;
                                }
                                else {
                                    localState = 5;
                                }
                            }
                        }
                        else {
                            if (local.isArray) {
                                pushError("Incorrect local name");
                            }
                            else {
                                pushError("Incorrect local name or Incorrect declared array");
                            }
                        }
                        if (!nextToken || nextToken.isNewLine()) {
                            pushError("Incomplete local error");
                        }
                    }
                    else if (localState == 3) {
                        if (token.isOp() && token.value == "=") {
                            localState = 4;
                            if (!nextToken || nextToken.isNewLine()) {
                                pushError("You need at least one value");
                            }
                        }
                        else {
                            pushError("Incorrect initialization symbol");
                        }
                    }
                    else if (localState == 4) {
                        local.initTokens.push(token);
                    }
                    else if (localState == 5) {
                    }
                    else if (localState == 6) {
                        if (token.isOp() && token.value == "=") {
                            pushError("The Jass language does not support array initialization");
                        }
                        else {
                            pushError("Error token, if you want to initialize an array I think you should give it up");
                        }
                    }
                }
                expr.tokens.push(token);
            }
            else if (token.isId() && token.value == "returns") {
                funcState = 7;
            }
            else if (token.isId() && token.value == "takes") {
                resetTakes();
                funcState = 3;
            }
            else if (funcState == 1) {
                if (token.isId() && expr.name == "") {
                    expr.name = token.value;
                    expr.nameToken = token;
                    funcState = 2;
                }
                else {
                    pushError("Function name error");
                }
            }
            else if (funcState == 2) {
                pushError("The expected token is takes");
            }
            else if (funcState == 3) {
                if (token.isId() && token.value == "nothing") {
                    if (isSingleTake) {
                        pushError("Nothing is not a type that should be used in the argument declaration");
                        funcState = 5;
                    }
                    else {
                        funcState = 6;
                    }
                }
                else if (token.isId()) {
                    take = new ast_1.Take(token.value, "");
                    funcState = 4;
                }
                else if (token.isOp() && token.value == ",") {
                    isSingleTake = true;
                    pushError("Nonholonomic parameter");
                }
                else {
                    pushError("Incorrect parameter type");
                }
            }
            else if (funcState == 4) {
                if (token.isId()) {
                    take.name = token.value;
                    take.nameToken = token;
                    expr.takes.push(take);
                }
                else if (token.isOp() && token.value == ",") {
                    isSingleTake = true;
                    funcState = 3;
                    pushError("Nonholonomic parameter");
                }
                else {
                    pushError("Incorrect parameter name");
                }
                funcState = 5;
            }
            else if (funcState == 5) {
                if (token.isOp() && token.value == ",") {
                    isSingleTake = true;
                    funcState = 3;
                }
                else {
                    pushError("The expected token is returns");
                }
            }
            else if (funcState == 6) {
                pushError("The current function has no arguments");
            }
            else if (funcState == 7) {
                if (token.isId()) {
                    if (token.value != "nothing") {
                        expr.returns = token.value;
                    }
                    funcState = 8;
                }
                else {
                    pushError("Return type error");
                }
            }
            else if (funcState == 8) {
                pushError("unnecessary");
            }
            if (token.isError()) {
                pushError(`Unexpected token '${token.value}'`);
            }
        }
        else if (token.isId() && token.value == "globals") {
            if (inGlobals) {
                pushError("The endglobals token is missing");
            }
            else {
                inGlobals = true;
            }
            resetGlobal();
        }
        else if (token.isId() && token.value == "endglobals") {
            if (inGlobals) {
                inGlobals = false;
                resetGlobal();
            }
            else {
                pushError("Redundant endglobals");
            }
        }
        else if (inGlobals) {
            if (token.isId() && token.value == "endglobals") {
                inGlobals = false;
            }
            else if (token.isNewLine()) {
                resetGlobal();
            }
            else if (globalState == 0) {
                if (token.isId() && token.value == "constant") {
                    if (isConstant) {
                        pushError("Repetitively declared constant");
                    }
                    isConstant = true;
                    if (!nextToken || nextToken.isNewLine()) {
                        pushError("Incomplete globals constant error");
                    }
                }
                else if (token.isId()) {
                    global = new ast_1.Global(token.value, "");
                    global.text = matchText(token.line);
                    global.loc.start = new common_1.Position(token.line, token.position);
                    global.isConstant = isConstant;
                    globalState = 1;
                    if (!nextToken || nextToken.isNewLine()) {
                        if (isConstant) {
                            pushError("Incomplete globals constant error");
                        }
                        else {
                            pushError("Incomplete globals variable error");
                        }
                    }
                }
                else {
                    pushError("Error global member token");
                }
            }
            else if (globalState == 1) {
                if (token.isId() && token.value == "array") {
                    if (global.isConstant) {
                        pushError("Constant arrays are not supported");
                    }
                    if (global.isArray) {
                        pushError("Repetitively declared array");
                    }
                    global.isArray = true;
                }
                else if (token.isId()) {
                    global.name = token.value;
                    global.nameToken = token;
                    program.globals.push(global);
                    global.loc.end = new common_1.Position(token.line, token.end);
                    globalState = 2;
                }
                else {
                    pushError("Incorrect global member name");
                }
            }
            else if (globalState == 2) {
                if (token.isOp() && token.value == "=") {
                    if (global.isArray) {
                        pushError("The Jass language does not support array initialization");
                    }
                }
                else {
                    if (global.isConstant) {
                        pushError("Constants must be initialized");
                    }
                }
                globalState = 3;
            }
            else if (globalState == 3) {
            }
            if (token.isError()) {
                pushError(`Unexpected token '${token.value}'`);
            }
            if (isConstant && token.isId() && token.value == "constant") {
                isConstant = false;
            }
        }
        else if (token.isNewLine()) {
            isStart = true;
        }
        if (isStart && !token.isNewLine()) {
            isStart = false;
        }
    }
    return program;
}
exports.parse = parse;
class CommentTree {
    constructor() {
        this.lineComments = [];
        this.blockComments = [];
    }
}
function parseComment(content) {
    const commentMap = new CommentTree();
    return commentMap;
}
function similar(left, right) {
    if (left.length != right.length && (left.length == 0 || right.length == 0)) {
        return 0.0;
    }
    if (left.length == right.length) {
        if (left == right) {
            return 1.0;
        }
    }
    let similarity = 0.0;
    const leftMap = new Map();
    for (let index = 0; index < left.length; index++) {
        const char = left[index];
        if (leftMap.has(char)) {
            const count = leftMap.get(char);
            leftMap.set(char, count + 1);
        }
        else {
            leftMap.set(char, 1);
        }
    }
    const rightMap = new Map();
    for (let index = 0; index < right.length; index++) {
        const char = left[index];
        if (rightMap.has(char)) {
            const count = rightMap.get(char);
            rightMap.set(char, count + 1);
        }
        else {
            rightMap.set(char, 1);
        }
    }
    const keySet = new Set([...leftMap.keys(), ...rightMap.keys()]);
    let count = 0;
    keySet.forEach((key) => {
        if (leftMap.has(key) && rightMap.has(key)) {
            count += Math.min(leftMap.get(key), rightMap.get(key));
        }
    });
    similarity = count / Math.ceil((left.length + right.length) / 2);
    return similarity;
}
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
function preparese(content) {
}
if (false) {
    console.log(similar("aabbaa", "aabbaab"));
    console.log(removeComment(`1
	a// a
	a/*
	a
	*/a`, true));
}
