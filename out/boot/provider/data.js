"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseContent = void 0;
const options_1 = require("./options");
const fs = require("fs");
const vscode = require("vscode");
const tool_1 = require("../tool");
const ast_1 = require("../jass/ast");
const parser_1 = require("../jass/parser");
const parse_1 = require("../zinc/parse");
class Pair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
class DataMap {
    constructor() {
        this.pairs = [];
    }
    put(key, value) {
        const index = this.pairs.findIndex((pair) => tool_1.compare(pair.key, key));
        if (index == -1) {
            this.pairs.push(new Pair(key, value));
        }
        else {
            this.pairs[index].value = value;
        }
    }
    remove(key) {
        const index = this.pairs.findIndex((pair) => tool_1.compare(pair.key, key));
        if (index != -1) {
            if (index == 0) {
                this.pairs.shift();
            }
            else if (index == this.pairs.length - 1) {
                this.pairs.pop();
            }
            else {
                this.pairs.splice(index, 1);
            }
        }
    }
    get(key) {
        return this.pairs.find((pair) => tool_1.compare(pair.key, key));
    }
    keys() {
        return this.pairs.map((pair) => pair.key);
    }
    values() {
        return this.pairs.map((pair) => pair.value);
    }
    forEach(callback) {
        this.pairs.forEach((pair) => callback(pair.key, pair.value));
    }
}
const dataMap = new DataMap();
const zincDataMap = new DataMap();
function getFileContent(filePath) {
    return fs.readFileSync(filePath, {
        encoding: "utf8"
    }).toString();
}
function setSource(filePath, program) {
    function set(n) {
        if (n instanceof ast_1.Program) {
            n.natives.forEach(x => {
                x.source = filePath;
            });
            n.functions.forEach(x => {
                x.source = filePath;
            });
            n.globals.forEach(x => {
                x.source = filePath;
            });
            n.structs.forEach(x => {
                x.source = filePath;
            });
            n.librarys.forEach(x => {
                x.source = filePath;
            });
        }
        else if (n instanceof ast_1.Func) {
            n.getGlobals().forEach(x => {
                x.source = filePath;
            });
            n.locals.forEach(x => {
                x.source = filePath;
            });
        }
        else if (n instanceof ast_1.Library) {
            n.functions.forEach(x => {
                x.source = filePath;
            });
            n.globals.forEach(x => {
                x.source = filePath;
            });
            n.structs.forEach(x => {
                x.source = filePath;
            });
        }
        else if (n instanceof ast_1.Struct) {
            n.members.forEach(x => {
                x.source = filePath;
            });
            n.methods.forEach(x => {
                x.source = filePath;
            });
        }
    }
    [program, program.globals, program.functions, program.natives, program.librarys, program.structs,
        program.librarys.map((lib) => lib.globals).flat(),
        program.librarys.map((lib) => lib.functions).flat(),
        program.librarys.map((lib) => lib.structs).flat(),
        program.structs.map((struct) => struct.members).flat(),
        program.structs.map((struct) => struct.methods).flat(),
        program.librarys.map((lib) => lib.structs).flat().map((struct) => struct.members).flat(),
        program.librarys.map((lib) => lib.structs).flat().map((struct) => struct.methods).flat(),
        program.functions.map((func) => func.getGlobals()).flat(),
        program.librarys.map((lib) => lib.functions).flat().map((func) => func.getGlobals()).flat(),
        program.librarys.map((lib) => lib.functions).flat().map((func) => func.locals).flat(),
        program.functions.flat().map((func) => func.locals).flat(),
        program.librarys.map((lib) => lib.structs).flat().map((struct) => struct.methods).flat().map((method) => method.locals).flat(),
    ].flat().forEach(x => {
        x.source = filePath;
    });
}
function parseContent(filePath, content) {
    if (tool_1.isZincFile(filePath)) {
        const program = parse_1.parse(content, true);
        setSource(filePath, program);
        zincDataMap.put(filePath, program);
    }
    else {
        const parser = new parser_1.Parser(content);
        if (options_1.Options.supportZinc) {
            const program = parser.zincing();
            setSource(filePath, program);
            zincDataMap.put(filePath, program);
        }
        const program = parser.parsing();
        setSource(filePath, program);
        dataMap.put(filePath, program);
    }
}
exports.parseContent = parseContent;
function parsePath(...filePaths) {
    filePaths.forEach((filePath) => {
        const content = getFileContent(filePath);
        parseContent(filePath, content);
    });
}
vscode.workspace.onDidChangeConfiguration((event) => {
    parsePath(options_1.Options.commonJPath);
});
parsePath(options_1.Options.commonJPath);
parsePath(options_1.Options.blizzardJPath);
parsePath(options_1.Options.dzApiJPath);
parsePath(options_1.Options.commonAiPath);
parsePath(...options_1.Options.includes);
parsePath(...options_1.Options.workspaces);
function startWatch() {
    const watcher = vscode.workspace.createFileSystemWatcher("**/*{.j,.ai,.jass}", false, false, false);
    watcher.onDidCreate((event) => {
        parsePath(event.fsPath);
    });
    watcher.onDidDelete((event) => {
        dataMap.remove(event.fsPath);
        zincDataMap.remove(event.fsPath);
    });
    watcher.onDidChange((event) => {
        parsePath(event.fsPath);
    });
    const zincWatcher = vscode.workspace.createFileSystemWatcher("**/*.zn", false, false, false);
    zincWatcher.onDidCreate((event) => {
        parsePath(event.fsPath);
    });
    zincWatcher.onDidDelete((event) => {
        zincDataMap.remove(event.fsPath);
    });
    zincWatcher.onDidChange((event) => {
        parsePath(event.fsPath);
    });
    vscode.workspace.onDidChangeTextDocument((event) => {
    });
}
startWatch();
class Data {
    static programs() {
        return [...dataMap.values()];
    }
    static natives() {
        return this.programs().map((program) => program.natives).flat();
    }
    static functions() {
        return this.programs().map((program) => program.functions).flat();
    }
    static globals() {
        return this.programs().map((program) => program.globals).flat();
    }
    static structs() {
        return this.programs().map((program) => program.structs).flat();
    }
    static globalVariables() {
        return this.globals().filter((global) => !global.isConstant);
    }
    static globalConstants() {
        return this.globals().filter((global) => global.isConstant);
    }
    static globalArrays() {
        return this.globals().filter((global) => global.isArray);
    }
    static librarys() {
        return this.programs().map((program) => program.librarys).flat();
    }
    static libraryGlobals() {
        return this.librarys().map((library) => library.globals).flat();
    }
    static libraryGlobalVariables() {
        return this.libraryGlobals().filter((global) => !global.isConstant);
    }
    static libraryGlobalConstants() {
        return this.libraryGlobals().filter((global) => global.isConstant);
    }
    static libraryGlobalArrays() {
        return this.libraryGlobals().filter((global) => global.isArray);
    }
    static libraryFunctions() {
        return this.librarys().map((library) => library.functions).flat();
    }
    static libraryStructs() {
        return this.librarys().map((library) => library.structs).flat();
    }
    static zincPrograms() {
        return [...zincDataMap.values()];
    }
    static zincLibrarys() {
        return this.zincPrograms().map((program) => program.librarys).flat();
    }
    static zincLibraryFunctions() {
        return this.zincLibrarys().map((library) => library.functions).flat();
    }
    static zincLibraryStructs() {
        return this.zincLibrarys().map((library) => library.structs).flat();
    }
}
exports.default = Data;
