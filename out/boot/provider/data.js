"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findGlobalExcludeReturns = exports.findFunctionExcludeReturns = exports.getGlobalVariables = exports.findLocals = exports.findTakes = exports.findFunctionByName = exports.VjassMap = exports.ZincMap = exports.JassMap = exports.dzApiJProgram = exports.blizzardJProgram = exports.commonAiProgram = exports.commonJProgram = void 0;
const options_1 = require("./options");
const fs = require("fs");
const vscode = require("vscode");
const tool_1 = require("../tool");
const jassParse = require("../jass/parse");
const zincParse = require("../zinc/parse");
const vjassParse = require("../vjass/parse");
const commonJProgram = jassParse.parse(fs.readFileSync(options_1.Options.commonJPath).toString(), {
    needParseNative: true
});
exports.commonJProgram = commonJProgram;
const commonAiProgram = jassParse.parse(fs.readFileSync(options_1.Options.commonAiPath).toString(), {
    needParseNative: false
});
exports.commonAiProgram = commonAiProgram;
const blizzardJProgram = jassParse.parse(fs.readFileSync(options_1.Options.blizzardJPath).toString(), {
    needParseNative: false
});
exports.blizzardJProgram = blizzardJProgram;
const dzApiJProgram = jassParse.parse(fs.readFileSync(options_1.Options.dzApiJPath).toString(), {
    needParseNative: true
});
exports.dzApiJProgram = dzApiJProgram;
const JassMap = new Map();
exports.JassMap = JassMap;
const ZincMap = new Map();
exports.ZincMap = ZincMap;
const VjassMap = new Map();
exports.VjassMap = VjassMap;
function parseWorkspaceFiles(floders = vscode.workspace.workspaceFolders) {
    if (!floders) {
        return;
    }
    floders.forEach((floder) => {
        const files = tool_1.resolvePaths([floder.uri.fsPath]);
        files.forEach((filePath) => {
            const content = fs.readFileSync(filePath).toString();
            if (tool_1.isJFile(filePath)) {
                const jassProgram = jassParse.parse(content, {
                    needParseLocal: true
                });
                JassMap.set(filePath, jassProgram);
                const vjassProgram = vjassParse.parse(content);
                VjassMap.set(filePath, vjassProgram);
                const zincProgram = zincParse.parse(content);
                ZincMap.set(filePath, zincProgram);
            }
            else if (tool_1.isAiFile(filePath)) {
                const jassProgram = jassParse.parse(content, {
                    needParseLocal: true
                });
                JassMap.set(filePath, jassProgram);
                const vjassProgram = vjassParse.parse(content);
                VjassMap.set(filePath, vjassProgram);
                const zincProgram = zincParse.parse(content);
                ZincMap.set(filePath, zincProgram);
            }
            else if (tool_1.isZincFile(filePath)) {
                const zincProgram = zincParse.parse(content, true);
                ZincMap.set(filePath, zincProgram);
            }
        });
    });
}
parseWorkspaceFiles();
function startWatch() {
    const watcher = vscode.workspace.createFileSystemWatcher("**/*{.j,.ai,.jass}", false, false, false);
    watcher.onDidCreate((event) => {
        const content = fs.readFileSync(event.fsPath).toString();
        const program = jassParse.parse(content, {
            needParseLocal: true
        });
        JassMap.set(event.fsPath, program);
        const vjassProgram = vjassParse.parse(content);
        VjassMap.set(event.fsPath, vjassProgram);
        const zincProgram = zincParse.parse(content);
        ZincMap.set(event.fsPath, zincProgram);
    });
    watcher.onDidDelete((event) => {
        JassMap.delete(event.fsPath);
        VjassMap.delete(event.fsPath);
        ZincMap.delete(event.fsPath);
    });
    watcher.onDidChange((event) => {
        const content = fs.readFileSync(event.fsPath).toString();
        const program = jassParse.parse(content, {
            needParseLocal: true
        });
        JassMap.set(event.fsPath, program);
        const vjassProgram = vjassParse.parse(content);
        VjassMap.set(event.fsPath, vjassProgram);
        const zincProgram = zincParse.parse(content);
        ZincMap.set(event.fsPath, zincProgram);
    });
    const zincWatcher = vscode.workspace.createFileSystemWatcher("**/*.zn", false, false, false);
    zincWatcher.onDidCreate((event) => {
        const zincProgram = zincParse.parse(fs.readFileSync(event.fsPath).toString());
        ZincMap.set(event.fsPath, zincProgram);
    });
    zincWatcher.onDidDelete((event) => {
        ZincMap.delete(event.fsPath);
    });
    zincWatcher.onDidChange((event) => {
        const zincProgram = zincParse.parse(fs.readFileSync(event.fsPath).toString());
        ZincMap.set(event.fsPath, zincProgram);
    });
    vscode.workspace.onDidChangeTextDocument((event) => {
    });
}
startWatch();
function findFunctionByName(name) {
    return [...commonJProgram.natives, ...commonJProgram.functions,
        ...blizzardJProgram.natives, ...blizzardJProgram.functions,
        ...commonAiProgram.natives, ...commonAiProgram.functions,
        ...dzApiJProgram.natives, ...dzApiJProgram.functions,
        ...[...JassMap.values()].flatMap((program) => [...program.natives, ...program.functions]),
        ...[...VjassMap.values()].flatMap((program) => [...program.librarys.flatMap((library) => library.functions)]),
    ].find(func => func.name == name);
}
exports.findFunctionByName = findFunctionByName;
function findFunctionByLine(key, line) {
    const program = JassMap.get(key);
    if (program) {
        const func = program.functions.find((func) => func.loc.start.line < line && func.loc.end.line > line);
        if (func) {
            return func;
        }
    }
    const vprogram = VjassMap.get(key);
    if (vprogram) {
        return vprogram.librarys.flatMap((library) => library.functions).find((func) => func.loc.start.line < line && func.loc.end.line > line);
    }
}
function findTakes(key, line) {
    var _a;
    return (_a = findFunctionByLine(key, line)) === null || _a === void 0 ? void 0 : _a.takes;
}
exports.findTakes = findTakes;
function findLocals(key, line) {
    var _a;
    return (_a = findFunctionByLine(key, line)) === null || _a === void 0 ? void 0 : _a.locals;
}
exports.findLocals = findLocals;
function getGlobalVariables() {
    const VariableFilter = (global) => {
        return !global.isConstant;
    };
    const globals = [];
    const commonJGlobals = commonJProgram.globals.filter(VariableFilter);
    const commonAiGlobals = commonAiProgram.globals.filter(VariableFilter);
    const blizzardJGlobals = blizzardJProgram.globals.filter(VariableFilter);
    const dzApiJGlobals = dzApiJProgram.globals.filter(VariableFilter);
    globals.push(...commonJGlobals, ...commonAiGlobals, ...blizzardJGlobals, ...dzApiJGlobals);
    JassMap.forEach((program, key) => {
        globals.push(...program.globals.filter(VariableFilter));
    });
    VjassMap.forEach((program, key) => {
        program.librarys.forEach((library) => {
            globals.push(...library.globals.filter(VariableFilter));
        });
    });
    return globals;
}
exports.getGlobalVariables = getGlobalVariables;
function findFunctionExcludeReturns(...types) {
    const nothing = types.some((type) => type === null);
    return [...commonJProgram.natives, ...commonJProgram.functions,
        ...blizzardJProgram.natives, ...blizzardJProgram.functions,
        ...commonAiProgram.natives, ...commonAiProgram.functions,
        ...dzApiJProgram.natives, ...dzApiJProgram.functions,
        ...[...JassMap.values()].flatMap((program) => [...program.natives, ...program.functions]),
        ...[...VjassMap.values()].flatMap((program) => [...program.librarys.flatMap((library) => library.functions)]),
    ].filter(func => {
        if (nothing) {
            return func.returns !== null && !types.includes(func.returns);
        }
        else {
            return !types.includes(func.returns);
        }
    });
}
exports.findFunctionExcludeReturns = findFunctionExcludeReturns;
function findGlobalExcludeReturns(...types) {
    return [...commonJProgram.globals,
        ...blizzardJProgram.globals,
        ...commonAiProgram.globals,
        ...dzApiJProgram.globals,
        ...[...JassMap.values()].flatMap((program) => program.globals),
        ...[...VjassMap.values()].flatMap((program) => [...program.librarys.flatMap((library) => library.globals)]),
    ].filter(func => {
        return !types.includes(func.type);
    });
}
exports.findGlobalExcludeReturns = findGlobalExcludeReturns;
class Data {
    constructor() {
        this.is = false;
        this._programs = [
            commonJProgram,
            blizzardJProgram,
            dzApiJProgram,
            commonAiProgram,
            ...Data.map.values()
        ].flat();
        if (this.is == false) {
            this.is = true;
        }
    }
    initData() {
        const filePaths = [options_1.Options.commonJPath, options_1.Options.commonAiPath, options_1.Options.blizzardJPath, options_1.Options.dzApiJPath];
        filePaths.forEach((filePath) => {
            const program = jassParse.parse(fs.readFileSync(filePath).toString());
            program.filePath = filePath;
            Data.map.set(filePath, program);
        });
    }
    findGlobalsByType(option) {
        const programs = option.key
            ? Array.isArray(option.key) ? option.key.map(filePath => Data.map.get(filePath)).filter(x => x) : [Data.map.get(option.key)].filter(x => x)
            : [...Data.map.values()];
        const globals = programs.map(x => {
            let globals = [];
            if (option.jass === undefined || option) {
                globals.push(...x.globals);
            }
            if (option.modifier) {
                globals = globals.filter(global => option.modifier == "constant" ? global.isConstant : !global.isConstant);
            }
            if (option.array) {
                globals = globals.filter(global => global.isArray);
            }
            if (option.type) {
                globals = globals.filter(global => global.type == option.type);
            }
            if (option.name) {
                globals = globals.filter(global => global.name == option.name);
            }
            return globals;
        }).flat();
        return globals;
    }
    findFunctionsByType(option) {
        const functions = [];
        JassMap.forEach((program, key) => {
            console.log(key);
            functions.push(...program.natives, ...program.functions);
        });
        return functions;
    }
}
Data.map = new Map();
const data = new Data();
exports.default = data;
