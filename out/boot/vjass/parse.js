"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const tokens_1 = require("../jass/tokens");
const ast_1 = require("./ast");
const common_1 = require("../common");
const ast_2 = require("../jass/ast");
function parse(content) {
    const comments = [];
    const matchText = (line) => {
        var _a, _b;
        return (_b = (_a = comments.find((token) => token.line == line - 1)) === null || _a === void 0 ? void 0 : _a.value.replace("//", "")) !== null && _b !== void 0 ? _b : "";
    };
    let isInZinc = false;
    let isInLibrary = false;
    let isInStruct = false;
    let scopeFieldState = 0;
    let isInModule = false;
    let isInTextMacro = false;
    let isInInterface = false;
    const ts = tokens_1.tokens(content)
        .filter((token) => !token.isBlockComment())
        .filter(token => {
        if (token.isComment() && /\/\/![ \t]+zinc\b/.test(token.value)) {
            isInZinc = true;
            return false;
        }
        else if (token.isComment() && /\/\/![ \t]+endzinc\b/.test(token.value)) {
            isInZinc = false;
            return false;
        }
        else {
            return !isInZinc;
        }
    })
        .filter((token) => {
        if (token.isComment()) {
            comments.push(token);
            return false;
        }
        return true;
    });
    const program = new ast_1.Program();
    let library = null;
    let libraryState = 0;
    let inLibrary = false;
    let inLibraryStart = false;
    const resetLibrary = () => {
        library = null;
        libraryState = 0;
        inLibrary = false;
        inLibraryStart = false;
    };
    let struct = null;
    let structState = 0;
    let inStruct = false;
    let inStructStart = false;
    const resetStruct = () => {
        struct = null;
        structState = 0;
        inStruct = false;
        inStructStart = false;
    };
    let func = null;
    let funcState = 0;
    let inFunc = false;
    let inFuncStart = false;
    const resetFunc = () => {
        func = null;
        funcState = 0;
        inFunc = false;
        inFuncStart = false;
    };
    let local = null;
    let inLocal = false;
    let localState = 0;
    const resetLocal = () => {
        inLocal = false;
        localState = 0;
        local = null;
    };
    let inGlobals = false;
    let global = null;
    let globalState = 0;
    let isConstant = false;
    const resetGlobals = () => {
        inGlobals = false;
    };
    const resetGlobal = () => {
        globalState = 0;
        global = null;
    };
    let take = null;
    let isSingleTake = false;
    let modifierType = "default";
    const reset = (type) => {
        const resetLibrary = () => {
            library = null;
            libraryState = 0;
        };
        if (type == "library" || type == "library_once") {
            resetLibrary();
        }
    };
    for (let index = 0; index < ts.length; index++) {
        const token = ts[index];
        const parseGlobal = () => {
            if (token.isNewLine()) {
                if (global) {
                    global.loc.end = new common_1.Position(token.line, token.end);
                }
            }
            else if (token.isId() && (token.value == "private" || token.value == "public")) {
                modifierType = token.value;
            }
            else if (token.isId() && token.value == "constant") {
                if (globalState == 0) {
                    isConstant = true;
                }
            }
            else if (globalState == 0) {
                resetGlobal();
                if (token.isId()) {
                    global = new ast_1.Global(token.value, "");
                    global.tag = modifierType;
                    global.isConstant = isConstant;
                    global.text = matchText(token.line);
                    global.loc.start = new common_1.Position(token.line, token.position);
                    globalState = 1;
                }
            }
            else if (globalState == 1) {
                if (token.isId() && token.value == "array") {
                    if (global.isArray) {
                    }
                    else {
                        global.isArray = true;
                    }
                }
                else if (token.isId()) {
                    if (global.name == "") {
                        global.name = token.value;
                        global.nameToken = token;
                        library.globals.push(global);
                    }
                    else {
                    }
                }
                else {
                }
            }
            if (isConstant && !(token.value == "constant")) {
                isConstant = false;
            }
            if (!(token.value == "private" || token.value == "public")) {
                modifierType = "default";
            }
        };
        const parseGlobals = () => {
            if (token.isId() && token.value == "endglobals") {
                inGlobals = false;
            }
            else {
                parseGlobal();
            }
        };
        const parseLocal = (expr) => {
            if (token.isNewLine()) {
                local.loc.end = new common_1.Position(token.line, token.end);
                expr.locals.push(local);
            }
            else if (token.isOp() && token.value == "=") {
            }
            else if (localState == 0) {
                if (token.isId()) {
                    local.type = token.value;
                    localState = 1;
                }
                else {
                }
            }
            else if (localState == 1) {
                if (token.isId() && token.value == "array") {
                    if (local.isArray) {
                    }
                    else {
                        local.isArray = true;
                    }
                }
                else if (token.isId()) {
                    if (local.name == "") {
                        local.name = token.value;
                        local.nameToken = token;
                    }
                    else {
                    }
                }
                else {
                }
            }
        };
        const parseFuncBody = () => {
            if (token.isId() && token.value == "endfunction") {
                func.loc.end = new common_1.Position(token.line, token.position);
                resetFunc();
                return;
            }
            else if (token.isId() && token.value == "local") {
                resetLocal();
                local = new ast_2.Local("", "");
                local.loc.start = new common_1.Position(token.line, token.position);
                local.text = matchText(token.line);
                inLocal = true;
            }
            else if (inLocal) {
                parseLocal(func);
            }
            func.tokens.push(token);
        };
        const parseFunc = () => {
            if (inFuncStart) {
                parseFuncBody();
            }
            else if (token.isNewLine()) {
                func.loc.end = new common_1.Position(token.line, token.position);
                inFuncStart = true;
            }
            else if (token.isId() && token.value == "takes") {
                funcState = 1;
            }
            else if (token.isId() && token.value == "returns") {
                funcState = 4;
            }
            else if (token.isId() && token.value == "defaults") {
                funcState = 5;
            }
            else if (funcState == 0) {
                if (token.isId()) {
                    if (func.name == "") {
                        func.name = token.value;
                        func.nameToken = token;
                    }
                    else {
                    }
                }
                else {
                }
            }
            else if (funcState == 1) {
                if (token.isId()) {
                    take = new ast_2.Take(token.value, "");
                    take.loc.start = new common_1.Position(token.line, token.position);
                    funcState = 2;
                }
                else if (token.isOp() && token.value == ",") {
                }
                else {
                }
            }
            else if (funcState == 2) {
                if (token.isId()) {
                    take.name = token.value;
                    take.nameToken = token;
                    take.loc.end = new common_1.Position(token.line, token.end);
                    func.takes.push(take);
                    funcState = 3;
                }
                else if (token.isOp() && token.value == ",") {
                    funcState = 1;
                }
                else {
                }
            }
            else if (funcState == 3) {
                if (token.isOp() && token.value == ",") {
                    funcState = 1;
                }
                else {
                }
            }
            else if (funcState == 4) {
                if (token.isId()) {
                    if (func.returns) {
                    }
                    else {
                        if (token.value == "nothing") {
                        }
                        else {
                            func.returns = token.value;
                        }
                    }
                }
                else {
                }
            }
            else if (funcState == 5) {
                if (token.isId() || token.isInt() || token.isString() || token.isMark() || token.isReal()) {
                    if (func.defaults) {
                    }
                    else {
                        func.defaults = token.value;
                    }
                }
                else {
                }
            }
        };
        const parseStruct = () => {
        };
        const parseLibraryBody = () => {
            if (token.isId() && token.value == "endlibrary") {
                library.loc.end = new common_1.Position(token.line, token.position);
                resetLibrary();
            }
            else if (token.isId() && token.value == "struct") {
                resetStruct();
                if (inFunc) {
                    resetFunc();
                }
                struct = new ast_1.Struct("");
                struct.text = matchText(token.line);
                struct.loc.start = new common_1.Position(token.line, token.position);
                library.structs.push(struct);
                inStruct = true;
            }
            else if (inFunc) {
                parseFunc();
            }
            else if (token.isId() && token.value == "function") {
                resetFunc();
                if (inStruct) {
                    resetStruct();
                }
                func = new ast_1.Func("");
                func.tag = modifierType;
                func.text = matchText(token.line);
                func.loc.start = new common_1.Position(token.line, token.position);
                library.functions.push(func);
                inFunc = true;
            }
            else if (inStruct) {
            }
            else if (token.isId() && token.value == "globals") {
                inGlobals = true;
            }
            else if (inGlobals) {
                parseGlobals();
            }
            else if (token.isId() && (token.value == "private" || token.value == "public")) {
                modifierType = token.value;
            }
            if (!(token.value == "private" || token.value == "public")) {
                modifierType = "default";
            }
        };
        const parseLibrary = () => {
            if (inLibraryStart) {
                parseLibraryBody();
            }
            else if (token.isNewLine()) {
                inLibraryStart = true;
            }
            else if (token.isId() && token.value == "initializer") {
                libraryState = 1;
            }
            else if (token.isId() && (token.value == "requires" || token.value == "needs" || token.value == "uses")) {
                libraryState = 2;
            }
            else if (libraryState == 0) {
                if (token.isId()) {
                    if (library.name == "") {
                        library.name = token.value;
                    }
                    else {
                    }
                }
                else {
                }
            }
            else if (libraryState == 1) {
                if (token.isId()) {
                    if (library.initializer) {
                    }
                    else {
                        library.initializer = token.value;
                    }
                }
            }
            else if (libraryState == 2) {
                if (token.isId()) {
                    library.requires.push(token.value);
                    libraryState = 3;
                }
                else if (token.isOp() && token.value == ",") {
                }
                else {
                }
            }
            else if (libraryState == 3) {
                if (token.isOp() && token.value == ",") {
                    libraryState = 2;
                }
                else {
                }
            }
        };
        if (token.isId() && (token.value == "library" || token.value == "library_once")) {
            resetLibrary();
            library = new ast_1.Library("");
            library.loc.start = new common_1.Position(token.line, token.position);
            program.librarys.push(library);
            inLibrary = true;
        }
        else if (inLibrary) {
            parseLibrary();
        }
        else if (token.isId() && token.value == "scope") {
        }
        else if (token.isId() && token.value == "struct") {
        }
        else if (token.isId() && token.value == "interface") {
        }
        else if (token.isId() && token.value == "method") {
        }
        else if (token.isId() && token.value == "function") {
        }
        else if (token.isId() && token.value == "type") {
        }
        else if (token.isId() && token.value == "globals") {
        }
    }
    return program;
}
exports.parse = parse;
if (false) {
    const program = parse(`
	library a initializer baobao a needs haha,  a555  ,asfas 
	// 介绍
	public function as takes nothing returns string defaults code
	local integer array aaaa
	set aaaa = 12
endfunction
	globals
		integer aaa
	endglobals
	`);
}
