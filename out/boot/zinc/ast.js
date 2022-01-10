"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../jass/ast");
const jass = require("../jass/ast");
const common_1 = require("../common");
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
class Func extends jass.Func {
    constructor(name, takes = [], returns = "nothing") {
        super(name, takes, returns);
        this.tag = "public";
    }
    get origin() {
        return `${this.tag} function ${this.name} (${this.takes.map(take => take.origin).join(", ")}) -> ${this.returns ? this.returns : "nothing"} {}`;
    }
}
class FunctionInterface {
    constructor(takes = [], returns = null) {
        this.takes = takes;
        this.returns = returns;
    }
}
class TypePonint {
    constructor(type, takes = [], returns = null) {
        this.loc = new common_1.Range(new common_1.Position(0, 0), new common_1.Position(0, 0));
        this.locals = [];
        this.type = type;
        this.func = new FunctionInterface(takes, returns);
    }
}
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
class DynamicArray {
    constructor(type, extend, size = 0, max = 0) {
        this.type = type;
        this.extendType = new ArrayType(extend, size, max);
    }
}
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
class InterfaceArray extends Interface {
    constructor() {
        super(...arguments);
        this.size = 0;
    }
}
class Struct extends Interface {
    constructor() {
        super(...arguments);
        this.extends = null;
    }
    get origin() {
        return `${this.tag} struct ${this.name} {}`;
    }
}
class StructArray extends Struct {
    constructor() {
        super(...arguments);
        this.size = 0;
    }
}
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
class ZincError extends ast_1.JassError {
    constructor(message) {
        super(message);
    }
}
class Program {
    constructor() {
        this.librarys = [];
        this.zincErrors = [];
    }
}
