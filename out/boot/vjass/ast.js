"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
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
class Func extends jass.Func {
    constructor(name, takes = [], returns) {
        super(name, takes, returns);
        this.tag = "default";
        this.defaults = null;
    }
    get origin() {
        const defaultString = this.defaults !== null ? (' defaults ' + this.defaults) : "";
        return `${this.tag} function ${this.name} takes ${this.takes.length > 0 ? this.takes.map(take => take.origin).join(", ") : "nothing"} returns ${this.returns ? this.returns : "nothing"}${defaultString}`;
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
        this.tag = "default";
        this.isStatic = false;
    }
    get origin() {
        return `${this.tag}${this.isStatic ? " static" : ""} method ${this.name} (${this.takes.map(take => take.origin).join(", ")}) -> ${this.returns ? this.returns : "nothing"} {}`;
    }
}
class VjassError extends jass.JassError {
    constructor(message) {
        super(message);
    }
}
