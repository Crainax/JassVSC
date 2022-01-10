"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = exports.ZincBlock = exports.MultiLineText = exports.JassCompileError = exports.TextMacroLineText = exports.DefineMacro = exports.LineText = exports.RunTextMacro = exports.TextMacro = exports.Declaration = exports.AstNode = exports.BlockComment = exports.LineComment = exports.Native = exports.JassError = exports.Interface = exports.Member = exports.Struct = exports.Library = exports.Local = exports.Global = exports.Method = exports.Func = exports.Take = void 0;
const common_1 = require("../common");
const tool_1 = require("../tool");
class Node {
    constructor() {
        this.loc = common_1.Range.default();
    }
}
class Declaration extends Node {
    constructor() {
        super(...arguments);
        this.source = "";
        this.lineComments = [];
    }
    hasDeprecated() {
        return this.lineComments.findIndex((lineComment) => new RegExp(/^\s*@deprecated\b/, "").test(lineComment.getContent())) != -1;
    }
    getParams() {
        return this.lineComments.map((lineComment) => {
            const result = new RegExp(/^\s*@params?\s+(?<id>[a-zA-Z][a-zA-Z\d_]*)(?:\s*(?<descript>.+))?/, "").exec(lineComment.getContent());
            if (result && result.groups) {
                return {
                    id: result.groups["id"],
                    descript: result.groups["descript"],
                };
            }
        }).filter(x => x);
    }
    getTexts() {
        return this.lineComments.filter((lineComment) => !/^\s*@(?:deprecated|params?)\b/.test(lineComment.getContent()));
    }
    getContents() {
        return this.getTexts().map((lineComment) => lineComment.getContent());
    }
}
exports.Declaration = Declaration;
class Take extends Node {
    constructor(type, name) {
        super();
        this.nameToken = null;
        this.type = type;
        this.name = name;
    }
    get origin() {
        return `${this.type} ${this.name}`;
    }
}
exports.Take = Take;
class Native extends Declaration {
    constructor(name = "", takes = [], returns = "nothing") {
        super();
        this.nameToken = null;
        this.text = "";
        this.constant = false;
        this.lineComments = [];
        this.name = name;
        this.takes = takes;
        this.returns = returns;
    }
    get origin() {
        return `native ${this.name} takes ${this.takes.length > 0 ? this.takes.map(take => take.origin).join(", ") : "nothing"} returns ${this.returns ? this.returns : "nothing"}`;
    }
    isConstant() {
        return this.constant;
    }
    setConstant(isConstant) {
        this.constant = isConstant;
    }
}
exports.Native = Native;
class Func extends Native {
    constructor() {
        super(...arguments);
        this.option = {
            style: "vjass"
        };
        this.loc = common_1.Range.default();
        this.tag = "default";
        this.defaults = null;
        this.locals = [];
        this.tokens = [];
        this.globals = [];
    }
    get origin() {
        if (this.option.style == "vjass") {
            const defaultString = this.defaults !== null ? (' defaults ' + this.defaults) : "";
            return `${this.tag == "default" ? "" : this.tag + " "}function ${this.name} takes ${this.takes.length > 0 ? this.takes.map(take => take.origin).join(", ") : "nothing"} returns ${this.returns ? this.returns : "nothing"}${defaultString}`;
        }
        else if (this.option.style == "zinc") {
            return `${this.tag == "default" ? "" : this.tag + " "}function ${this.name} (${this.takes.map(take => take.origin).join(", ")}) -> ${this.returns ? this.returns : "nothing"} {}`;
        }
        return `function ${this.name} takes ${this.takes.length > 0 ? this.takes.map(take => take.origin).join(", ") : "nothing"} returns ${this.returns ? this.returns : "nothing"}`;
    }
    getGlobals() {
        return this.globals;
    }
}
exports.Func = Func;
class Method extends Func {
    constructor() {
        super(...arguments);
        this.tag = "default";
        this.modifier = "default";
        this.isOperator = false;
    }
    get origin() {
        if (this.option.style == "vjass") {
            return `${this.tag}${this.modifier == "default" ? "" : " " + this.modifier} method ${this.name} (${this.takes.map(take => take.origin).join(", ")}) -> ${this.returns ? this.returns : "nothing"} {}`;
        }
        else if (this.option.style == "zinc") {
            return `${this.tag}${this.modifier == "default" ? "" : " " + this.modifier} method ${this.isOperator ? "operator " : ""}${this.name} (${this.takes.map(take => take.origin).join(", ")}) -> ${this.returns ? this.returns : "nothing"} {}`;
        }
        return `${this.tag}${this.modifier == "default" ? "" : " " + this.modifier} method ${this.name} (${this.takes.map(take => take.origin).join(", ")}) -> ${this.returns ? this.returns : "nothing"} {}`;
    }
}
exports.Method = Method;
class Global extends Declaration {
    constructor(type = "", name = "") {
        super();
        this.option = {
            style: "vjass"
        };
        this.loc = common_1.Range.default();
        this.tag = "default";
        this.isConstant = false;
        this.isArray = false;
        this.nameToken = null;
        this.text = "";
        this.lineComments = [];
        this.size = 0;
        this.type = type;
        this.name = name;
    }
    get origin() {
        if (this.option.style == "vjass") {
            return `${this.isConstant ? "constant " : ""}${this.type}${this.isArray ? " array" : ""} ${this.name}`;
        }
        else if (this.option.style == "zinc") {
            if (this.isConstant && this.isArray) {
                return `${this.tag == "default" ? "" : this.tag + " "}constant ${this.type} ${this.name}[${this.size > 0 ? this.size : ""}]`;
            }
            else if (this.isArray) {
                return `${this.tag == "default" ? "" : this.tag + " "}${this.type} ${this.name}[${this.size > 0 ? this.size : ""}]`;
            }
            else if (this.isConstant) {
                return `${this.tag == "default" ? "" : this.tag + " "}constant ${this.type} ${this.name}`;
            }
            else {
                return `${this.tag == "default" ? "" : this.tag + " "}${this.type} ${this.name}`;
            }
        }
        return `${this.isConstant ? "constant " : ""}${this.type}${this.isArray ? " array" : ""} ${this.name}`;
    }
}
exports.Global = Global;
class Local extends Declaration {
    constructor(type = "", name = "") {
        super();
        this.option = {
            style: "vjass"
        };
        this.loc = common_1.Range.default();
        this.isArray = false;
        this.text = "";
        this.nameToken = null;
        this.initTokens = [];
        this.lineComments = [];
        this.size = 0;
        this.type = type;
        this.name = name;
    }
    get origin() {
        if (this.option.style == "vjass") {
            return `local ${this.type}${this.isArray ? " array" : ""} ${this.name}`;
        }
        else if (this.option.style == "zinc") {
            return `${this.type} ${this.name}${this.isArray ? "[]" : ""};`;
        }
        return `local ${this.type}${this.isArray ? " array" : ""} ${this.name}`;
    }
}
exports.Local = Local;
class JassError {
    constructor(message) {
        this.loc = common_1.Range.default();
        this.message = message;
    }
}
exports.JassError = JassError;
class Member extends Declaration {
    constructor(type = "", name = "") {
        super();
        this.option = {
            style: "vjass"
        };
        this.isConstant = false;
        this.tag = "default";
        this.isStatic = false;
        this.isArray = false;
        this.size = 0;
        this.text = "";
        this.loc = common_1.Range.default();
        this.lineComments = [];
        this.nameToken = null;
        this.modifier = "default";
        this.type = type;
        this.name = name;
    }
    get origin() {
        if (this.option.style == "vjass") {
            return `${this.tag}${this.isStatic ? " static" : ""}${this.isConstant ? " constant" : ""} ${this.type} ${this.name}${this.isArray ? "[" + (this.size > 0 ? this.size : "") + "]" : ""};`;
        }
        else if (this.option.style == "zinc") {
            return `${this.tag}${this.isStatic ? " static" : ""}${this.isConstant ? " constant" : ""} ${this.type} ${this.name}${this.isArray ? "[" + (this.size > 0 ? this.size : "") + "]" : ""};`;
        }
        return `${this.type}${this.isArray ? " array" : ""} ${this.name}`;
    }
}
exports.Member = Member;
class Interface extends Declaration {
    constructor(name = "") {
        super();
        this.option = {
            style: "vjass"
        };
        this.tag = "default";
        this.members = [];
        this.methods = [];
        this.operators = [];
        this.loc = common_1.Range.default();
        this.lineComments = [];
        this.name = name;
    }
    get origin() {
        if (this.option.style == "vjass") {
            return `${this.tag == "default" ? "" : this.tag + " "}interface ${this.name} endstruct`;
        }
        else if (this.option.style == "zinc") {
            return `${this.tag == "default" ? "" : this.tag + " "}interface ${this.name} {}`;
        }
        return `interface ${this.name}`;
    }
}
exports.Interface = Interface;
class Struct extends Interface {
    constructor() {
        super(...arguments);
        this.text = "";
        this.extends = [];
    }
    get origin() {
        if (this.option.style == "vjass") {
            return `${this.tag == "default" ? "" : this.tag + " "}struct ${this.name} endstruct`;
        }
        else if (this.option.style == "zinc") {
            return `${this.tag == "default" ? "" : this.tag + " "}struct ${this.name} {}`;
        }
        return `struct ${this.name}`;
    }
}
exports.Struct = Struct;
class Library extends Declaration {
    constructor(name = "") {
        super();
        this.option = {
            style: "vjass"
        };
        this.initializer = null;
        this.requires = [];
        this.loc = common_1.Range.default();
        this.structs = [];
        this.functions = [];
        this.globals = [];
        this.lineComments = [];
        this.name = name;
    }
    get origin() {
        if (this.option.style == "vjass") {
            return `library ${this.name}${this.requires.length > 0 ? " " + this.requires.join(", ") : ""} endlibrary`;
        }
        else if (this.option.style == "zinc") {
            return `library ${this.name} {}`;
        }
        return `library ${this.name}`;
    }
    get needs() {
        return this.requires;
    }
    findGlobalVariables() {
        return this.globals.filter((global) => !global.isConstant);
    }
    findGlobalConstants() {
        return this.globals.filter((global) => !global.isConstant);
    }
}
exports.Library = Library;
class AstNode extends common_1.Range {
    constructor(type) {
        super();
        this.astType = type;
    }
    getType() {
        return this.astType;
    }
}
exports.AstNode = AstNode;
class LineComment {
    constructor(text = "") {
        this.loc = common_1.Range.default();
        this.text = text;
    }
    getContent() {
        return this.text.replace(/^\s*\/\/(?:\/)?\s*/, "");
    }
    setText(text) {
        this.text = text;
    }
    getText() {
        return this.text;
    }
}
exports.LineComment = LineComment;
class BlockComment extends LineComment {
    constructor(text) {
        super(text);
    }
    getContent() {
        return this.text.replace(/^\/\*|\*\/$/, "");
    }
}
exports.BlockComment = BlockComment;
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
}
exports.LineText = LineText;
class MultiLineText extends common_1.Range {
    constructor(lineTexts = []) {
        super();
        this.lineTexts = lineTexts;
    }
}
exports.MultiLineText = MultiLineText;
class TextMacroLineText extends common_1.Range {
    constructor(raw, text) {
        super();
        this.raw = raw;
        this.text = text;
    }
}
exports.TextMacroLineText = TextMacroLineText;
class TextMacro extends AstNode {
    constructor(name, takes) {
        super("TextMacro");
        this.takes = [];
        this.body = [];
        this.name = name;
        if (takes) {
            this.takes = takes;
        }
    }
}
exports.TextMacro = TextMacro;
class RunTextMacro extends AstNode {
    constructor(name, takes) {
        super("RunTextMacro");
        this.takes = [];
        this.name = name;
        if (takes) {
            this.takes = takes;
        }
    }
}
exports.RunTextMacro = RunTextMacro;
class DefineMacro extends AstNode {
    constructor(name, value = null) {
        super("DefineMacro");
        this.value = null;
        this.name = name;
        this.value = value;
    }
}
exports.DefineMacro = DefineMacro;
class JassCompileError extends common_1.Range {
    constructor(message) {
        super();
        this.message = message;
    }
}
exports.JassCompileError = JassCompileError;
class ZincBlock extends AstNode {
    constructor() {
        super("ZincBlock");
        this.body = [];
    }
}
exports.ZincBlock = ZincBlock;
class Program extends Declaration {
    constructor() {
        super();
        this.filePath = "";
        this.natives = [];
        this.functions = [];
        this.globals = [];
        this.librarys = [];
        this.structs = [];
        this.errors = [];
        this.body = [];
    }
    findFunctionByType(...type) {
    }
    findFunctionByPosition(position) {
    }
    findFunctions(options = {
        type: null,
        position: null
    }) {
        const funcs = [...this.functions, ...this.natives];
        if (options.position) {
            const requireStrings = [];
            const pushRequire = (...requires) => {
                requires.forEach((require) => {
                    if (!requireStrings.includes(require)) {
                        requireStrings.push(require);
                    }
                });
            };
            this.librarys.forEach((library) => {
                if (library.loc.contains(options.position)) {
                    pushRequire(...library.requires);
                    funcs.push(...library.functions);
                }
                else if (requireStrings.includes(library.name)) {
                    funcs.push(...library.functions.filter((func) => {
                        return func.tag != "private";
                    }));
                }
            });
        }
        return funcs.filter((func) => {
            return options.type ? Array.isArray(options.type) ? options.type.includes(func.returns) : func.returns === options.type : true;
        });
    }
    findFunctionByName(...name) {
        this.functions.filter((func) => name.includes(func.name));
    }
    findLibraryByName(...name) {
        this.librarys.filter((library) => name.includes(library.name));
    }
    findLibrarys(options = {
        position: null,
        name: null,
        and: true
    }) {
        return this.librarys.filter((library) => {
            const positionBool = (options.position ? library.loc.contains(options.position) : true);
            const nameBool = (options.name ? Array.isArray(options.name) ? options.name.includes(library.name) : options.name == library.name : true);
            return options.and === false ? positionBool || nameBool : positionBool && nameBool;
        });
    }
    libraryFunctions() {
        return this.librarys.map((lib) => lib.functions).flat();
    }
    libraryStructs() {
        return this.librarys.map((lib) => lib.structs).flat();
    }
}
exports.Program = Program;
