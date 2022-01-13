"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseZinc = exports.parseZincFile = exports.parseZincBlock = exports.parse = void 0;
const common_1 = require("../common");
const ast_1 = require("../jass/ast");
const tokens_1 = require("../jass/tokens");
const keyword_1 = require("../provider/keyword");
const tool_1 = require("../tool");
function isKeyword(value) {
    return keyword_1.ZincKeywords.includes(value);
}
class BodyType {
    constructor(type) {
        this.type = null;
        this.in = false;
        this.inStart = false;
        this.state = 0;
        this.type = type;
    }
}
class BodyStack extends Array {
    last() {
        return this[this.length - 1];
    }
    empty() {
        return this.length == 0;
    }
}
class ModifierBodyType {
    constructor(type) {
        this.type = type;
    }
}
function parseByTokens(tokens, isZincFile = false) {
    const comments = [];
    const matchText = (line) => {
        const texts = [];
        for (let index = line; index > 0; index--) {
            let comment = undefined;
            if ((comment = comments.find((token) => token.line == index - 1))) {
                const lineComment = new ast_1.LineComment(comment.value);
                lineComment.loc.setRange(new common_1.Range(new common_1.Position(comment.line, comment.position), new common_1.Position(comment.line, comment.end)));
            }
            else {
                break;
            }
        }
        return texts.reverse().join("\n");
    };
    const findLineComments = (line) => {
        const lineComments = [];
        for (let index = line; index > 0; index--) {
            let comment = undefined;
            if ((comment = comments.find((token) => token.line == index - 1))) {
                const lineComment = new ast_1.LineComment(comment.value);
                lineComment.loc.setRange(new common_1.Range(new common_1.Position(comment.line, comment.position), new common_1.Position(comment.line, comment.end)));
                lineComments.push(lineComment);
            }
            else {
                break;
            }
        }
        return lineComments;
    };
    let inZinc = false;
    tokens = tokens.filter((token, index, ts) => {
        if (token.isComment() && /\/\/![ \t]+zinc\b/.test(token.value)) {
            inZinc = true;
            return false;
        }
        else if (token.isComment() && /\/\/![ \t]+endzinc\b/.test(token.value)) {
            inZinc = false;
            return false;
        }
        else if (token.isComment()) {
            comments.push(token);
            return false;
        }
        return (isZincFile || inZinc) && !token.isBlockComment() && !token.isNewLine();
    });
    const program = new ast_1.Program();
    let inLibrary = false;
    let inLibraryStart = false;
    let libraryState = 0;
    let library = null;
    const resetLibrary = () => {
        inLibrary = false;
        inLibraryStart = false;
        libraryState = 0;
        library = null;
    };
    let inGlobal = false;
    let inFunction = false;
    let inFunctionStart = false;
    let functionState = 0;
    let func = null;
    const resetFunc = () => {
        inFunction = false;
        inFunctionStart = false;
        functionState = 0;
        func = null;
    };
    let inMethod = false;
    let inMethodStart = false;
    let methodState = 0;
    let method = null;
    const resetMethod = () => {
        inMethod = false;
        inMethodStart = false;
        methodState = 0;
        method = null;
    };
    let take = null;
    let bodyField = 0;
    const modifierTypes = [];
    const lastModifierType = () => {
        return modifierTypes[modifierTypes.length - 1];
    };
    let modifierType = null;
    const structModifierTypes = [];
    const lastStructModifierType = () => {
        return structModifierTypes[structModifierTypes.length - 1];
    };
    let inStruct = false;
    let inStructStart = false;
    let structState = 0;
    let struct = null;
    const resetStruct = () => {
        inStruct = false;
        inStructStart = false;
        structState = 0;
        struct = null;
    };
    let memberState = 0;
    let members = [];
    const lastMember = () => {
        return members[members.length - 1];
    };
    const resetMember = () => {
        memberState = 0;
        members.length = 0;
    };
    let localState = 0;
    let locals = [];
    const lastLocal = () => {
        return locals[locals.length - 1];
    };
    const resetLocal = () => {
        localState = 0;
        locals.length = 0;
    };
    let globalState = 0;
    let global = null;
    let globals = [];
    const lastGlobal = () => {
        return globals[globals.length - 1];
    };
    let isStatic = false;
    let isConstant = false;
    let isArr = false;
    for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index];
        const pushErrorOld = (message) => {
        };
        const pushExpectedError = (tokenValue) => {
            pushErrorOld(`Expected '${tokenValue}', got token with value '${token.value}'!`);
        };
        const pushErrorToken = () => {
            pushErrorOld(`Uncaught SyntaxError: Unexpected token '${token.value}'!`);
        };
        const reset = (type) => {
            const resetBodyField = () => {
                bodyField = 0;
            };
            const resetModifier = () => {
                modifierType = null;
            };
            const resetGlobal = () => {
                globalState = 0;
                global = null;
                isArr = false;
                isConstant = false;
            };
            const resetFunction = () => {
                inFunction = false;
                inFunctionStart = false;
                functionState = 0;
                func = null;
                resetBodyField();
                resetGlobal();
            };
            const resetMethod = () => {
                inMethod = false;
                inMethodStart = false;
                methodState = 0;
                method = null;
                resetBodyField();
                resetMember();
            };
            const resetLibrary = () => {
                inLibrary = false;
                inLibraryStart = false;
                libraryState = 0;
                library = null;
            };
            const resetMember = () => {
                memberState = 0;
                isArr = false;
                isConstant = false;
                isStatic = false;
            };
            const resetStruct = () => {
                inStruct = false;
                inStructStart = false;
                structState = 0;
                struct = null;
                structModifierTypes.length = 0;
                resetMember();
            };
            if (type == "function") {
                resetFunction();
            }
            else if (type == "library") {
                resetLibrary();
                resetModifier();
                resetFunction();
                resetMethod();
            }
            else if (type == "struct") {
                resetFunction();
                resetStruct();
                resetMethod();
            }
            else if (type == "method") {
                resetMethod();
                resetFunction();
                resetMember();
            }
            else if (type == "member") {
                resetMember();
            }
            else if (type == "global") {
                resetGlobal();
            }
        };
        const parseLocal = (type = "func") => {
            if (token.isOp() && token.value == ";") {
                (type == "func" ? func : method).locals.push(...locals.map((local, index, ms) => {
                    if (index != 0) {
                        local.type = ms[0].type;
                        local.loc.start = ms[0].loc.start;
                    }
                    local.loc.end = new common_1.Position(token.line, token.end);
                    return local;
                }));
            }
            else if (token.isOp() && token.value == "=") {
                localState = 6;
            }
            else if (localState == 0) {
                if (token.isId()) {
                    resetLocal();
                    const local = new ast_1.Local(token.value, "");
                    local.option.style = "zinc";
                    local.type = token.value;
                    local.loc.start = new common_1.Position(token.line, token.position);
                    locals.push(local);
                    localState = 1;
                }
                else {
                }
            }
            else if (localState == 1) {
                if (token.isOp() && token.value == ",") {
                }
                else if (token.isId()) {
                    if (lastLocal().name == "") {
                        lastLocal().name = token.value;
                        lastLocal().nameToken = token;
                        lastLocal().text = matchText(token.line);
                        lastLocal().lineComments.push(...findLineComments(token.line));
                    }
                    else {
                        const local = new ast_1.Local("", token.value);
                        local.option.style = "zinc";
                        local.nameToken = token;
                        local.text = matchText(token.line);
                        lastLocal().lineComments.push(...findLineComments(token.line));
                        locals.push(local);
                    }
                    localState = 2;
                }
                else {
                }
            }
            else if (localState == 2) {
                if (token.isOp() && token.value == "[") {
                    lastLocal().isArray = true;
                    localState = 3;
                }
                else if (token.isOp() && token.value == ",") {
                    localState = 1;
                }
                else {
                }
            }
            else if (localState == 3) {
                if (token.isInt()) {
                    lastLocal().size = parseInt(token.value);
                    localState = 4;
                }
                else if (token.isOp() && token.value == ",") {
                    localState = 1;
                }
                else if (token.isOp() && token.value == "]") {
                    localState = 5;
                }
                else {
                }
            }
            else if (localState == 4) {
                if (token.isOp() && token.value == "]") {
                    localState = 5;
                }
                else if (token.isOp() && token.value == ",") {
                    localState = 1;
                }
                else {
                }
            }
            else if (localState == 5) {
                if (token.isOp() && token.value == ",") {
                    localState = 1;
                }
            }
        };
        const parseBody = (type = "func") => {
            if (token.isOp() && token.value == "{") {
                bodyField++;
            }
            else if (token.isOp() && token.value == "}") {
                if (bodyField > 0) {
                    bodyField--;
                }
                else {
                    if (type == "func") {
                        func.loc.end = new common_1.Position(token.line, token.end);
                        resetFunc();
                    }
                    else {
                        method.loc.end = new common_1.Position(token.line, token.end);
                        resetMethod();
                    }
                    return;
                }
            }
            if (bodyField == 0) {
                parseLocal(type);
            }
            if (type == "func") {
                func.tokens.push(token);
            }
            else {
                method.tokens.push(token);
            }
        };
        const parseFunction = (type = "func") => {
            if (type == "func") {
                if (inFunctionStart) {
                    parseBody();
                }
                else if (token.isOp() && token.value == "{") {
                    inFunctionStart = true;
                }
                else if (token.isOp() && token.value == "(") {
                    functionState = 1;
                }
                else if ((functionState >= 1 || functionState <= 3) && token.isOp() && token.value == ")") {
                    functionState = 4;
                }
                else if (token.isOp() && token.value == "->") {
                    functionState = 5;
                }
                else if (functionState == 0) {
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
                else if (functionState == 1) {
                    if (token.isOp() && token.value == ",") {
                    }
                    else if (token.isId()) {
                        take = new ast_1.Take(token.value, "");
                        take.loc.start = new common_1.Position(token.line, token.position);
                        functionState = 2;
                    }
                    else {
                    }
                }
                else if (functionState == 2) {
                    if (token.isOp() && token.value == ",") {
                        functionState = 1;
                    }
                    else if (token.isId()) {
                        take.name = token.value;
                        take.nameToken = token;
                        take.loc.end = new common_1.Position(token.line, token.end);
                        func.takes.push(take);
                        functionState = 3;
                    }
                    else {
                    }
                }
                else if (functionState == 3) {
                    if (token.isOp() && token.value == ",") {
                        functionState = 1;
                    }
                    else {
                    }
                }
                else if (functionState == 4) {
                }
                else if (functionState == 5) {
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
            }
            else {
                if (inMethodStart) {
                    parseBody("method");
                }
                else if (token.isOp() && token.value == "{") {
                    inMethodStart = true;
                }
                else if (token.isOp() && token.value == "(") {
                    methodState = 2;
                }
                else if (token.isId() && token.value == "operator") {
                    method.isOperator = true;
                    methodState = 1;
                }
                else if (token.isOp() && token.value == "->") {
                    methodState = 6;
                }
                else if (methodState >= 2 && methodState <= 4 && token.value == ")") {
                    methodState = 5;
                }
                else if (methodState == 0) {
                    if (token.isId()) {
                        if (method.name == "") {
                            method.name = token.value;
                            method.nameToken = token;
                        }
                        else {
                        }
                    }
                    else {
                    }
                }
                else if (methodState == 1) {
                    if (token.isId() || token.isOp()) {
                        method.name += token.value;
                        method.nameToken = token;
                    }
                    else {
                    }
                }
                else if (methodState == 2) {
                    if (token.isOp() && token.value == ",") {
                    }
                    else if (token.isId()) {
                        take = new ast_1.Take(token.value, "");
                        take.loc.start = new common_1.Position(token.line, token.position);
                        methodState = 3;
                    }
                    else {
                    }
                }
                else if (methodState == 3) {
                    if (token.isOp() && token.value == ",") {
                        methodState = 2;
                    }
                    else if (token.isId()) {
                        take.name = token.value;
                        take.nameToken = token;
                        take.loc.end = new common_1.Position(token.line, token.end);
                        method.takes.push(take);
                        methodState = 4;
                    }
                    else {
                    }
                }
                else if (methodState == 4) {
                    if (token.isOp() && token.value == ",") {
                        methodState = 2;
                    }
                    else {
                    }
                }
                else if (methodState == 5) {
                }
                else if (methodState == 6) {
                    if (token.isId()) {
                        if (method.returns) {
                        }
                        else {
                            if (token.value == "nothing") {
                            }
                            else {
                                method.returns = token.value;
                            }
                        }
                    }
                    else {
                    }
                }
            }
        };
        const parseMember = () => {
            if (token.isOp() && token.value == ";") {
                struct.members.push(...members.map((member, index, ms) => {
                    if (index != 0) {
                        member.type = ms[0].type;
                        member.isStatic = ms[0].isStatic;
                        member.isConstant = ms[0].isConstant;
                        member.tag = ms[0].tag;
                        member.loc.start = ms[0].loc.start;
                    }
                    member.loc.end = new common_1.Position(token.line, token.end);
                    return member;
                }));
            }
            else if (token.isOp() && token.value == "=") {
                memberState = 6;
            }
            else if (memberState == 0) {
                if (token.isId()) {
                    resetMember();
                    const member = new ast_1.Member(token.value, "");
                    member.option.style = "zinc";
                    member.type = token.value;
                    member.isStatic = isStatic;
                    member.isConstant = isConstant;
                    if (modifierType) {
                        member.tag = modifierType;
                    }
                    else if (structModifierTypes.length > 0) {
                        member.tag = lastStructModifierType().type;
                    }
                    member.loc.start = new common_1.Position(token.line, token.position);
                    members.push(member);
                    memberState = 1;
                }
                else {
                }
            }
            else if (memberState == 1) {
                if (token.isOp() && token.value == ",") {
                }
                else if (token.isId()) {
                    if (lastMember().name == "") {
                        lastMember().name = token.value;
                        lastMember().nameToken = token;
                        lastMember().text = matchText(token.line);
                        lastMember().lineComments.push(...findLineComments(token.line));
                    }
                    else {
                        const member = new ast_1.Member("", token.value);
                        member.option.style = "zinc";
                        member.nameToken = token;
                        member.text = matchText(token.line);
                        member.lineComments.push(...findLineComments(token.line));
                        members.push(member);
                    }
                    memberState = 2;
                }
                else {
                }
            }
            else if (memberState == 2) {
                if (token.isOp() && token.value == "[") {
                    lastMember().isArray = true;
                    memberState = 3;
                }
                else if (token.isOp() && token.value == ",") {
                    memberState = 1;
                }
                else {
                }
            }
            else if (memberState == 3) {
                if (token.isInt()) {
                    lastMember().size = parseInt(token.value);
                    memberState = 4;
                }
                else if (token.isOp() && token.value == ",") {
                    memberState = 1;
                }
                else if (token.isOp() && token.value == "]") {
                    memberState = 5;
                }
                else {
                }
            }
            else if (memberState == 4) {
                if (token.isOp() && token.value == "]") {
                    memberState = 5;
                }
                else if (token.isOp() && token.value == ",") {
                    memberState = 1;
                }
                else {
                }
            }
            else if (memberState == 5) {
                if (token.isOp() && token.value == ",") {
                    memberState = 1;
                }
            }
        };
        const parseGlobal = () => {
            const pushGlobal = () => {
                library.globals.push(global, ...globals);
            };
            if (globalState == 0) {
                if (token.isId()) {
                    reset("global");
                    global = new ast_1.Global(token.value, "");
                    global.option.style = "zinc";
                    global.isConstant = isConstant;
                    if (modifierType) {
                        global.tag = modifierType;
                    }
                    else if (modifierTypes.length > 0) {
                        global.tag = lastModifierType().type;
                    }
                    global.loc.start = new common_1.Position(token.line, token.position);
                    global.lineComments.push(...findLineComments(token.line));
                    globalState = 1;
                }
                else {
                }
            }
            else if (globalState == 1) {
                if (token.isId()) {
                    global.name = token.value;
                    globalState = 2;
                }
                else {
                    globalState = 0;
                }
            }
            else if (globalState == 2) {
                if (token.isOp() && token.value == ";") {
                    global.loc.end = new common_1.Position(token.line, token.end);
                    pushGlobal();
                    reset("global");
                }
                else if (token.isOp() && token.value == "=") {
                    pushGlobal();
                    globalState = 6;
                }
                else if (token.isOp() && token.value == "[") {
                    if (globals.length > 0) {
                        lastGlobal().isArray = true;
                    }
                    else {
                        global.isArray = true;
                    }
                    globalState = 3;
                }
                else if (token.isOp() && token.value == ",") {
                    globalState = 7;
                }
                else {
                    globalState = 6;
                }
            }
            else if (globalState == 3) {
                if (token.isInt()) {
                    if (globals.length > 0) {
                        lastGlobal().size = parseInt(token.value);
                    }
                    else {
                        global.size = parseInt(token.value);
                    }
                    globalState = 4;
                }
                else if (token.isOp() && token.value == "]") {
                    globalState = 5;
                }
                else {
                    globalState = 6;
                }
            }
            else if (globalState == 4) {
                if (token.isOp() && token.value == "]") {
                    globalState = 5;
                }
                else {
                    pushExpectedError("]");
                    globalState = 6;
                }
            }
            else if (globalState == 5) {
                if (token.isOp() && token.value == ";") {
                    global.loc.end = new common_1.Position(token.line, token.end);
                    pushGlobal();
                    reset("global");
                }
                else {
                    pushErrorOld("Missing closing symbol ';'!");
                    globalState = 6;
                }
            }
            else if (globalState == 6) {
                if (token.isOp() && token.value == ";") {
                    reset("global");
                }
            }
            else if (globalState == 7) {
                if (token.isId()) {
                    const g = new ast_1.Global(global.type, "");
                    g.option.style = "zinc";
                    g.tag = global.tag;
                    g.isConstant = global.isConstant;
                    g.loc.start = new common_1.Position(token.line, token.position);
                    g.name = token.value;
                    g.loc.end = new common_1.Position(token.line, token.end);
                    globals.push(g);
                    g.lineComments.push(...findLineComments(token.line));
                    globalState = 2;
                }
                else {
                    pushErrorToken();
                    globalState = 6;
                }
            }
        };
        const parseStructBody = () => {
            if (token.isId() && token.value == "method") {
                resetMethod();
                method = new ast_1.Method("");
                method.option.style = "zinc";
                method.text = matchText(token.line);
                method.lineComments.push(...findLineComments(token.line));
                if (modifierType) {
                    method.tag = modifierType;
                }
                else if (structModifierTypes.length > 0) {
                    method.tag = lastStructModifierType().type;
                }
                method.modifier = "static";
                method.loc.start = new common_1.Position(token.line, token.position);
                struct.methods.push(method);
                inMethod = true;
            }
            else if (inMethod) {
                parseFunction("method");
            }
            else if (modifierType != null && token.isOp() && token.value == "{") {
                structModifierTypes.push(new ModifierBodyType(modifierType));
            }
            else if (token.isId() && token.value == "private") {
                modifierType = "private";
            }
            else if (token.isId() && token.value == "public") {
                modifierType = "public";
            }
            else if (structModifierTypes.length > 0 && token.isOp() && token.value == "}") {
                structModifierTypes.pop();
            }
            else if (token.isId() && token.value == "static") {
                isStatic = true;
            }
            else if (token.isId() && token.value == "constant") {
                isConstant = true;
            }
            else if (token.isOp() && token.value == "}") {
                struct.loc.end = new common_1.Position(token.line, token.end);
                resetStruct();
            }
            else {
                parseMember();
            }
            if (modifierType && token.isOp() && !(token.value == "public" || token.value == "private" || token.value == "constant" || token.value == "static")) {
                modifierType = null;
            }
            if (isStatic && !(token.value == "static" || token.value == "constant")) {
                isStatic = false;
            }
            if (isConstant && token.value != "constant") {
                isConstant = false;
            }
        };
        const parseStruct = () => {
            if (inStructStart) {
                parseStructBody();
            }
            else if (token.isOp() && token.value == "{") {
                inStructStart = true;
            }
            else if (token.isId() && token.value == "extends") {
                structState = 1;
            }
            else if (structState == 0) {
                if (token.isId()) {
                    if (struct.name == "") {
                        struct.name = token.value;
                    }
                    else {
                    }
                }
                else {
                }
            }
            else if (structState == 1) {
                if (token.isId()) {
                    if (struct.extends) {
                    }
                    else {
                        struct.extends.push(token.value);
                    }
                }
                else {
                }
                structState = 3;
            }
        };
        const pushError = (message) => {
            const err = new ast_1.JassError(message);
            err.loc.start = new common_1.Position(token.line, token.position);
            err.loc.end = new common_1.Position(token.line, token.end);
            program.errors.push(err);
        };
        if (token.isId() && token.value == "library") {
            resetLibrary();
            inLibrary = true;
            libraryState = 0;
            library = new ast_1.Library("");
            library.lineComments.push(...findLineComments(token.line));
            library.option.style = "zinc";
            library.loc.start = new common_1.Position(token.line, token.position);
            program.librarys.push(library);
        }
        else if (inLibrary) {
            if (inLibraryStart) {
                if (token.isId() && token.value == "struct") {
                    resetStruct();
                    struct = new ast_1.Struct("");
                    struct.option.style = "zinc";
                    struct.text = matchText(token.line);
                    struct.lineComments.push(...findLineComments(token.line));
                    if (modifierType) {
                        struct.tag = modifierType;
                    }
                    else if (modifierTypes.length > 0) {
                        struct.tag = lastModifierType().type;
                    }
                    struct.loc.start = new common_1.Position(token.line, token.position);
                    library.structs.push(struct);
                    inStruct = true;
                }
                else if (inStruct) {
                    parseStruct();
                }
                else if (inFunction) {
                    parseFunction();
                }
                else if (token.isId() && token.value == "function") {
                    resetFunc();
                    func = new ast_1.Func("");
                    func.option.style = "zinc";
                    func.text = matchText(token.line);
                    func.lineComments.push(...findLineComments(token.line));
                    if (modifierType) {
                        func.tag = modifierType;
                    }
                    else if (modifierTypes.length > 0) {
                        func.tag = lastModifierType().type;
                    }
                    func.loc.start = new common_1.Position(token.line, token.position);
                    library.functions.push(func);
                    inFunction = true;
                }
                else if (modifierType != null && token.isOp() && token.value == "{") {
                    modifierTypes.push(new ModifierBodyType(modifierType));
                }
                else if (token.isId() && token.value == "private") {
                    modifierType = "private";
                }
                else if (token.isId() && token.value == "public") {
                    modifierType = "public";
                }
                else if (token.isId() && token.value == "constant") {
                    isConstant = true;
                }
                else if (modifierTypes.length > 0 && token.isOp() && token.value == "}") {
                    modifierTypes.pop();
                }
                else if (token.isOp() && token.value == "}") {
                    library.loc.end = new common_1.Position(token.line, token.end);
                    resetLibrary();
                }
                else {
                    parseGlobal();
                }
                if (modifierType && token.value != "public" && token.value != "private") {
                    if (!inStructStart)
                        modifierType = null;
                }
            }
            else if (token.isOp() && token.value == "{") {
                inLibraryStart = true;
            }
            else if (token.isId() && token.value == "requires") {
                libraryState = 1;
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
                    library.requires.push(token.value);
                    libraryState = 2;
                }
                else if (token.isOp() && token.value == ",") {
                }
                else {
                    pushErrorToken();
                    libraryState = 2;
                }
            }
            else if (libraryState == 2) {
                if (token.isOp() && token.value == ",") {
                    libraryState = 1;
                }
                else {
                }
            }
        }
        else {
        }
    }
    return program;
}
exports.parseZinc = parseByTokens;
function parse(content, isZincFile = false) {
    let ts = tokens_1.tokenize(content);
    return parseByTokens(ts, isZincFile);
}
exports.parse = parse;
function parseZincBlock(content) {
    content = content.replace(/\r\n/g, "\n");
    return parse(tool_1.retainZincBlock(content));
}
exports.parseZincBlock = parseZincBlock;
function parseZincFile(path) {
}
exports.parseZincFile = parseZincFile;
if (false) {
    const testString = JSON.stringify(parse(`
	//! zinc
	  library library_name requires require_librarys ,,-,cccccc ccc, ccc {
		public {
			struct a {
				public {
					// 奶茶
					private static integer a[2],
					// 宝宝
					b = 12 , 17;
	
					integer c;
	
					method operator [] () {}
				}
			}
			function assasa(integer ass) {
				int aaa[3], hahah;
			}
		} 
	  }
	//! endzinc
	`).librarys, null, 2);
    console.log(testString);
}
