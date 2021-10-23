"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockComment = exports.LineComment = exports.Native = exports.JassError = exports.Program = exports.Local = exports.Global = exports.Func = exports.Take = void 0;
const common_1 = require("../common");
class Take {
    constructor(type, name) {
        this.nameToken = null;
        this.loc = common_1.Range.default();
        this.type = type;
        this.name = name;
    }
    get origin() {
        return `${this.type} ${this.name}`;
    }
}
exports.Take = Take;
class Native {
    constructor(name, takes = [], returns = null) {
        this.loc = common_1.Range.default();
        this.nameToken = null;
        this.text = "";
        this.name = name;
        this.takes = takes;
        this.returns = returns;
    }
    get origin() {
        return `native ${this.name} takes ${this.takes.length > 0 ? this.takes.map(take => take.origin).join(", ") : "nothing"} returns ${this.returns ? this.returns : "nothing"}`;
    }
}
exports.Native = Native;
class Func extends Native {
    constructor() {
        super(...arguments);
        this.loc = common_1.Range.default();
        this.locals = [];
        this.tokens = [];
    }
    get origin() {
        return `function ${this.name} takes ${this.takes.length > 0 ? this.takes.map(take => take.origin).join(", ") : "nothing"} returns ${this.returns ? this.returns : "nothing"}`;
    }
}
exports.Func = Func;
class Global {
    constructor(type, name) {
        this.loc = common_1.Range.default();
        this.isConstant = false;
        this.isArray = false;
        this.nameToken = null;
        this.text = "";
        this.type = type;
        this.name = name;
    }
    get origin() {
        return `${this.isConstant ? "constant " : ""}${this.type}${this.isArray ? " array" : ""} ${this.name}`;
    }
}
exports.Global = Global;
class Local {
    constructor(type, name) {
        this.loc = common_1.Range.default();
        this.isArray = false;
        this.text = "";
        this.nameToken = null;
        this.initTokens = [];
        this.type = type;
        this.name = name;
    }
    get origin() {
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
class Program {
    constructor() {
        this.filePath = "";
        this.natives = [];
        this.functions = [];
        this.globals = [];
        this.errors = [];
    }
}
exports.Program = Program;
class LineComment {
    constructor(text) {
        this.loc = common_1.Range.default();
        this.text = text;
    }
    getContent() {
        return this.text.replace(/^\/\/(?:\/)?/, "");
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
