"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = exports.ZincError = exports.TypePonint = exports.StructArray = exports.Struct = exports.Range = exports.Position = exports.Method = exports.Member = exports.Local = exports.Library = exports.InterfaceArray = exports.Interface = exports.Global = exports.FunctionInterface = exports.Func = exports.DynamicArray = exports.ArrayType = void 0;
const ast_1 = require("../jass/ast");
const jass = require("../jass/ast");
const common_1 = require("../common");
Object.defineProperty(exports, "Range", { enumerable: true, get: function () { return common_1.Range; } });
Object.defineProperty(exports, "Position", { enumerable: true, get: function () { return common_1.Position; } });
class Global extends jass.Global {
    constructor(type, name) {
        super(type, name);
        this.size = 0;
        this.tag = "public";
    }
    get origin() {
        if (this.isConstant && this.isArray) {
            return `${this.tag} constant ${this.type} ${this.name}[${this.size > 0 ? this.size : ""}]`;
        }
        else if (this.isArray) {
            return `${this.tag} ${this.type} ${this.name}[${this.size > 0 ? this.size : ""}]`;
        }
        else if (this.isConstant) {
            return `${this.tag} constant ${this.type} ${this.name}`;
        }
        else {
            return `${this.tag} ${this.type} ${this.name}`;
        }
    }
}
exports.Global = Global;
class Func extends jass.Func {
    constructor(name, takes = [], returns = null) {
        super(name, takes, returns);
        this.tag = "public";
    }
    get origin() {
        return `${this.tag} function ${this.name} (${this.takes.map(take => take.origin).join(", ")}) -> ${this.returns ? this.returns : "nothing"} {}`;
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
        this.tag = "private";
        this.isStatic = false;
        this.isOperator = false;
    }
    get origin() {
        return `${this.tag}${this.isStatic ? " static" : ""} method ${this.isOperator ? "operator " : ""}${this.name} (${this.takes.map(take => take.origin).join(", ")}) -> ${this.returns ? this.returns : "nothing"} {}`;
    }
}
exports.Method = Method;
class Member {
    constructor(type, name) {
        this.isConstant = false;
        this.tag = "private";
        this.isStatic = false;
        this.isArray = false;
        this.size = 0;
        this.nameToken = null;
        this.loc = new common_1.Range(new common_1.Position(0, 0), new common_1.Position(0, 0));
        this.text = "";
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
        this.tag = "public";
        this.members = [];
        this.methods = [];
        this.operators = [];
        this.text = "";
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
        this.extends = null;
    }
    get origin() {
        return `${this.tag} struct ${this.name} {}`;
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
class Local extends jass.Local {
    constructor(type, name) {
        super(type, name);
        this.nameToken = null;
        this.size = 0;
        this.isArray = false;
    }
    get origin() {
        return `${this.type} ${this.name}${this.isArray ? "[]" : ""};`;
    }
}
exports.Local = Local;
class Library {
    constructor(name) {
        this.requires = [];
        this.loc = new common_1.Range(new common_1.Position(0, 0), new common_1.Position(0, 0));
        this.structs = [];
        this.functions = [];
        this.globals = [];
        this.name = name;
    }
    get origin() {
        return `library ${this.name} {}`;
    }
}
exports.Library = Library;
class ZincError extends ast_1.JassError {
    constructor(message) {
        super(message);
    }
}
exports.ZincError = ZincError;
class Program {
    constructor() {
        this.librarys = [];
        this.zincErrors = [];
    }
}
exports.Program = Program;
