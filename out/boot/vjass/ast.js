"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VjassError = exports.Program = exports.TypePonint = exports.StructArray = exports.Struct = exports.Range = exports.Position = exports.Method = exports.Member = exports.Local = exports.Library = exports.InterfaceArray = exports.Interface = exports.Global = exports.FunctionInterface = exports.Func = exports.DynamicArray = exports.ArrayType = void 0;
const common_1 = require("../common");
Object.defineProperty(exports, "Position", { enumerable: true, get: function () { return common_1.Position; } });
Object.defineProperty(exports, "Range", { enumerable: true, get: function () { return common_1.Range; } });
const ast_1 = require("../jass/ast");
Object.defineProperty(exports, "Local", { enumerable: true, get: function () { return ast_1.Local; } });
const jass = require("../jass/ast");
class Global extends jass.Global {
    constructor() {
        super(...arguments);
        this.tag = "default";
    }
    get origin() {
        return `${this.tag == "default" ? "" : this.tag + " "}${this.isConstant ? "constant " : ""}${this.type} ${this.isArray ? "array " : ""}${this.name}`;
    }
}
exports.Global = Global;
class Func extends jass.Func {
    constructor(name, takes = [], returns = null) {
        super(name, takes, returns);
        this.tag = "default";
        this.defaults = null;
    }
    get origin() {
        const defaultString = this.defaults !== null ? (' defaults ' + this.defaults) : "";
        return `${this.tag} function ${this.name} takes ${this.takes.length > 0 ? this.takes.map(take => take.origin).join(", ") : "nothing"} returns ${this.returns ? this.returns : "nothing"}${defaultString}`;
    }
}
exports.Func = Func;
class FunctionInterface {
    constructor(takes = [], returns = null) {
        this.takes = takes;
        this.returns = returns;
    }
}
exports.FunctionInterface = FunctionInterface;
class TypePonint {
    constructor(type, takes = [], returns = null) {
        this.loc = new common_1.Range(new common_1.Position(0, 0), new common_1.Position(0, 0));
        this.locals = [];
        this.type = type;
        this.func = new FunctionInterface(takes, returns);
    }
}
exports.TypePonint = TypePonint;
class ArrayType {
    constructor(type, size = 0, max = 0) {
        this.type = type;
        if (max < size) {
            max = size;
        }
        this.size = size;
        this.max = max;
    }
}
exports.ArrayType = ArrayType;
class DynamicArray {
    constructor(type, extend, size = 0, max = 0) {
        this.type = type;
        this.extendType = new ArrayType(extend, size, max);
    }
}
exports.DynamicArray = DynamicArray;
class Method extends Func {
    constructor() {
        super(...arguments);
        this.tag = "default";
        this.isStatic = false;
    }
    get origin() {
        return `${this.tag}${this.isStatic ? " static" : ""} method ${this.name} (${this.takes.map(take => take.origin).join(", ")}) -> ${this.returns ? this.returns : "nothing"} {}`;
    }
}
exports.Method = Method;
class Member {
    constructor(type, name) {
        this.isConstant = false;
        this.tag = "default";
        this.isStatic = false;
        this.isArray = false;
        this.size = 0;
        this.text = "";
        this.loc = new common_1.Range(new common_1.Position(0, 0), new common_1.Position(0, 0));
        this.type = type;
        this.name = name;
    }
    get origin() {
        return `${this.tag}${this.isStatic ? " static" : ""}${this.isConstant ? " constant" : ""} ${this.type} ${this.name}${this.isArray ? "[" + (this.size > 0 ? this.size : "") + "]" : ""};`;
    }
}
exports.Member = Member;
class Interface {
    constructor(name) {
        this.tag = "default";
        this.members = [];
        this.methods = [];
        this.operators = [];
        this.loc = new common_1.Range(new common_1.Position(0, 0), new common_1.Position(0, 0));
        this.name = name;
    }
}
exports.Interface = Interface;
class InterfaceArray extends Interface {
    constructor() {
        super(...arguments);
        this.size = 0;
    }
}
exports.InterfaceArray = InterfaceArray;
class Struct extends Interface {
    constructor() {
        super(...arguments);
        this.text = "";
        this.extends = null;
    }
    get origin() {
        return `${this.tag} struct ${this.name} endstruct`;
    }
}
exports.Struct = Struct;
class StructArray extends Struct {
    constructor() {
        super(...arguments);
        this.size = 0;
    }
}
exports.StructArray = StructArray;
class Library {
    constructor(name) {
        this.initializer = null;
        this.requires = [];
        this.loc = new common_1.Range(new common_1.Position(0, 0), new common_1.Position(0, 0));
        this.structs = [];
        this.functions = [];
        this.globals = [];
        this.name = name;
    }
    get origin() {
        return `library ${this.name}${this.requires.length > 0 ? " " + this.requires.join(", ") : ""} endlibrary`;
    }
    get needs() {
        return this.requires;
    }
}
exports.Library = Library;
class VjassError extends jass.JassError {
    constructor(message) {
        super(message);
    }
}
exports.VjassError = VjassError;
class Program {
    constructor() {
        this.structs = [];
        this.interfaces = [];
        this.librarys = [];
        this.zincTokenErrors = [];
    }
}
exports.Program = Program;
