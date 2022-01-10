"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineComment = exports.Struct = exports.Native = exports.Global = exports.Func = exports.Library = exports.Scope = exports.Program = void 0;
const path = require("path");
const vscode = require("vscode");
const common_1 = require("../common");
const tool_1 = require("../tool");
class Line {
    constructor(lineNumber, text) {
        this._text = text;
        this._loc = new vscode.Range(lineNumber, 0, lineNumber, text.length);
    }
    get lineNumber() {
        return this._loc.start.line;
    }
    get text() {
        return this._text;
    }
    get length() {
        return this._text.length;
    }
    get isBlank() {
        return this._text.trimStart() == "";
    }
    get loc() {
        return this._loc;
    }
}
class LineComment {
    constructor(line, content) {
        this.line = line;
        this.content = content;
    }
}
exports.LineComment = LineComment;
class _ZincBlock {
    constructor(loc, lines, startLineComment, endLineComment = null) {
        this.loc = loc;
        this.lines = lines;
        this.startLineComment = startLineComment;
        this.endLineComment = endLineComment;
    }
}
class Program {
    constructor(key, content) {
        this.types = [];
        this.natives = [];
        this.functions = [];
        this.globals = [];
        this.librarys = [];
        this.scopes = [];
        this.structs = [];
        this.flatScope = (scopes) => {
            return scopes.map(scope => {
                if (scope.scopes.length == 0) {
                    return [scope];
                }
                else {
                    return [scope, ...this.flatScope(scope.scopes)];
                }
            }).flat();
        };
        this.key = key;
        console.info(`开始处理${this.key}文件!`);
        const result = this._retainCode(content);
        const lineTexts = this._toLines(result.content);
        this._handle(lineTexts, result.comments);
        result.comments.clear();
    }
    _convertKey(key) {
        if (key.trimStart() == "") {
            throw " illegality key!";
        }
        return path.resolve(key);
    }
    _retainCode(content) {
        const map = new Map();
        const newContent = tool_1.retainVjassBlock(content, (line, commentString) => {
            map.set(line, commentString);
        });
        return { content: newContent, comments: map };
    }
    _toLines(content) {
        const lines = content.split("\n");
        const lineTexts = lines.map((line, index) => {
            return new Line(index, line);
        });
        return lineTexts;
    }
    get lastLibrary() {
        return this.librarys[this.librarys.length - 1];
    }
    _handle(lines, comments) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        let inGlobals = false;
        let inFunc = false;
        let inMethod = false;
        let inLibrary = false;
        let scopeField = 0;
        let inStruct = false;
        const getScopes = (scopes, f) => {
            let field = 0;
            function get(ss) {
                if (field == f) {
                    return ss;
                }
                else {
                    field++;
                    return get(ss[ss.length - 1].scopes);
                }
            }
            return get(scopes);
        };
        const getScope = (scopes, f) => {
            let field = 1;
            const get = (ss) => {
                if (field >= f) {
                    return ss;
                }
                else {
                    field++;
                    return get(ss.scopes[ss.scopes.length - 1]);
                }
            };
            return get(scopes[scopes.length - 1]);
        };
        const funcHandle = (func) => {
            if (inLibrary) {
                if (scopeField > 0) {
                    getScope(this.lastLibrary.scopes, scopeField).functions.push(func);
                }
                else {
                    this.lastLibrary.functions.push(func);
                }
            }
            else if (scopeField > 0) {
                getScope(this.scopes, scopeField).functions.push(func);
            }
            else {
                this.functions.push(func);
            }
        };
        const structHandle = (struct) => {
            if (inLibrary) {
                if (scopeField > 0) {
                    getScope(this.lastLibrary.scopes, scopeField).structs.push(struct);
                }
                else {
                    this.lastLibrary.structs.push(struct);
                }
            }
            else if (scopeField > 0) {
                getScope(this.scopes, scopeField).structs.push(struct);
            }
            else {
                this.structs.push(struct);
            }
        };
        const structMethodHandle = (method) => {
            if (inLibrary) {
                if (scopeField > 0) {
                    const structs = getScope(this.lastLibrary.scopes, scopeField).structs;
                    const struct = structs[structs.length - 1];
                    struct.methods.push(method);
                }
                else {
                    const structs = this.lastLibrary.structs;
                    const struct = structs[structs.length - 1];
                    struct.methods.push(method);
                }
            }
            else if (scopeField > 0) {
                const structs = getScope(this.scopes, scopeField).structs;
                const struct = structs[structs.length - 1];
                struct.methods.push(method);
            }
            else {
                const structs = this.structs;
                const struct = structs[structs.length - 1];
                struct.methods.push(method);
            }
        };
        const descHandle = (line, desc) => {
            if (comments.has(line.loc.start.line - 1)) {
                desc.text = comments.get(line.loc.start.line - 1);
            }
        };
        const setLoc = (obj, line) => {
            obj.loc.start = new common_1.Position(line.lineNumber, line.loc.start.character);
            obj.loc.end = new common_1.Position(line.lineNumber, line.loc.end.character);
        };
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            if (/^\s*type\b/.test(line.text)) {
                const type = this._handleType(line.text);
                if (type) {
                    this.types.push(type);
                    descHandle(line, type);
                }
            }
            else if (/^\s*native\b/.test(line.text)) {
                const native = this._handleNative(line.text, FunctionOption.native(false));
                if (native) {
                    setLoc(native, line);
                    this.natives.push(native);
                    descHandle(line, native);
                }
            }
            else if (/^\s*constant\s+native\b/.test(line.text)) {
                const native = this._handleNative(line.text, FunctionOption.native(true));
                if (native) {
                    setLoc(native, line);
                    this.natives.push(native);
                    descHandle(line, native);
                }
            }
            else if (/^\s*function\b/.test(line.text)) {
                inGlobals = false;
                inFunc = true;
                const func = this._handleNative(line.text, FunctionOption.func());
                if (func) {
                    setLoc(func, line);
                    funcHandle(func);
                    descHandle(line, func);
                }
            }
            else if (/^\s*private\s+function\b/.test(line.text)) {
                inGlobals = false;
                inFunc = true;
                const func = this._handleNative(line.text, FunctionOption.func("private"));
                if (func) {
                    setLoc(func, line);
                    funcHandle(func);
                    descHandle(line, func);
                }
            }
            else if (/^\s*public\s+function\b/.test(line.text)) {
                inGlobals = false;
                inFunc = true;
                const func = this._handleNative(line.text, FunctionOption.func("public"));
                if (func) {
                    setLoc(func, line);
                    funcHandle(func);
                    descHandle(line, func);
                }
            }
            else if (/^\s*static\s+function\b/.test(line.text)) {
                inGlobals = false;
                inFunc = true;
                const func = this._handleNative(line.text, FunctionOption.func("default", true));
                if (func) {
                    setLoc(func, line);
                    funcHandle(func);
                    descHandle(line, func);
                }
            }
            else if (/^\s*public\s+static\s+function\b/.test(line.text)) {
                inGlobals = false;
                inFunc = true;
                const func = this._handleNative(line.text, FunctionOption.func("public", true));
                if (func) {
                    setLoc(func, line);
                    funcHandle(func);
                    descHandle(line, func);
                }
            }
            else if (/^\s*private\s+static\s+function\b/.test(line.text)) {
                inGlobals = false;
                inFunc = true;
                const func = this._handleNative(line.text, FunctionOption.func("private", true));
                if (func) {
                    setLoc(func, line);
                    funcHandle(func);
                    descHandle(line, func);
                }
            }
            else if (/^\s*endfunction\b/.test(line.text)) {
                inFunc = false;
            }
            else if (/^\s*globals\b/.test(line.text)) {
                inGlobals = true;
            }
            else if (/^\s*endglobals\b/.test(line.text)) {
                inGlobals = false;
            }
            else if (/^\s*library\b/.test(line.text)) {
                const library = (_a = this._handleLibrary(line.text)) !== null && _a !== void 0 ? _a : new Library("");
                this.librarys.push(library);
                descHandle(line, library);
                inLibrary = true;
                inGlobals = false;
                inFunc = false;
                scopeField = 0;
                inStruct = false;
            }
            else if (/^\s*library_once\b/.test(line.text)) {
                const library = (_a = this._handleLibrary(line.text)) !== null && _a !== void 0 ? _a : new Library("");
                this.librarys.push(library);
                descHandle(line, library);
                inLibrary = true;
                inGlobals = false;
                inFunc = false;
                scopeField = 0;
                inStruct = false;
            }
            else if (/^\s*endlibrary\b/.test(line.text)) {
                inLibrary = false;
                inGlobals = false;
                inFunc = false;
                scopeField = 0;
                inStruct = false;
            }
            else if (/^\s*scope\b/.test(line.text)) {
                const scope = (_b = this._handleScope(line.text)) !== null && _b !== void 0 ? _b : new Scope("");
                if (inLibrary) {
                    getScopes(this.lastLibrary.scopes, scopeField).push(scope);
                }
                else {
                    getScopes(this.scopes, scopeField).push(scope);
                }
                scopeField++;
                inGlobals = false;
                inFunc = false;
                inStruct = false;
            }
            else if (/^\s*endscope\b/.test(line.text)) {
                if (scopeField > 0) {
                    scopeField--;
                }
                inGlobals = false;
                inFunc = false;
                inStruct = false;
            }
            else if (/^\s*struct\b/.test(line.text)) {
                const struct = (_c = this._handleStruct(line.text)) !== null && _c !== void 0 ? _c : new Struct("");
                setLoc(struct, line);
                structHandle(struct);
                descHandle(line, struct);
                inStruct = true;
                inGlobals = false;
                inFunc = false;
            }
            else if (/^\s*endstruct\b/.test(line.text)) {
                inStruct = false;
            }
            else if (inStruct && /^\s*private\s+static\s+method\b/.test(line.text)) {
                const method = (_d = this._handleNative(line.text, FunctionOption.method("private", true))) !== null && _d !== void 0 ? _d : new Method("");
                setLoc(method, line);
                structMethodHandle(method);
                descHandle(line, method);
                inMethod = true;
                inGlobals = false;
                inFunc = false;
            }
            else if (inStruct && /^\s*public\s+static\s+method\b/.test(line.text)) {
                const method = (_e = this._handleNative(line.text, FunctionOption.method("public", true))) !== null && _e !== void 0 ? _e : new Method("");
                setLoc(method, line);
                structMethodHandle(method);
                descHandle(line, method);
                inMethod = true;
                inGlobals = false;
                inFunc = false;
            }
            else if (inStruct && /^\s*private\s+method\b/.test(line.text)) {
                const method = (_f = this._handleNative(line.text, FunctionOption.method("private"))) !== null && _f !== void 0 ? _f : new Method("");
                setLoc(method, line);
                structMethodHandle(method);
                descHandle(line, method);
                inMethod = true;
                inGlobals = false;
                inFunc = false;
            }
            else if (inStruct && /^\s*public\s+method\b/.test(line.text)) {
                const method = (_g = this._handleNative(line.text, FunctionOption.method("public"))) !== null && _g !== void 0 ? _g : new Method("");
                setLoc(method, line);
                structMethodHandle(method);
                descHandle(line, method);
                inMethod = true;
                inGlobals = false;
                inFunc = false;
            }
            else if (inStruct && /^\s*static\s+method\b/.test(line.text)) {
                const method = (_h = this._handleNative(line.text, FunctionOption.method("default", true))) !== null && _h !== void 0 ? _h : new Method("");
                setLoc(method, line);
                structMethodHandle(method);
                descHandle(line, method);
                inMethod = true;
                inGlobals = false;
                inFunc = false;
            }
            else if (inStruct && /^\s*method\b/.test(line.text)) {
                const method = (_j = this._handleNative(line.text, FunctionOption.method("default"))) !== null && _j !== void 0 ? _j : new Method("");
                setLoc(method, line);
                structMethodHandle(method);
                descHandle(line, method);
                inMethod = true;
                inGlobals = false;
                inFunc = false;
            }
            else if (inStruct && /^\s*private\s+[a-zA-Z][a-zA-Z0-9_]*\b/.test(line.text)) {
            }
            else if (inStruct && /^\s*public\s+[a-zA-Z][a-zA-Z0-9_]*\b/.test(line.text)) {
            }
            else if (inStruct && /^\s*[a-zA-Z][a-zA-Z0-9_]*\s+[a-zA-Z][a-zA-Z0-9_]*\b/.test(line.text)) {
            }
            else if (inGlobals && /^\s*private\s+constant\s+[a-zA-Z][a-zA-Z0-9_]*\b/.test(line.text)) {
                const global = this._handleGlobal(line, new GlobalOption("private", true));
                if (global) {
                    setLoc(global, line);
                    this.globals.push(global);
                    descHandle(line, global);
                }
            }
            else if (inGlobals && /^\s*public\s+constant\s+[a-zA-Z][a-zA-Z0-9_]*\b/.test(line.text)) {
                const global = this._handleGlobal(line, new GlobalOption("public", true));
                if (global) {
                    setLoc(global, line);
                    this.globals.push(global);
                    descHandle(line, global);
                }
            }
            else if (inGlobals && /^\s*private\s+[a-zA-Z][a-zA-Z0-9_]*\b/.test(line.text)) {
                const global = this._handleGlobal(line, new GlobalOption("private"));
                if (global) {
                    setLoc(global, line);
                    this.globals.push(global);
                    descHandle(line, global);
                }
            }
            else if (inGlobals && /^\s*public\s+[a-zA-Z][a-zA-Z0-9_]*\b/.test(line.text)) {
                const global = this._handleGlobal(line, new GlobalOption("public"));
                if (global) {
                    setLoc(global, line);
                    this.globals.push(global);
                    descHandle(line, global);
                }
            }
            else if (inGlobals && /^\s*constant\s+[a-zA-Z][a-zA-Z0-9_]*\b/.test(line.text)) {
                const global = this._handleGlobal(line, new GlobalOption("default", true));
                if (global) {
                    setLoc(global, line);
                    this.globals.push(global);
                    descHandle(line, global);
                }
            }
            else if (inGlobals && /^\s*[a-zA-Z][a-zA-Z0-9_]*\b/.test(line.text)) {
                const global = this._handleGlobal(line, new GlobalOption);
                if (global) {
                    setLoc(global, line);
                    this.globals.push(global);
                    descHandle(line, global);
                }
            }
        }
    }
    _handleType(text) {
        const result = /type\s+(?<name>[a-zA-Z][a-zA-Z0-9_]*)\s+extends\s+(?<extend>[a-zA-Z][a-zA-Z0-9_]*)\s+array\s*\[\s*(?<size>\d+)\s*\]/.exec(text);
        if (result && result.groups) {
            const name = result.groups["name"];
            const extend = result.groups["extend"];
            const size = result.groups["size"];
            const type = new ArrayType(name, extend, parseInt(size));
            return type;
        }
        else
            return null;
    }
    _handleNative(text, option = FunctionOption.func()) {
        const functionNameString = text.substring(0, text.includes("takes") ? text.indexOf("takes") : text.length);
        const nameResult = (function () {
            switch (option.type) {
                case "function":
                    return new RegExp(/function\s+(?<name>[a-zA-Z][a-zA-Z0-9_]*)/);
                case "native":
                    return new RegExp(/native\s+(?<name>[a-zA-Z][a-zA-Z0-9_]*)/);
                case "method":
                    return new RegExp(/method\s+(?<name>[a-zA-Z][a-zA-Z0-9_]*)/);
                default:
                    return new RegExp(/function\s+(?<name>[a-zA-Z][a-zA-Z0-9_]*)/);
            }
        })().exec(functionNameString);
        if (!nameResult || !nameResult.groups) {
            return null;
        }
        const funcName = nameResult.groups["name"];
        const takesResult = /takes\s+(?<takes>nothing|([a-zA-Z][a-zA-Z0-9_]*\s+[a-zA-Z][a-zA-Z0-9_]*)(\s*,\s*[a-zA-Z][a-zA-Z0-9_]*\s+[a-zA-Z][a-zA-Z0-9_]*)*)/.exec(text.substring(text.includes("takes") ? text.indexOf("takes") : 0, text.includes("returns") ? text.indexOf("returns") : text.length));
        let takes = [];
        if (takesResult && takesResult.groups) {
            const takesString = takesResult.groups["takes"];
            if (takesString != "nothing") {
                takes = this.takeStringToTakes(takesString);
            }
        }
        const returnsResult = /returns\s+(?<returns>[a-zA-Z][a-zA-Z0-9_]*)/.exec(text.substring(text.includes("returns") ? text.indexOf("returns") : 0));
        let returns = null;
        if (returnsResult && returnsResult.groups) {
            const returnsString = returnsResult.groups["returns"];
            if (returnsString != "nothing") {
                returns = returnsString;
            }
        }
        switch (option.type) {
            case "function":
                return new Func(funcName, takes, returns, option.modifier, option.static);
            case "native":
                return new Native(funcName, takes, returns, option.constant);
            case "method":
                return new Method(funcName, takes, returns, option.modifier);
            default:
                return new Func(funcName, takes, returns, option.modifier, option.static);
        }
    }
    takeStringToTakes(takeString) {
        return takeString.split(",").map(ts => ts.trim()).map(ts => {
            const result = /(?<type>[a-zA-Z][a-zA-Z0-9_]*)\s+(?<name>[a-zA-Z][a-zA-Z0-9_]*)/.exec(ts);
            if (result && result.groups) {
                const type = result.groups["type"];
                const name = result.groups["name"];
                return new Take(type, name);
            }
        }).filter(take => take);
    }
    _handleGlobal(line, option = new GlobalOption) {
        const regExp = (function () {
            if (option.constant) {
                if (option.modifier == "private") {
                    return new RegExp(/private\s+constant\s+(?<type>[a-zA-Z][a-zA-Z0-9_]*)\s+(?:(?<array>array)\s+)?(?<name>[a-zA-Z][a-zA-Z0-9_]*)/);
                }
                else if (option.modifier == "public") {
                    return new RegExp(/public\s+constant\s+(?<type>[a-zA-Z][a-zA-Z0-9_]*)\s+(?:(?<array>array)\s+)?(?<name>[a-zA-Z][a-zA-Z0-9_]*)/);
                }
                else {
                    return new RegExp(/constant\s+(?<type>[a-zA-Z][a-zA-Z0-9_]*)\s+(?:(?<array>array)\s+)?(?<name>[a-zA-Z][a-zA-Z0-9_]*)/);
                }
            }
            else {
                if (option.modifier == "private") {
                    return new RegExp(/private\s+(?<type>[a-zA-Z][a-zA-Z0-9_]*)\s+(?:(?<array>array)\s+)?(?<name>[a-zA-Z][a-zA-Z0-9_]*)/);
                }
                else if (option.modifier == "public") {
                    return new RegExp(/public\s+(?<type>[a-zA-Z][a-zA-Z0-9_]*)\s+(?:(?<array>array)\s+)?(?<name>[a-zA-Z][a-zA-Z0-9_]*)/);
                }
                else {
                    return new RegExp(/(?<type>[a-zA-Z][a-zA-Z0-9_]*)\s+(?:(?<array>array)\s+)?(?<name>[a-zA-Z][a-zA-Z0-9_]*)/);
                }
            }
        })();
        const result = regExp.exec(line.text);
        if (result && result.groups) {
            const type = result.groups["type"];
            const name = result.groups["name"];
            const isArray = result.groups["array"] ? true : false;
            const global = new Global(type, name, option.constant, isArray, option.modifier);
            return global;
        }
        else {
            return null;
        }
    }
    _handleLibrary(text) {
        const nameResult = /library\s+(?<name>[a-zA-Z][a-zA-Z0-9_]*)/.exec(text);
        if (nameResult && nameResult.groups) {
            const name = nameResult.groups["name"];
            return new Library(name);
        }
        else
            return null;
    }
    _handleScope(text) {
        const nameResult = /scope\s+(?<name>[a-zA-Z][a-zA-Z0-9_]*)/.exec(text);
        if (nameResult && nameResult.groups) {
            const name = nameResult.groups["name"];
            return new Scope(name);
        }
        else
            return null;
    }
    _handleStruct(text) {
        const result = /struct\s+(?<name>[a-zA-Z][a-zA-Z0-9_]*)(?:\s+extends\s+(?<extend>[a-zA-Z][a-zA-Z0-9_]*))?/.exec(text);
        if (result && result.groups) {
            const name = result.groups["name"];
            const extend = result.groups["extend"];
            const struct = new Struct(name, extend !== null && extend !== void 0 ? extend : null);
            return struct;
        }
        else
            return null;
    }
    get allScope() {
        return [...this.flatScope(this.scopes), ...this.librarys.map(library => this.flatScope(library.scopes)).flat()];
    }
    get allFunctions() {
        const functions = [...this.functions, ...this.librarys.map(library => {
                const scopes = this.flatScope(library.scopes);
                return [...library.functions, ...scopes.map(scope => scope.functions).flat()];
            }).flat(), ...this.flatScope(this.scopes).map(scope => scope.functions).flat()];
        return functions;
    }
    get allGlobals() {
        const globals = [...this.globals, ...this.librarys.map(library => {
                const scopes = this.flatScope(library.scopes);
                return [...library.globals, ...scopes.map(scope => scope.globals).flat()];
            }).flat(), ...this.flatScope(this.scopes).map(scope => scope.globals).flat()];
        return globals;
    }
    get allStructs() {
        const structs = [...this.structs, ...this.librarys.map(library => {
                const scopes = this.flatScope(library.scopes);
                return [...library.structs, ...scopes.map(scope => scope.structs).flat()];
            }).flat(), ...this.flatScope(this.scopes).map(scope => scope.structs).flat()];
        return structs;
    }
}
exports.Program = Program;
Program._programs = [];
class FunctionOption {
    constructor(type = "function", modifier = "default", constant = false, isStatic = false) {
        this.type = type;
        this.constant = constant;
        this.static = isStatic;
        this.modifier = modifier;
    }
    static native(isConstant = false) {
        return new FunctionOption("native", "default", isConstant);
    }
    static func(modifier = "default", isStatic = false) {
        return new FunctionOption("function", modifier, false, isStatic);
    }
    static method(modifier = "default", isStatic = false) {
        return new FunctionOption("method", modifier, false, isStatic);
    }
}
class GlobalOption {
    constructor(modifier = "default", isConstant = false) {
        this.modifier = modifier;
        this.constant = isConstant;
    }
}
class BaseType {
    constructor(name) {
        this.name = name;
    }
}
class Type extends BaseType {
    constructor(name, extend) {
        super(name);
        this.extend = extend;
    }
}
class ArrayType extends BaseType {
    constructor(name, extend, size) {
        super(name);
        this.text = "";
        this.extend = extend;
        this.size = size;
    }
    get origin() {
        return `type ${this.name} extends ${this.extend} array [${this.size}]`;
    }
}
class Take {
    constructor(type, name) {
        this.loc = common_1.Range.default();
        this.type = type;
        this.name = name;
    }
    get origin() {
        return `${this.type} ${this.name}`;
    }
}
class Func {
    constructor(name, takes = [], returns = null, modifier = "default", isStatic = false) {
        this.loc = common_1.Range.default();
        this.text = "";
        this.name = name;
        this.takes = takes;
        this.returns = returns;
        this.modifier = modifier;
        this.static = isStatic;
    }
    get origin() {
        if (this.modifier == "default") {
            if (this.static) {
                return `static function ${this.name} takes ${this.takes.length == 0 ? "nothing" : this.takes.map(take => take.origin).join(" ,")} returns ${this.returns ? this.returns : "nothing"}`;
            }
            else {
                return `function ${this.name} takes ${this.takes.length == 0 ? "nothing" : this.takes.map(take => take.origin).join(" ,")} returns ${this.returns ? this.returns : "nothing"}`;
            }
        }
        else {
            if (this.static) {
                return `${this.modifier} static function ${this.name} takes ${this.takes.length == 0 ? "nothing" : this.takes.map(take => take.origin).join(" ,")} returns ${this.returns ? this.returns : "nothing"}`;
            }
            else {
                return `${this.modifier} function ${this.name} takes ${this.takes.length == 0 ? "nothing" : this.takes.map(take => take.origin).join(" ,")} returns ${this.returns ? this.returns : "nothing"}`;
            }
        }
    }
}
exports.Func = Func;
class Native {
    constructor(name, takes = [], returns = null, constant = false) {
        this.loc = common_1.Range.default();
        this.text = "";
        this.name = name;
        this.takes = takes;
        this.returns = returns;
        this.constant = constant;
    }
    get origin() {
        if (this.constant) {
            return `constant native ${this.name} takes ${this.takes.length == 0 ? "nothing" : this.takes.map(take => take.origin).join(" ,")} returns ${this.returns ? this.returns : "nothing"}`;
        }
        else {
            return `native ${this.name} takes ${this.takes.length == 0 ? "nothing" : this.takes.map(take => take.origin).join(" ,")} returns ${this.returns ? this.returns : "nothing"}`;
        }
    }
}
exports.Native = Native;
class Method {
    constructor(name, takes = [], returns = null, modifier = "default") {
        this.loc = common_1.Range.default();
        this.text = "";
        this.name = name;
        this.takes = takes;
        this.returns = returns;
        this.modifier = modifier;
    }
    get origin() {
        if (this.modifier == "default") {
            return `method ${this.name} takes ${this.takes.length == 0 ? "nothing" : this.takes.map(take => take.origin).join(" ,")} returns ${this.returns ? this.returns : "nothing"}`;
        }
        else {
            return `${this.modifier} method ${this.name} takes ${this.takes.length == 0 ? "nothing" : this.takes.map(take => take.origin).join(" ,")} returns ${this.returns ? this.returns : "nothing"}`;
        }
    }
}
class Global {
    constructor(type, name, constant = false, array = false, modifier = "default") {
        this.loc = common_1.Range.default();
        this.text = "";
        this.type = type;
        this.name = name;
        this.constant = constant;
        this.array = array;
        this.modifier = modifier;
    }
    get origin() {
        if (this.modifier == "default") {
            if (this.constant) {
                if (this.array) {
                    return `constant ${this.type} array ${this.name} = [...]`;
                }
                else {
                    return `constant ${this.type} ${this.name} = ...`;
                }
            }
            else {
                if (this.array) {
                    return `${this.type} array ${this.name}`;
                }
                else {
                    return `${this.type} ${this.name}`;
                }
            }
        }
        else {
            if (this.constant) {
                if (this.array) {
                    return `${this.modifier} constant ${this.type} array ${this.name} = [...]`;
                }
                else {
                    return `${this.modifier} constant ${this.type} ${this.name} = ...`;
                }
            }
            else {
                if (this.array) {
                    return `${this.modifier} ${this.type} array ${this.name}`;
                }
                else {
                    return `${this.modifier} ${this.type} ${this.name}`;
                }
            }
        }
    }
}
exports.Global = Global;
class Library {
    constructor(name) {
        this.functions = [];
        this.globals = [];
        this.scopes = [];
        this.structs = [];
        this.text = "";
        this.name = name;
    }
    get origin() {
        return `library ${this.name}\nendlibrary`;
    }
}
exports.Library = Library;
class Scope {
    constructor(name) {
        this.functions = [];
        this.globals = [];
        this.scopes = [];
        this.structs = [];
        this.text = "";
        this.name = name;
    }
    get origin() {
        return `scope ${this.name}\nendscope`;
    }
}
exports.Scope = Scope;
class Struct {
    constructor(name, extend = null) {
        this.loc = common_1.Range.default();
        this.methods = [];
        this.text = "";
        this.name = name;
        this.extend = extend;
    }
    get origin() {
        if (this.extend) {
            return `struct ${this.name} extends ${this.extend}`;
        }
        else {
            return `struct ${this.name}`;
        }
    }
}
exports.Struct = Struct;
