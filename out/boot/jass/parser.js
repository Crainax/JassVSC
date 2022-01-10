"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.lines = exports.replaceBlockComment = void 0;
const common_1 = require("../common");
const tool_1 = require("../tool");
const parse_1 = require("../zinc/parse");
const ast_1 = require("./ast");
const tokens_1 = require("./tokens");
class LineText extends common_1.Range {
    constructor(text) {
        super();
        this.text = text;
    }
    isEmpty() {
        return this.text.trimStart() === "";
    }
    getText() {
        return this.text;
    }
    setText(text) {
        this.text = text;
    }
    lineNumber() {
        return this.start.line;
    }
    firstCharacterIndex() {
        let index = 0;
        for (; index < this.text.length; index++) {
            const char = this.text[index];
            if (!tool_1.isSpace(char)) {
                return index;
            }
        }
        return index;
    }
    length() {
        return this.text.length;
    }
    clone() {
        return Object.assign(new LineText(this.getText()), this);
    }
}
function replaceBlockComment(content) {
    let BlockCommentState;
    (function (BlockCommentState) {
        BlockCommentState[BlockCommentState["Default"] = 0] = "Default";
        BlockCommentState[BlockCommentState["Div"] = 1] = "Div";
        BlockCommentState[BlockCommentState["LineComment"] = 2] = "LineComment";
        BlockCommentState[BlockCommentState["BlockComment"] = 3] = "BlockComment";
        BlockCommentState[BlockCommentState["BlockCommentWillBreak"] = 4] = "BlockCommentWillBreak";
        BlockCommentState[BlockCommentState["String"] = 5] = "String";
        BlockCommentState[BlockCommentState["StringEscape"] = 6] = "StringEscape";
    })(BlockCommentState || (BlockCommentState = {}));
    ;
    const BlockCommentResult = class {
        constructor(text, state = BlockCommentState.Default) {
            this.state = state;
            this.text = text;
        }
    };
    const handle = (newText, preState) => {
        const chars = newText.split("");
        let state = preState;
        for (let index = 0; index < chars.length; index++) {
            const char = chars[index];
            if (state == BlockCommentState.Default) {
                if (char == "/") {
                    state = BlockCommentState.Div;
                }
                else if (char == "\"") {
                    state = BlockCommentState.String;
                }
            }
            else if (state == BlockCommentState.Div) {
                if (char == "/") {
                    state = BlockCommentState.LineComment;
                }
                else if (char == "*") {
                    state = BlockCommentState.BlockComment;
                    chars[index] = " ";
                    chars[index - 1] = " ";
                }
                else {
                    state = BlockCommentState.Default;
                }
            }
            else if (state == BlockCommentState.LineComment) {
                if (tool_1.isNewLine(char)) {
                    state = BlockCommentState.Default;
                }
            }
            else if (state == BlockCommentState.BlockComment) {
                if (char == "*") {
                    state = BlockCommentState.BlockCommentWillBreak;
                }
                if (tool_1.isNewLine(char)) {
                    chars[index] = "\n";
                }
                else {
                    chars[index] = " ";
                }
            }
            else if (state == BlockCommentState.BlockCommentWillBreak) {
                if (char == "*") {
                }
                else if (char == "/") {
                    state = BlockCommentState.Default;
                }
                else {
                    state = BlockCommentState.BlockComment;
                }
                if (tool_1.isNewLine(char)) {
                    chars[index] = "\n";
                }
                else {
                    chars[index] = " ";
                }
            }
            else if (state == BlockCommentState.String) {
                if (char == "\"" || tool_1.isNewLine(char)) {
                    state = BlockCommentState.Default;
                }
                else if (char == "\\") {
                    state = BlockCommentState.StringEscape;
                }
            }
            else if (state == BlockCommentState.StringEscape) {
                if (tool_1.isNewLine(char)) {
                    state = BlockCommentState.Default;
                }
                else {
                    state = BlockCommentState.String;
                }
            }
        }
        return new BlockCommentResult(chars.join(""), state);
    };
    let lastState = BlockCommentState.Default;
    let text = "";
    for (let index = 0; index < content.length;) {
        const newLineIndex = content.indexOf("\n", index);
        const fieldText = content.substring(index, newLineIndex == -1 ? content.length : newLineIndex + 1);
        const result = handle(fieldText, lastState);
        text += result.text;
        lastState = result.state;
        if (newLineIndex == -1) {
            break;
        }
        else {
            index = newLineIndex + 1;
        }
    }
    return text;
}
exports.replaceBlockComment = replaceBlockComment;
function linesByIndexOf(content) {
    const LineTexts = [];
    for (let index = 0; index < content.length;) {
        const newLineIndex = content.indexOf("\n", index);
        const fieldText = content.substring(index, newLineIndex == -1 ? content.length : newLineIndex + 1);
        LineTexts.push(new LineText(fieldText));
        if (newLineIndex == -1) {
            break;
        }
        else {
            index = newLineIndex + 1;
        }
    }
    return LineTexts;
}
function linesBySplit(content) {
    const ls = content.split("\n");
    const last = ls.pop();
    const lineTexts = ls.map(x => new LineText(x + "\n"));
    if (last) {
        lineTexts.push(new LineText(last));
    }
    return lineTexts;
}
function lines(content) {
    return linesByIndexOf(content).map((lineText, index) => {
        lineText.start = new common_1.Position(index, 0);
        lineText.end = new common_1.Position(index, lineText.getText().length);
        return lineText;
    });
}
exports.lines = lines;
function zincLines(content) {
    let inZinc = false;
    return lines(content).filter(lineText => {
        if (/^\s*\/\/!\s+zinc\b/.test(lineText.getText())) {
            inZinc = true;
            return false;
        }
        else if (/^\s*\/\/!\s+endzinc\b/.test(lineText.getText())) {
            inZinc = false;
            return false;
        }
        else {
            return inZinc;
        }
    });
}
class TextMacro extends common_1.Range {
    constructor(name = "", takes = []) {
        super();
        this.lineTexts = [];
        this.name = name;
        this.takes = takes;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    push(lineText) {
        this.lineTexts.push(lineText);
    }
    remove(lineNumber) {
        for (let index = 0; index < this.lineTexts.length; index++) {
            const lineText = this.lineTexts[index];
            if (lineText.lineNumber() == lineNumber) {
                this.lineTexts.splice(index, 1);
                break;
            }
        }
    }
    foreach(callback, params = []) {
        this.lineTexts.map((lineText) => {
            const replacedLineText = lineText.clone();
            let newText = lineText.getText();
            this.takes.forEach((take, takeIndex) => {
                var _a;
                newText = newText.replace(new RegExp(`\\$${take}\\$`, "g"), (_a = params[takeIndex]) !== null && _a !== void 0 ? _a : "");
            });
            replacedLineText.setText(newText);
            callback(replacedLineText);
        });
    }
    addTake(take) {
        this.takes.push(take);
    }
}
class RunTextMacro extends common_1.Range {
    constructor(name = "", params = [], lineText = null) {
        super();
        this.name = name;
        this.params = params;
        this.lineText = lineText;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    addParam(param) {
        this.params.push(param);
    }
    getParams() {
        return this.params.map(param => param.replace(/^"/, "").replace(/"$/, ""));
    }
    getLineText() {
        return this.lineText;
    }
}
class Block extends common_1.Range {
    constructor(type) {
        super();
        this.parent = null;
        this.childrens = [];
        this.type = type;
    }
}
function parseTextMacro(text, textMacro) {
    text = text.replace(/\/\/!/, "   ");
    const tokens = tokens_1.tokenize(text);
    if (tokens[0].isId() && tokens[0].value == "textmacro") {
        if (tokens[1].isId()) {
            textMacro.setName(tokens[1].value);
            if (tokens[2].isId() && tokens[2].value == "takes") {
                let state = 0;
                for (let index = 3; index < tokens.length; index++) {
                    const token = tokens[index];
                    if (state == 0) {
                        if (token.isId()) {
                            textMacro.addTake(token.value);
                            state = 1;
                        }
                        else
                            break;
                    }
                    else if (state == 1) {
                        if (token.isOp() && token.value == ",") {
                            state = 0;
                        }
                        else
                            break;
                    }
                }
            }
        }
    }
}
function parseRunTextMacro(text, runTextMacro) {
    text = text.replace(/\/\/!/, "   ");
    const tokens = tokens_1.tokenize(text);
    if (tokens[0].isId() && tokens[0].value == "runtextmacro") {
        if (tokens[1].isId()) {
            runTextMacro.setName(tokens[1].value);
            if (tokens[2].isOp() && tokens[2].value == "(") {
                let state = 0;
                for (let index = 3; index < tokens.length; index++) {
                    const token = tokens[index];
                    if (state == 0) {
                        if (token.isOp() && token.value == ")") {
                            break;
                        }
                        else if (token.isString()) {
                            runTextMacro.addParam(token.value);
                            state = 1;
                        }
                    }
                    else if (state == 1) {
                        if (token.isOp() && token.value == ")") {
                            break;
                        }
                        else if (token.isOp() && token.value == ",") {
                            state = 0;
                        }
                    }
                }
            }
        }
    }
}
function parseFunction(lineText, func) {
    const tokens = tokens_1.tokenize(lineText.getText()).map((token) => {
        token.line = lineText.lineNumber();
        return token;
    });
    let keyword = "function";
    if (func instanceof ast_1.Method) {
        keyword = "method";
    }
    else if (func instanceof ast_1.Func) {
        keyword = "function";
    }
    else if (func instanceof ast_1.Native) {
        keyword = "native";
    }
    const functionIndex = tokens.findIndex((token) => token.isId() && token.value == keyword);
    const takesIndex = tokens.findIndex((token) => token.isId() && token.value == "takes");
    const returnsIndex = tokens.findIndex((token) => token.isId() && token.value == "returns");
    if (functionIndex != -1) {
        if (tokens[functionIndex + 1] && tokens[functionIndex + 1].isId()) {
            func.name = tokens[functionIndex + 1].value;
            func.nameToken = tokens[functionIndex + 1];
        }
    }
    if (returnsIndex != -1) {
        if (tokens[returnsIndex + 1] && tokens[returnsIndex + 1].isId()) {
            func.returns = tokens[returnsIndex + 1].value;
        }
    }
    if (takesIndex != -1) {
        const takesTokens = tokens.slice(takesIndex + 1);
        let state = 0;
        let take = null;
        for (let index = 0; index < takesTokens.length; index++) {
            const token = takesTokens[index];
            if (state == 0) {
                if (token.isId() && token.value == "returns") {
                    break;
                }
                else if (token.isId()) {
                    if (token.value == "nothing") {
                        break;
                    }
                    take = new ast_1.Take(token.value, "");
                    take.type = token.value;
                    take.loc.start = new common_1.Position(token.line, token.position);
                    func.takes.push(take);
                    state = 1;
                }
            }
            else if (state == 1) {
                if (token.isId() && token.value == "returns") {
                    break;
                }
                else if (token.isId()) {
                    if (take) {
                        take.name = token.value;
                        take.loc.end = new common_1.Position(token.line, token.end);
                        take.nameToken = token;
                        state = 2;
                    }
                }
                else if (token.isOp() && token.value == ",") {
                    state = 0;
                }
            }
            else if (state == 2) {
                if (token.isOp() && token.value == ",") {
                    state = 0;
                }
                else if (token.isId() && token.value == "returns") {
                    break;
                }
            }
        }
    }
    if (functionIndex != -1) {
        const modTokens = tokens.slice(0, functionIndex);
        if (func instanceof ast_1.Native) {
            modTokens.forEach((token) => {
                if (token.isId() && token.value == "constant") {
                    func.setConstant(true);
                }
            });
        }
        if (func instanceof ast_1.Func) {
            modTokens.forEach((token) => {
                if (token.isId() && token.value == "private") {
                    func.tag = "private";
                }
                else if (token.isId() && token.value == "public") {
                    func.tag = "public";
                }
            });
        }
        if (func instanceof ast_1.Method) {
            modTokens.forEach((token) => {
                if (token.isId() && token.value == "private") {
                    func.tag = "private";
                }
                else if (token.isId() && token.value == "public") {
                    func.tag = "public";
                }
                if (token.isId() && token.value == "static") {
                    func.modifier = "static";
                }
                else if (token.isId() && token.value == "stub") {
                    func.modifier = "stub";
                }
            });
        }
    }
}
function parseLibrary(lineText, library) {
    const tokens = tokens_1.tokenize(lineText.getText()).map((token) => {
        token.line = lineText.lineNumber();
        return token;
    });
    const libraryIndex = tokens.findIndex((token) => token.isId() && (token.value == "library" || token.value == "library_once"));
    if (libraryIndex != -1) {
        library.name = tokens[libraryIndex + 1].value;
        library.loc.start = new common_1.Position(tokens[libraryIndex].line, tokens[libraryIndex].position);
        const initializerIndex = tokens.findIndex((token) => token.isId() && token.value == "initializer");
        if (initializerIndex != -1) {
            if (tokens[initializerIndex + 1] && tokens[initializerIndex + 1].isId()) {
                library.initializer = tokens[initializerIndex + 1].value;
            }
        }
        const requireIndex = tokens.findIndex((token) => token.isId() && (token.value == "requires" || token.value == "needs" || token.value == "uses"));
        if (requireIndex != -1) {
            let requireTokens = tokens.slice(requireIndex + 1);
            if (requireTokens[0] && requireTokens[0].isId() && requireTokens[0].value == "optional") {
                requireTokens = requireTokens.slice(1);
            }
            let state = 0;
            requireTokens.forEach((token) => {
                if (state == 0) {
                    if (token.isId() && token.value == "optional") {
                    }
                    else if (token.isId()) {
                        library.requires.push(token.value);
                        state = 1;
                    }
                }
                else if (state == 1) {
                    if (token.isOp() && token.value == ",") {
                        state = 0;
                    }
                }
            });
        }
    }
}
function parseLineComment(lineText, lineComment) {
    const tokens = tokens_1.tokenize(lineText.getText()).map((token) => {
        token.line = lineText.lineNumber();
        return token;
    });
    const lineCommentToken = tokens.find((token) => token.isComment());
    if (lineCommentToken) {
        lineComment.setText(lineText.getText());
        lineComment.loc.start = new common_1.Position(lineText.lineNumber(), lineCommentToken.position);
        lineComment.loc.end = new common_1.Position(lineText.lineNumber(), lineCommentToken.end);
    }
}
function parseGlobal(lineText, global) {
    let tokens = tokens_1.tokenize(lineText.getText()).map((token) => {
        token.line = lineText.lineNumber();
        return token;
    });
    if (tokens[0]) {
        if (tokens[0].isId() && tokens[0].value == "private") {
            global.tag = "private";
            tokens = tokens.slice(1);
        }
        else if (tokens[0].isId() && tokens[0].value == "public") {
            global.tag = "public";
            tokens = tokens.slice(1);
        }
    }
    global.loc.setRange(lineText);
    if (tokens[0]) {
        if (tokens[0].isId() && tokens[0].value == "constant") {
            global.isConstant = true;
            tokens = tokens.slice(1);
        }
        if (tokens[0] && tokens[0].isId()) {
            global.type = tokens[0].value;
        }
        if (tokens[1] && tokens[1].isId()) {
            if (tokens[1].value == "array") {
                global.isArray = true;
                if (tokens[2] && tokens[2].isId()) {
                    global.name = tokens[2].value;
                    global.nameToken = tokens[2];
                }
            }
            else {
                global.name = tokens[1].value;
                global.nameToken = tokens[1];
            }
        }
    }
}
function parseStruct(lineText, struct) {
    let tokens = tokens_1.tokenize(lineText.getText()).map((token) => {
        token.line = lineText.lineNumber();
        return token;
    });
    const structIndex = tokens.findIndex((token) => token.isId() && token.value == "struct");
    if (structIndex != -1 && tokens[structIndex + 1] && tokens[structIndex + 1].isId()) {
        struct.name = tokens[structIndex + 1].value;
    }
    const extendsIndex = tokens.findIndex((token) => token.isId() && token.value == "extends");
    if (extendsIndex != -1) {
        const extendsTokens = tokens.slice(extendsIndex + 1);
        let state = 0;
        extendsTokens.forEach((token) => {
            if (state == 0) {
                if (token.isId()) {
                    struct.extends.push(token.value);
                    state = 1;
                }
            }
            else if (state == 1) {
                if (token.isOp() && token.value == ",") {
                    state = 0;
                }
            }
        });
    }
}
function parseLocal(lineText, local) {
    let tokens = tokens_1.tokenize(lineText.getText()).map((token) => {
        token.line = lineText.lineNumber();
        return token;
    });
    const localIndex = tokens.findIndex((token) => token.isId() && token.value == "local");
    local.loc.setRange(lineText);
    if (localIndex != -1) {
        local.loc.start = new common_1.Position(lineText.lineNumber(), tokens[localIndex].position);
        if (tokens[localIndex + 1] && tokens[localIndex + 1].isId()) {
            local.type = tokens[localIndex + 1].value;
        }
        if (tokens[localIndex + 2] && tokens[localIndex + 2].isId()) {
            if (tokens[localIndex + 2].value == "array") {
                local.isArray = true;
                if (tokens[localIndex + 3] && tokens[localIndex + 3].isId()) {
                    local.name = tokens[localIndex + 3].value;
                    local.nameToken = tokens[localIndex + 3];
                }
            }
            else {
                local.name = tokens[localIndex + 2].value;
                local.nameToken = tokens[localIndex + 2];
            }
        }
    }
}
function parseMember(lineText, member) {
    let tokens = tokens_1.tokenize(lineText.getText()).map((token) => {
        token.line = lineText.lineNumber();
        return token;
    });
    member.loc.setRange(lineText);
    if (tokens[0]) {
        if (tokens[0].isId() && tokens[0].value == "private") {
            member.tag = "private";
            tokens = tokens.slice(1);
        }
        else if (tokens[0].isId() && tokens[0].value == "public") {
            member.tag = "public";
            tokens = tokens.slice(1);
        }
    }
    if (tokens[0]) {
        if (tokens[0].isId() && tokens[0].value == "static") {
            member.modifier = "static";
            tokens = tokens.slice(1);
        }
        else if (tokens[0].isId() && tokens[0].value == "stub") {
            member.modifier = "stub";
            tokens = tokens.slice(1);
        }
    }
    if (tokens[0] && tokens[0].isId()) {
        member.type = tokens[0].value;
    }
    if (tokens[1] && tokens[1].isId()) {
        if (tokens[1].value == "array") {
            member.isArray = true;
            if (tokens[2] && tokens[2].isId()) {
                member.name = tokens[2].value;
                member.nameToken = tokens[2];
            }
        }
        else {
            member.name = tokens[1].value;
            member.nameToken = tokens[1];
        }
    }
    const localIndex = tokens.findIndex((token) => token.isId() && token.value == "local");
    if (localIndex != -1) {
        member.loc.start = new common_1.Position(lineText.lineNumber(), tokens[localIndex].position);
        if (tokens[localIndex + 1] && tokens[localIndex + 1].isId()) {
            member.type = tokens[localIndex + 1].value;
        }
        if (tokens[localIndex + 2] && tokens[localIndex + 2].isId()) {
            if (tokens[localIndex + 2].value == "array") {
                member.isArray = true;
                if (tokens[localIndex + 3] && tokens[localIndex + 3].isId()) {
                    member.name = tokens[localIndex + 3].value;
                    member.nameToken = tokens[localIndex + 3];
                }
            }
            else {
                member.name = tokens[localIndex + 2].value;
                member.nameToken = tokens[localIndex + 2];
            }
        }
    }
}
class Parser {
    constructor(content) {
        this.lineTexts = [];
        this.textMacros = [];
        this.expandLineTexts = [];
        this.zincBlocks = [];
        this.blocks = [];
        const newContent = replaceBlockComment(content);
        this.lineTexts = lines(newContent);
        this.textMacros = this.findTextMacro();
        this.parseRunTextMacro();
        this.zincBlocks = this.findZincBlock();
        this.blocks = this.findOutline();
    }
    findTextMacro() {
        const textMacros = [];
        let textMacro = null;
        this.lineTexts = this.lineTexts.filter((lineText) => {
            if (/^\s*\/\/!\s+textmacro\b/.test(lineText.getText())) {
                textMacro = new TextMacro();
                textMacro.setRange(lineText);
                parseTextMacro(lineText.getText(), textMacro);
                textMacros.push(textMacro);
                return false;
            }
            else if (/\/\/!\s+endtextmacro\b/.test(lineText.getText())) {
                if (textMacro) {
                    textMacro.end = lineText.end;
                }
                textMacro = null;
                return false;
            }
            else if (textMacro) {
                textMacro.push(lineText);
                textMacro.end = lineText.end;
                return false;
            }
            return true;
        });
        return textMacros;
    }
    parseRunTextMacro() {
        this.lineTexts.forEach(lineText => {
            if (/^\s*\/\/!\s+runtextmacro\b/.test(lineText.getText())) {
                const runTextMacro = new RunTextMacro();
                parseRunTextMacro(lineText.getText(), runTextMacro);
                runTextMacro.setRange(lineText);
                this.expandLineTexts.push(runTextMacro);
            }
            else {
                this.expandLineTexts.push(lineText);
            }
        });
    }
    findZincBlock() {
        const zincBlocks = [];
        let zinc = null;
        this.expandLineTexts = this.expandLineTexts.filter(x => {
            if (x instanceof LineText) {
                if (/^\s*\/\/!\s+zinc\b/.test(x.getText())) {
                    zinc = new Block("zinc");
                    zincBlocks.push(zinc);
                    return false;
                }
                else if (/^\s*\/\/!\s+endzinc\b/.test(x.getText())) {
                    zinc = null;
                    return false;
                }
                else if (zinc) {
                    zinc.childrens.push(x);
                    return false;
                }
                else {
                    return true;
                }
            }
            else if (x instanceof RunTextMacro) {
                const textMacro = this.textMacros.find((textMacro) => textMacro.getName() == x.getName());
                textMacro === null || textMacro === void 0 ? void 0 : textMacro.foreach((lineText) => {
                    if (/^\s*\/\/!\s+zinc\b/.test(lineText.getText())) {
                        zinc = new Block("zinc");
                        zincBlocks.push(zinc);
                    }
                    else if (/^\s*\/\/!\s+endzinc\b/.test(lineText.getText())) {
                        zinc = null;
                    }
                    else if (zinc) {
                        zinc.childrens.push(lineText);
                    }
                }, x.getParams());
                return true;
            }
        });
        return zincBlocks;
    }
    findOutline() {
        const blocks = [];
        let block = null;
        function handle(lineText) {
            if (/^\s*globals\b/.test(lineText.getText())) {
                const b = new Block("globals");
                b.setRange(lineText);
                if (block) {
                    b.parent = block;
                    block.childrens.push(b);
                    block = b;
                }
                else {
                    blocks.push(b);
                    block = b;
                }
            }
            else if (/^\s*endglobals\b/.test(lineText.getText())) {
                if (block && block.type == "globals") {
                    block.end = lineText.end;
                    if (block.parent) {
                        block = block.parent;
                    }
                    else {
                        block = null;
                    }
                }
            }
            else if (/^\s*(?:(?:private|public|static|stub)\s+)*function\b/.test(lineText.getText())) {
                const b = new Block("function");
                b.setRange(lineText);
                b.childrens.push(lineText);
                if (block) {
                    b.parent = block;
                    block.childrens.push(b);
                    block = b;
                }
                else {
                    blocks.push(b);
                    block = b;
                }
            }
            else if (/^\s*endfunction\b/.test(lineText.getText())) {
                if (block && block.type == "function") {
                    block.end = lineText.end;
                    if (block.parent) {
                        block = block.parent;
                    }
                    else {
                        block = null;
                    }
                }
            }
            else if (/^\s*(?:(?:private|public|static|stub)\s+)*method\b/.test(lineText.getText())) {
                const b = new Block("method");
                b.setRange(lineText);
                b.childrens.push(lineText);
                if (block) {
                    b.parent = block;
                    block.childrens.push(b);
                    block = b;
                }
                else {
                    blocks.push(b);
                    block = b;
                }
            }
            else if (/^\s*endmethod\b/.test(lineText.getText())) {
                if (block && block.type == "method") {
                    block.end = lineText.end;
                    if (block.parent) {
                        block = block.parent;
                    }
                    else {
                        block = null;
                    }
                }
            }
            else if (/^\s*(?:(?:private|public)\s+)*struct\b/.test(lineText.getText())) {
                const b = new Block("struct");
                b.setRange(lineText);
                b.childrens.push(lineText);
                if (block) {
                    b.parent = block;
                    block.childrens.push(b);
                    block = b;
                }
                else {
                    blocks.push(b);
                    block = b;
                }
            }
            else if (/^\s*endstruct\b/.test(lineText.getText())) {
                if (block && block.type == "struct") {
                    block.end = lineText.end;
                    if (block.parent) {
                        block = block.parent;
                    }
                    else {
                        block = null;
                    }
                }
            }
            else if (/^\s*(?:(?:private|public)\s+)*library\b/.test(lineText.getText())) {
                const b = new Block("library");
                b.setRange(lineText);
                b.childrens.push(lineText);
                if (block) {
                    b.parent = block;
                    block.childrens.push(b);
                    block = b;
                }
                else {
                    blocks.push(b);
                    block = b;
                }
            }
            else if (/^\s*endlibrary\b/.test(lineText.getText())) {
                if (block && block.type == "library") {
                    block.end = lineText.end;
                    if (block.parent) {
                        block = block.parent;
                    }
                    else {
                        block = null;
                    }
                }
            }
            else if (block) {
                block.childrens.push(lineText);
                block.end = lineText.end;
            }
            else {
                blocks.push(lineText);
            }
        }
        this.expandLineTexts.forEach(x => {
            if (x instanceof RunTextMacro) {
                const textMacro = this.textMacros.find((textMacro) => textMacro.getName() == x.getName());
                if (textMacro) {
                    textMacro.foreach((lineText) => {
                        handle(lineText);
                    }, x.getParams());
                }
            }
            else if (x instanceof LineText) {
                handle(x);
            }
        });
        return blocks;
    }
    parsing() {
        const program = new ast_1.Program();
        function isLineCommentStart(lineText) {
            return /^\s*\/\/(?!!)/.test(lineText.getText());
        }
        function isGlobalStart(lineText) {
            const tokens = tokens_1.tokenize(lineText.getText());
            return tokens[0] && tokens[0].isId() && (tokens[0].value == "constant" || (tokens[1] && tokens[1].isId()));
        }
        function isLocalStart(lineText) {
            return /^\s*local\b/.test(lineText.getText());
        }
        function isMemberStart(lineText) {
            return /^\s*(?:(private|public)\s+)*(?:(static|stub)\s+)*\b/.test(lineText.getText());
        }
        function isNativeStart(lineText) {
            return /^\s*(?:(constant)\s+)*native\b/.test(lineText.getText());
        }
        function handleGlobalsBlock(block, globals) {
            const lineComments = [];
            block.childrens.forEach((x) => {
                if (x instanceof LineText) {
                    if (isLineCommentStart(x)) {
                        const lineComment = new ast_1.LineComment();
                        parseLineComment(x, lineComment);
                        lineComments.push(lineComment);
                    }
                    else if (isGlobalStart(x)) {
                        const global = new ast_1.Global();
                        parseGlobal(x, global);
                        global.lineComments.push(...lineComments);
                        globals.push(global);
                        lineComments.length = 0;
                    }
                    else {
                        lineComments.length = 0;
                    }
                }
            });
        }
        function handleNativeBlock(lineText, natives, lineComments) {
            const native = new ast_1.Native();
            native.loc.setRange(lineText);
            parseFunction(lineText, native);
            native.lineComments.push(...lineComments);
            natives.push(native);
        }
        function handleFunctionBlock(block, functions, lineComments) {
            const func = new ast_1.Func();
            func.loc.setRange(block);
            parseFunction(block.childrens[0], func);
            func.lineComments.push(...lineComments);
            functions.push(func);
            const contentBlocks = block.childrens.slice(1);
            handleFunctionBody(contentBlocks, {
                locals: func.locals,
                globals: func.getGlobals()
            });
        }
        function handleMethodsBlock(block, functions, lineComments) {
            const method = new ast_1.Method();
            method.loc.setRange(block);
            parseFunction(block.childrens[0], method);
            method.lineComments.push(...lineComments);
            functions.push(method);
            const contentBlocks = block.childrens.slice(1);
            handleFunctionBody(contentBlocks, {
                locals: method.locals
            });
        }
        function handleFunctionBody(blocks, collect = {
            locals: null,
            globals: null
        }) {
            const lineComments = [];
            blocks.forEach((x) => {
                if (x instanceof LineText) {
                    if (isLineCommentStart(x)) {
                        const lineComment = new ast_1.LineComment();
                        parseLineComment(x, lineComment);
                        lineComments.push(lineComment);
                    }
                    else if (collect.locals && isLocalStart(x)) {
                        const local = new ast_1.Local();
                        parseLocal(x, local);
                        collect.locals.push(local);
                        lineComments.length = 0;
                    }
                    else {
                        lineComments.length = 0;
                    }
                }
                else if (x instanceof Block) {
                    if (collect.globals && x.type == "globals") {
                        handleGlobalsBlock(x, collect.globals);
                    }
                    lineComments.length = 0;
                }
            });
        }
        function handleStructBody(blocks, collect = {
            members: null,
            methods: null
        }) {
            const lineComments = [];
            blocks.forEach((x) => {
                if (x instanceof LineText) {
                    if (isLineCommentStart(x)) {
                        const lineComment = new ast_1.LineComment();
                        parseLineComment(x, lineComment);
                        lineComments.push(lineComment);
                    }
                    else if (collect.members && isMemberStart(x)) {
                        const member = new ast_1.Member();
                        parseMember(x, member);
                        collect.members.push(member);
                        member.lineComments.push(...lineComments);
                        lineComments.length = 0;
                    }
                    else {
                        lineComments.length = 0;
                    }
                }
                else if (x instanceof Block) {
                    if (collect.methods && x.type == "method") {
                        handleMethodsBlock(x, collect.methods, lineComments);
                    }
                    lineComments.length = 0;
                }
            });
        }
        function handleLibraryBlock(block, librarys, lineComments) {
            const library = new ast_1.Library();
            library.loc.setRange(block);
            parseLibrary(block.childrens[0], library);
            library.lineComments.push(...lineComments);
            librarys.push(library);
            const contentBlocks = block.childrens.slice(1);
            handleBlocks(contentBlocks, {
                globals: library.globals,
                functions: library.functions,
                structs: library.structs
            });
        }
        function handleStructBlock(block, structs, lineComments) {
            const struct = new ast_1.Struct();
            struct.loc.setRange(block);
            parseStruct(block.childrens[0], struct);
            struct.lineComments.push(...lineComments);
            structs.push(struct);
            const contentBlocks = block.childrens.slice(1);
            handleStructBody(contentBlocks, {
                members: struct.members,
                methods: struct.methods
            });
        }
        function handleBlocks(blocks, collect = {
            globals: null,
            functions: null,
            librarys: null,
            structs: null,
            natives: null
        }) {
            const lineComments = [];
            blocks.forEach((x) => {
                if (x instanceof LineText) {
                    if (isLineCommentStart(x)) {
                        const lineComment = new ast_1.LineComment();
                        parseLineComment(x, lineComment);
                        lineComments.push(lineComment);
                    }
                    else if (collect.natives && isNativeStart(x)) {
                        handleNativeBlock(x, collect.natives, lineComments);
                        lineComments.length = 0;
                    }
                    else {
                        lineComments.length = 0;
                    }
                }
                else if (x instanceof Block) {
                    if (collect.globals && x.type == "globals") {
                        handleGlobalsBlock(x, collect.globals);
                    }
                    else if (collect.functions && x.type == "function") {
                        handleFunctionBlock(x, collect.functions, lineComments);
                    }
                    else if (collect.librarys && x.type == "library") {
                        handleLibraryBlock(x, collect.librarys, lineComments);
                    }
                    else if (collect.structs && x.type == "struct") {
                        handleStructBlock(x, collect.structs, lineComments);
                    }
                    lineComments.length = 0;
                }
                else {
                    lineComments.length = 0;
                }
            });
        }
        handleBlocks(this.blocks, {
            globals: program.globals,
            functions: program.functions,
            librarys: program.librarys,
            structs: program.structs,
            natives: program.natives
        });
        return program;
    }
    zincing() {
        const tokens = [];
        this.zincBlocks.forEach((block) => {
            block.childrens.forEach((children) => {
                if (children instanceof LineText) {
                    const lineTextTokens = tokens_1.tokenize(children.getText()).map((token) => {
                        token.line = children.lineNumber();
                        return token;
                    });
                    tokens.push(...lineTextTokens);
                }
            });
        });
        const zincProgram = parse_1.parseZinc(tokens, true);
        return zincProgram;
    }
    foreach(callback) {
        this.expandLineTexts.forEach(x => {
            if (x instanceof RunTextMacro) {
                const textMacro = this.textMacros.find((textMacro) => textMacro.getName() == x.getName());
                if (textMacro) {
                    textMacro.foreach((lineText) => {
                        callback(lineText);
                    }, x.getParams());
                }
            }
            else if (x instanceof LineText) {
                callback(x);
            }
        });
    }
    getTextMacros() {
        return this.textMacros;
    }
    getZincBlocks() {
        return this.zincBlocks;
    }
    getBlocks() {
        return this.blocks;
    }
}
exports.Parser = Parser;
if (false) {
    const text = `a/"\\"
    /*
    123
    */c`;
    console.log(text, "\n\n", replaceBlockComment(text));
    console.log(text.length, replaceBlockComment(text).length);
    console.log("===============================================");
    console.log(linesByIndexOf(`111
    222
    333`));
    console.log("===============================================");
    console.log(linesBySplit(`111
    222
    333`));
    const count = 10000;
    console.time("linesByIndexOf");
    for (let index = 0; index < count; index++) {
        linesByIndexOf(`111
        222
        333`);
    }
    console.timeEnd("linesByIndexOf");
    console.time("linesBySplit");
    for (let index = 0; index < count; index++) {
        linesBySplit(`111
        222
        333`);
    }
    console.timeEnd("linesBySplit");
    console.time("lines");
    for (let index = 0; index < count; index++) {
        lines(`111
        222
        333`);
    }
    console.timeEnd("lines");
    console.log("zinc 内容");
    console.log(zincLines(`aaa
    //! zinc
    bbb
    //! endzinc
    //! zinc
    ccc
    //! endzinc
    ddd`));
    console.log("parse=======================");
    new Parser(`
    //! textmacro a666(name,return_type)
    function $name$ takes nothing returns $return_type$
    endfunction
    //! endtextmacro
    //! runtextmacro a666("test_func_name", "nothing")
    `).foreach((lineText) => {
        console.log(lineText.lineNumber(), lineText.getText());
    });
    new Parser(`
    //! textmacro start_zinc()
    wuyong
    //! zinc
    youyong
    //! endtextmacro

    //! textmacro end_zinc(end)
    $end$
    //! endzinc
    //! endtextmacro

    //! runtextmacro start_zinc()

    zinccontent

    //! runtextmacro end_zinc("canshu")

    `).getZincBlocks().forEach(x => {
        console.log(x);
    });
    const func = new ast_1.Func("");
    const lineText = new LineText("private function func_name takes string , integer anan");
    parseFunction(lineText, func);
    console.log(func);
    const lib = new ast_1.Library("");
    const libLineText = new LineText("library dianjie initializer ifunc requires bbb, ccc, eee");
    parseLibrary(libLineText, lib);
    console.log(lib);
    console.log("=================================================================");
    const blocks = new Parser(`
    struct baoji extends dontbb, a222

        method a666
        endmethod

    endstruct

    library ab
        globals
            integer a
        endglobals
        
    endlibrary

    function b 
    globals
    // jiexi
    // jiexi
    integer a
    endglobals
    endtunction

    `).parsing();
    console.info(blocks.functions[0].getGlobals());
    const zincProgram = new Parser(`

    //! zinc
    library a87878 {

    }
    //! endzinc

    `).zincing();
    console.log(zincProgram.librarys[0].loc);
}
if (true) {
    const textMacro = new TextMacro();
    parseTextMacro(`//! textmacro a takes aaa`, textMacro);
    console.log(textMacro);
}
