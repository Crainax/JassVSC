"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const types_1 = require("./types");
const type_desc_1 = require("./type-desc");
const keyword_1 = require("./keyword");
const options_1 = require("./options");
const tool_1 = require("../tool");
const tool_2 = require("./tool");
const data_1 = require("./data");
const tokens_1 = require("../jass/tokens");
const typeItems = [];
types_1.StatementTypes.forEach(type => {
    const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.Class);
    item.detail = type;
    item.documentation = type_desc_1.getTypeDesc(type);
    typeItems.push(item);
});
const CodeItem = item("code", vscode.CompletionItemKind.Class, "句柄", `传递function`);
const keywordItems = [];
(options_1.Options.isOnlyJass ? keyword_1.Keywords : keyword_1.AllKeywords).forEach(keyword => {
    const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
    keywordItems.push(item);
});
function completionItem(label, option = {
    kind: undefined,
    detial: undefined,
    documentation: undefined,
    code: undefined,
    source: undefined,
    orderString: undefined
}) {
    var _a;
    const item = new vscode.CompletionItem(label, option.kind);
    item.detail = (_a = option.detial) !== null && _a !== void 0 ? _a : label;
    const ms = new vscode.MarkdownString();
    if (option.source) {
        ms.appendMarkdown(`(***${option.source}***)`);
    }
    if (option.documentation) {
        if (option.source) {
            ms.appendText("\n");
        }
        if (Array.isArray(option.documentation)) {
            option.documentation.forEach((documentation) => {
                ms.appendMarkdown(documentation);
            });
        }
        else {
            ms.appendMarkdown(option.documentation);
        }
    }
    if (option.code) {
        ms.appendCodeblock(`${option.code}`);
    }
    item.documentation = ms;
    item.sortText = option.orderString;
    return item;
}
var PositionType;
(function (PositionType) {
    PositionType[PositionType["Unkown"] = 0] = "Unkown";
    PositionType[PositionType["Returns"] = 1] = "Returns";
    PositionType[PositionType["LocalType"] = 2] = "LocalType";
    PositionType[PositionType["Array"] = 3] = "Array";
    PositionType[PositionType["ConstantType"] = 4] = "ConstantType";
    PositionType[PositionType["FuncNaming"] = 5] = "FuncNaming";
    PositionType[PositionType["TakesFirstType"] = 6] = "TakesFirstType";
    PositionType[PositionType["TakesOtherType"] = 7] = "TakesOtherType";
    PositionType[PositionType["TakesNaming"] = 8] = "TakesNaming";
    PositionType[PositionType["Call"] = 9] = "Call";
    PositionType[PositionType["Set"] = 10] = "Set";
    PositionType[PositionType["Point"] = 11] = "Point";
    PositionType[PositionType["LocalNaming"] = 12] = "LocalNaming";
    PositionType[PositionType["TakesKeyword"] = 13] = "TakesKeyword";
    PositionType[PositionType["ReturnKeyword"] = 14] = "ReturnKeyword";
    PositionType[PositionType["Assign"] = 15] = "Assign";
    PositionType[PositionType["Args"] = 16] = "Args";
    PositionType[PositionType["Requires"] = 17] = "Requires";
})(PositionType || (PositionType = {}));
class PositionTool {
    static is(document, position) {
        const lineText = document.lineAt(position.line);
        const inputText = lineText.text.substring(lineText.firstNonWhitespaceCharacterIndex, position.character);
        if (this.ReturnsRegExp.test(inputText)) {
            return PositionType.Returns;
        }
        else if (this.LocalRegExp.test(inputText)) {
            return PositionType.LocalType;
        }
        else if (this.ConstantRegExp.test(inputText)) {
            return PositionType.ConstantType;
        }
        else if (this.ReturnsKeywordRegExp.test(inputText)) {
            return PositionType.ReturnKeyword;
        }
        else if (/\btakes\b/.test(inputText) && this.TakeTypeFirstRegExp.test(inputText)) {
            return PositionType.TakesFirstType;
        }
        else if (/\btakes\b/.test(inputText) && this.TakeTypeOtherRegExp.test(inputText)) {
            return PositionType.TakesOtherType;
        }
        else if (/\btakes\b/.test(inputText) && this.TakeNamingRegExp.test(inputText)) {
            return PositionType.TakesNaming;
        }
        else if (this.CallRegExp.test(inputText)) {
            return PositionType.Call;
        }
        else if (this.SetRegExp.test(inputText)) {
            return PositionType.Set;
        }
        else if (this.PointRegExp.test(inputText)) {
            return PositionType.Point;
        }
        else if (this.LocalNamingRegExp.test(inputText)) {
            return PositionType.LocalNaming;
        }
        else if (this.TakesKeywordRegExp.test(inputText)) {
            return PositionType.TakesKeyword;
        }
        else if (/\bfunction\b/.test(inputText) && /\btakes\b/.test(inputText) && inputText.indexOf("function") < inputText.indexOf("takes")) {
            return PositionType.ReturnKeyword;
        }
        else if (this.CallRegExp.test(inputText)) {
            return PositionType.Call;
        }
        else if ((() => {
            const key = tool_2.functionKey(document, position);
            return key.isSingle();
        })()) {
            return PositionType.Args;
        }
        else if (this.FuncNamingRegExp.test(inputText)) {
            return PositionType.FuncNaming;
        }
        else if (/^local\b/.test(inputText) && /(?<!=)=(?!=)/.test(inputText) && inputText.indexOf("=") < position.character) {
            return PositionType.Assign;
        }
        else if (this.RequiresKeywordRegExp.test(inputText)) {
            return PositionType.Requires;
        }
        return PositionType.Unkown;
    }
}
PositionTool.ReturnsRegExp = new RegExp(/\breturns\s+[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.LocalRegExp = new RegExp(/\blocal\s+[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.LocalNamingRegExp = new RegExp(/\blocal\s+[a-zA-Z0-9]+[a-zA-Z0-9_]*\s+(?:array\s+)?[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.ConstantRegExp = new RegExp(/\bconstant\s+[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.FuncNamingRegExp = new RegExp(/\bfunction\s+[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.TakeTypeFirstRegExp = new RegExp(/\btakes\s+[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.TakeTypeOtherRegExp = new RegExp(/,\s*[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.TakeNamingRegExp = new RegExp(/(?:,\s*|\btakes\s+)[a-zA-Z0-9]+[a-zA-Z0-9_]*\s+[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.CallRegExp = new RegExp(/\bcall\s+[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.SetRegExp = new RegExp(/\bset\s+[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.PointRegExp = new RegExp(/\b[a-zA-Z0-9]+[a-zA-Z0-9_]*\s*\.\s*[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.TakesKeywordRegExp = new RegExp(/\bfunction\s+[a-zA-Z0-9]+[a-zA-Z0-9_]*\s+[takes]*$/);
PositionTool.ReturnsKeywordRegExp = new RegExp(/\btakes\s+nothing\s+[a-zA-Z0-9]?[a-zA-Z0-9_]*$/);
PositionTool.RequiresKeywordRegExp = new RegExp(/\b(?:requires|needs|uses)\s+(?:optional\s+)?[a-zA-Z0-9]?[a-zA-Z0-9_]*(?:\s*,\s*(?:optional\s+)?[a-zA-Z0-9]?[a-zA-Z0-9_]*)*$/);
function item(label, kind, documentation, code) {
    const item = new vscode.CompletionItem(label, kind);
    item.documentation = new vscode.MarkdownString().appendMarkdown(documentation !== null && documentation !== void 0 ? documentation : "").appendCodeblock(code !== null && code !== void 0 ? code : "");
    return item;
}
const NothingItem = item("nothing", vscode.CompletionItemKind.Keyword);
const TakesKeywordItem = item("takes", vscode.CompletionItemKind.Keyword);
const ArrayKeywordItem = item("array", vscode.CompletionItemKind.Keyword);
const ReturnsKeywordItem = item("returns", vscode.CompletionItemKind.Keyword);
const NullKeywordItem = item("null", vscode.CompletionItemKind.Keyword);
function libraryToCompletionItem(library, option) {
    var _a, _b, _c, _d, _e;
    return completionItem(library.name, {
        kind: (_a = option === null || option === void 0 ? void 0 : option.kind) !== null && _a !== void 0 ? _a : vscode.CompletionItemKind.Field,
        source: (_b = option === null || option === void 0 ? void 0 : option.source) !== null && _b !== void 0 ? _b : library.source,
        code: (_c = option === null || option === void 0 ? void 0 : option.code) !== null && _c !== void 0 ? _c : library.origin,
        documentation: (_d = option === null || option === void 0 ? void 0 : option.documentation) !== null && _d !== void 0 ? _d : library.getContents(),
        orderString: option === null || option === void 0 ? void 0 : option.orderString,
        detial: (_e = option === null || option === void 0 ? void 0 : option.detial) !== null && _e !== void 0 ? _e : library.name
    });
}
function funcToCompletionItem(func, option) {
    var _a, _b, _c, _d;
    return completionItem(func.name, {
        kind: (_a = option === null || option === void 0 ? void 0 : option.kind) !== null && _a !== void 0 ? _a : vscode.CompletionItemKind.Function,
        source: (_b = option === null || option === void 0 ? void 0 : option.source) !== null && _b !== void 0 ? _b : func.source,
        code: (_c = option === null || option === void 0 ? void 0 : option.code) !== null && _c !== void 0 ? _c : func.origin,
        documentation: (_d = option === null || option === void 0 ? void 0 : option.documentation) !== null && _d !== void 0 ? _d : (() => {
            const contents = func.getContents();
            func.getParams().forEach((param) => {
                if (func.takes.findIndex((take) => take.name == param.id) != -1) {
                    contents.push(`\n***@param*** **${param.id}** *${param.descript}*`);
                }
            });
            return contents;
        })(),
        orderString: option === null || option === void 0 ? void 0 : option.orderString,
        detial: option === null || option === void 0 ? void 0 : option.detial
    });
}
function methodToCompletionItem(func, option) {
    var _a, _b, _c, _d;
    return completionItem(func.name, {
        kind: (_a = option === null || option === void 0 ? void 0 : option.kind) !== null && _a !== void 0 ? _a : vscode.CompletionItemKind.Method,
        source: (_b = option === null || option === void 0 ? void 0 : option.source) !== null && _b !== void 0 ? _b : func.source,
        code: (_c = option === null || option === void 0 ? void 0 : option.code) !== null && _c !== void 0 ? _c : func.origin,
        documentation: (_d = option === null || option === void 0 ? void 0 : option.documentation) !== null && _d !== void 0 ? _d : (() => {
            const contents = func.getContents();
            func.getParams().forEach((param) => {
                if (func.takes.findIndex((take) => take.name == param.id) != -1) {
                    contents.push(`\n***@param*** **${param.id}** *${param.descript}*`);
                }
            });
            return contents;
        })(),
        orderString: option === null || option === void 0 ? void 0 : option.orderString,
        detial: option === null || option === void 0 ? void 0 : option.detial
    });
}
function memberToCompletionItem(member, option) {
    var _a, _b, _c, _d;
    return completionItem(member.name, {
        kind: (_a = option === null || option === void 0 ? void 0 : option.kind) !== null && _a !== void 0 ? _a : vscode.CompletionItemKind.EnumMember,
        source: (_b = option === null || option === void 0 ? void 0 : option.source) !== null && _b !== void 0 ? _b : member.source,
        code: (_c = option === null || option === void 0 ? void 0 : option.code) !== null && _c !== void 0 ? _c : member.origin,
        documentation: (_d = option === null || option === void 0 ? void 0 : option.documentation) !== null && _d !== void 0 ? _d : member.getContents(),
        orderString: option === null || option === void 0 ? void 0 : option.orderString,
        detial: option === null || option === void 0 ? void 0 : option.detial
    });
}
function globalToCompletionItem(global, option) {
    var _a, _b, _c, _d;
    return completionItem(global.name, {
        kind: ((_a = option === null || option === void 0 ? void 0 : option.kind) !== null && _a !== void 0 ? _a : global.isConstant) ? vscode.CompletionItemKind.Constant : vscode.CompletionItemKind.Variable,
        source: (_b = option === null || option === void 0 ? void 0 : option.source) !== null && _b !== void 0 ? _b : global.source,
        code: (_c = option === null || option === void 0 ? void 0 : option.code) !== null && _c !== void 0 ? _c : global.origin,
        documentation: (_d = option === null || option === void 0 ? void 0 : option.documentation) !== null && _d !== void 0 ? _d : global.getContents(),
        orderString: option === null || option === void 0 ? void 0 : option.orderString,
        detial: option === null || option === void 0 ? void 0 : option.detial
    });
}
function localToCompletionItem(local, option) {
    var _a, _b, _c, _d;
    return completionItem(local.name, {
        kind: (_a = option === null || option === void 0 ? void 0 : option.kind) !== null && _a !== void 0 ? _a : vscode.CompletionItemKind.Variable,
        source: (_b = option === null || option === void 0 ? void 0 : option.source) !== null && _b !== void 0 ? _b : local.source,
        code: (_c = option === null || option === void 0 ? void 0 : option.code) !== null && _c !== void 0 ? _c : local.origin,
        documentation: (_d = option === null || option === void 0 ? void 0 : option.documentation) !== null && _d !== void 0 ? _d : local.getContents(),
        orderString: option === null || option === void 0 ? void 0 : option.orderString,
        detial: option === null || option === void 0 ? void 0 : option.detial
    });
}
function takeToCompletionItem(take, option) {
    var _a, _b;
    return completionItem(take.name, {
        kind: (_a = option === null || option === void 0 ? void 0 : option.kind) !== null && _a !== void 0 ? _a : vscode.CompletionItemKind.Property,
        source: option === null || option === void 0 ? void 0 : option.source,
        code: (_b = option === null || option === void 0 ? void 0 : option.code) !== null && _b !== void 0 ? _b : take.origin,
        documentation: option === null || option === void 0 ? void 0 : option.documentation,
        orderString: option === null || option === void 0 ? void 0 : option.orderString,
        detial: option === null || option === void 0 ? void 0 : option.detial
    });
}
function structToCompletionItem(struct, option) {
    var _a, _b, _c, _d, _e;
    return completionItem(struct.name, {
        kind: (_a = option === null || option === void 0 ? void 0 : option.kind) !== null && _a !== void 0 ? _a : vscode.CompletionItemKind.Class,
        source: (_b = option === null || option === void 0 ? void 0 : option.source) !== null && _b !== void 0 ? _b : struct.source,
        code: (_c = option === null || option === void 0 ? void 0 : option.code) !== null && _c !== void 0 ? _c : struct.origin,
        documentation: (_d = option === null || option === void 0 ? void 0 : option.documentation) !== null && _d !== void 0 ? _d : struct.getContents(),
        orderString: option === null || option === void 0 ? void 0 : option.orderString,
        detial: (_e = option === null || option === void 0 ? void 0 : option.detial) !== null && _e !== void 0 ? _e : struct.name
    });
}
vscode.languages.registerCompletionItemProvider("jass", new class JassComplation {
    provideCompletionItems(document, position, token, context) {
        const items = new Array();
        const fsPath = document.uri.fsPath;
        const isZincExt = tool_1.isZincFile(fsPath);
        if (!isZincExt) {
            data_1.parseContent(fsPath, document.getText());
            if (!options_1.Options.isOnlyJass) {
                if (options_1.Options.supportZinc) {
                    data_1.parseZincContent(fsPath, document.getText());
                }
            }
        }
        const fieldLibrarys = () => {
            const librarys = [];
            if (!options_1.Options.isOnlyJass) {
                librarys.push(...data_1.default.librarys());
                if (options_1.Options.supportZinc) {
                    librarys.push(...data_1.default.zincLibrarys());
                }
            }
            return librarys;
        };
        const fieldFunctions = () => {
            const funcs = data_1.default.functions();
            if (!options_1.Options.isOnlyJass) {
                const requires = [];
                data_1.default.librarys().filter((library) => {
                    if (tool_1.compare(library.source, fsPath) && library.loc.contains(tool_2.convertPosition(position))) {
                        requires.push(...library.requires);
                        funcs.push(...library.functions);
                        return false;
                    }
                    return true;
                }).forEach((library) => {
                    if (requires.includes(library.name)) {
                        funcs.push(...library.functions.filter((func) => func.tag != "private"));
                    }
                });
                if (options_1.Options.supportZinc) {
                    data_1.default.zincLibrarys().filter((library) => {
                        if (tool_1.compare(library.source, fsPath) && library.loc.contains(tool_2.convertPosition(position))) {
                            requires.push(...library.requires);
                            funcs.push(...library.functions);
                            return false;
                        }
                        return true;
                    }).forEach((library) => {
                        if (requires.includes(library.name)) {
                            funcs.push(...library.functions.filter((func) => func.tag != "private"));
                        }
                    });
                }
            }
            return funcs;
        };
        const fieldGlobals = () => {
            const globals = data_1.default.globals();
            data_1.default.functions().forEach((func) => {
                if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                    globals.push(...func.getGlobals());
                }
            });
            if (!options_1.Options.isOnlyJass) {
                const requires = [];
                data_1.default.librarys().filter((library) => {
                    if (tool_1.compare(library.source, fsPath) && library.loc.contains(tool_2.convertPosition(position))) {
                        requires.push(...library.requires);
                        globals.push(...library.globals);
                        return false;
                    }
                    return true;
                }).forEach((library) => {
                    if (requires.includes(library.name)) {
                        globals.push(...library.globals.filter((func) => func.tag != "private"));
                    }
                });
                data_1.default.libraryFunctions().forEach((func) => {
                    if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                        globals.push(...func.getGlobals());
                    }
                });
                if (options_1.Options.supportZinc) {
                    data_1.default.zincLibrarys().filter((library) => {
                        if (tool_1.compare(library.source, fsPath) && library.loc.contains(tool_2.convertPosition(position))) {
                            requires.push(...library.requires);
                            globals.push(...library.globals);
                            return false;
                        }
                        return true;
                    }).forEach((library) => {
                        if (requires.includes(library.name)) {
                            globals.push(...library.globals.filter((func) => func.tag != "private"));
                        }
                    });
                    data_1.default.zincLibraryFunctions().forEach((func) => {
                        if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                            globals.push(...func.getGlobals());
                        }
                    });
                }
            }
            return globals;
        };
        const fieldTakes = () => {
            const takes = [];
            data_1.default.functions().forEach((func) => {
                if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                    takes.push(...func.takes.map((take) => {
                        return { take, func };
                    }));
                }
            });
            if (!options_1.Options.isOnlyJass) {
                data_1.default.libraryFunctions().forEach((func) => {
                    if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                        takes.push(...func.takes.map((take) => {
                            return { take, func };
                        }));
                    }
                });
                if (options_1.Options.supportZinc) {
                    data_1.default.zincLibraryFunctions().forEach((func) => {
                        if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                            takes.push(...func.takes.map((take) => {
                                return { take, func };
                            }));
                        }
                    });
                }
            }
            return takes;
        };
        const fieldLocals = () => {
            const locals = [];
            data_1.default.functions().forEach((func) => {
                if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                    locals.push(...func.locals);
                }
            });
            if (!options_1.Options.isOnlyJass) {
                data_1.default.libraryFunctions().forEach((func) => {
                    if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                        locals.push(...func.locals);
                    }
                });
                if (options_1.Options.supportZinc) {
                    data_1.default.zincLibraryFunctions().forEach((func) => {
                        if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                            locals.push(...func.locals);
                        }
                    });
                }
            }
            return locals;
        };
        const fieldStructs = () => {
            const structs = data_1.default.structs();
            if (!options_1.Options.isOnlyJass) {
                const requires = [];
                data_1.default.librarys().filter((library) => {
                    if (tool_1.compare(library.source, fsPath) && library.loc.contains(tool_2.convertPosition(position))) {
                        requires.push(...library.requires);
                        structs.push(...library.structs);
                        return false;
                    }
                    return true;
                }).forEach((library) => {
                    if (requires.includes(library.name)) {
                        structs.push(...library.structs.filter((struct) => struct.tag != "private"));
                    }
                });
                if (options_1.Options.supportZinc) {
                    data_1.default.zincLibrarys().filter((library) => {
                        if (tool_1.compare(library.source, fsPath) && library.loc.contains(tool_2.convertPosition(position))) {
                            requires.push(...library.requires);
                            structs.push(...library.structs);
                            return false;
                        }
                        return true;
                    }).forEach((library) => {
                        if (requires.includes(library.name)) {
                            structs.push(...library.structs.filter((struct) => struct.tag != "private"));
                        }
                    });
                }
            }
            return structs;
        };
        const postionLibrarys = (current, requireCallback) => {
            const requires = [];
            return data_1.default.librarys().filter((library) => {
                if (tool_1.compare(library.source, fsPath) && library.loc.contains(tool_2.convertPosition(position))) {
                    requires.push(...library.requires);
                    current(library);
                    return false;
                }
                return true;
            }).forEach((library) => {
                if (requires.includes(library.name)) {
                    requireCallback(library);
                    return true;
                }
            });
        };
        const findFunctionByName = (name) => {
            const funcs = [...data_1.default.functions(), ...data_1.default.natives()];
            if (!options_1.Options.isOnlyJass) {
                postionLibrarys((library) => {
                    library.functions.forEach((func) => {
                        funcs.push(func);
                    });
                }, (library) => {
                    library.functions.filter((func) => func.tag != "private").forEach((func) => {
                        funcs.push(func);
                    });
                });
            }
            return funcs.filter((func) => func.name == name);
        };
        function structTypeItems() {
            return [...data_1.default.structs(), ...data_1.default.libraryStructs(), ...data_1.default.zincLibraryStructs()].map((struct) => {
                return structToCompletionItem(struct);
            });
        }
        const type = PositionTool.is(document, position);
        switch (type) {
            case PositionType.FuncNaming:
            case PositionType.TakesNaming:
            case PositionType.TakesNaming:
                return null;
            case PositionType.LocalNaming:
                items.push(ArrayKeywordItem);
            case PositionType.Set:
                fieldGlobals().filter((global) => !global.isConstant).forEach((global) => {
                    items.push(globalToCompletionItem(global));
                });
                fieldLocals().forEach((local) => {
                    items.push(localToCompletionItem(local));
                });
                fieldTakes().forEach((funcTake, index) => {
                    items.push(takeToCompletionItem(funcTake.take, {
                        source: funcTake.func.source,
                        documentation: funcTake.func.getParams().map((param) => {
                            if (param.id == funcTake.take.name) {
                                return `*${param.descript}*`;
                            }
                            return `*${param.descript}*`;
                        }),
                        orderString: `${index}`
                    }));
                });
                break;
            case PositionType.Returns:
                items.push(...typeItems, NothingItem, ...structTypeItems());
                return items;
            case PositionType.LocalType:
                items.push(...typeItems, ...structTypeItems());
                break;
            case PositionType.ConstantType:
                items.push(...typeItems);
                return items;
            case PositionType.TakesFirstType:
                items.push(...typeItems, NothingItem, CodeItem, ...structTypeItems());
                return items;
            case PositionType.TakesOtherType:
                items.push(...typeItems, CodeItem, ...structTypeItems());
                return items;
            case PositionType.TakesKeyword:
                items.push(TakesKeywordItem);
                return items;
            case PositionType.ReturnKeyword:
                items.push(ReturnsKeywordItem);
                return items;
            case PositionType.ReturnKeyword:
                items.push(ReturnsKeywordItem);
                return items;
            case PositionType.Requires:
                fieldLibrarys().forEach((library) => {
                    items.push(libraryToCompletionItem(library));
                });
                break;
            case PositionType.Assign:
                const lineText = document.lineAt(position.line);
                const inputText = lineText.text.substring(lineText.firstNonWhitespaceCharacterIndex, position.character);
                const result = /local\s+(?<type>[a-zA-Z]+[a-zA-Z0-9_]*)\b/.exec(inputText);
                if (result && result.groups) {
                    const type = result.groups["type"];
                    [...data_1.default.natives(), ...fieldFunctions()].filter((func) => {
                        return type == func.returns || types_1.getParentTypes(type).includes(func.returns);
                    }).forEach((func) => {
                        items.push(funcToCompletionItem(func));
                    });
                    fieldGlobals().filter((global) => {
                        return type == global.type || types_1.getParentTypes(type).includes(global.type);
                    }).forEach((global) => {
                        items.push(globalToCompletionItem(global));
                    });
                    fieldLocals().filter((local) => {
                        return type == local.type || types_1.getParentTypes(type).includes(local.type);
                    }).forEach((local) => {
                        items.push(localToCompletionItem(local));
                    });
                    fieldTakes().filter((funcTake) => {
                        return type == funcTake.take.type || types_1.getParentTypes(type).includes(funcTake.take.type);
                    }).forEach((funcTake, index) => {
                        items.push(takeToCompletionItem(funcTake.take, {
                            source: funcTake.func.source,
                            documentation: funcTake.func.getParams().map((param) => {
                                if (param.id == funcTake.take.name) {
                                    return `*${param.descript}*`;
                                }
                                return `*${param.descript}*`;
                            }),
                            orderString: `${index}`
                        }));
                    });
                }
                break;
            case PositionType.Call:
                [...data_1.default.natives(), ...fieldFunctions()].forEach((func) => {
                    items.push(funcToCompletionItem(func));
                });
                break;
            case PositionType.Args:
                const key = tool_2.functionKey(document, position);
                const funcs = findFunctionByName(key.keys[0]);
                funcs.forEach((func) => {
                    if (func.takes[key.takeIndex]) {
                        const type = func.takes[key.takeIndex].type;
                        [...data_1.default.natives(), ...fieldFunctions()].filter((func) => {
                            return type == func.returns || types_1.getParentTypes(type).includes(func.returns);
                        }).forEach((func) => {
                            items.push(funcToCompletionItem(func));
                        });
                        fieldGlobals().filter((global) => {
                            return type == global.type || types_1.getParentTypes(type).includes(global.type);
                        }).forEach((global) => {
                            items.push(globalToCompletionItem(global));
                        });
                        fieldLocals().filter((local) => {
                            return type == local.type || types_1.getParentTypes(type).includes(local.type);
                        }).forEach((local) => {
                            items.push(localToCompletionItem(local));
                        });
                        fieldTakes().filter((funcTake) => {
                            return type == funcTake.take.type || types_1.getParentTypes(type).includes(funcTake.take.type);
                        }).forEach((funcTake, index) => {
                            items.push(takeToCompletionItem(funcTake.take, {
                                source: funcTake.func.source,
                                documentation: funcTake.func.getParams().map((param) => {
                                    if (param.id == funcTake.take.name) {
                                        return `*${param.descript}*`;
                                    }
                                    return `*${param.descript}*`;
                                }),
                                orderString: `${index}`
                            }));
                        });
                    }
                });
                break;
            default:
                items.push(...typeItems, ...structTypeItems());
                items.push(...keywordItems);
                [...data_1.default.natives(), ...fieldFunctions()].forEach((func) => {
                    items.push(funcToCompletionItem(func));
                });
        }
        if (!isZincExt) {
        }
        return items;
    }
});
class Gc {
    constructor(type, gc) {
        this.type = type;
        this.gc = gc;
    }
}
const RecoverableTypes = [
    new Gc("boolexpr", (name) => {
        return `call DestroyBoolExpr(${name})\nset ${name} = null`;
    }),
    new Gc("commandbuttoneffect", (name) => {
        return `call DestroyCommandButtonEffect(${name})\nset ${name} = null`;
    }),
    new Gc("condition", (name) => {
        return `call DestroyCondition(${name})\nset ${name} = null`;
    }),
    new Gc("effect", (name) => {
        return `call DestroyEffect(${name})\nset ${name} = null`;
    }),
    new Gc("force", (name) => {
        return `call DestroyForce(${name})\nset ${name} = null`;
    }),
    new Gc("group", (name) => {
        return `call DestroyGroup(${name})\nset ${name} = null`;
    }),
    new Gc("image", (name) => {
        return `call DestroyImage(${name})\nset ${name} = null`;
    }),
    new Gc("itempool", (name) => {
        return `call DestroyItemPool(${name})\nset ${name} = null`;
    }),
    new Gc("leaderboard", (name) => {
        return `call DestroyLeaderboard(${name})\nset ${name} = null`;
    }),
    new Gc("lightning", (name) => {
        return `call DestroyLightning(${name})\nset ${name} = null`;
    }),
    new Gc("quest", (name) => {
        return `call DestroyQuest(${name})\nset ${name} = null`;
    }),
    new Gc("timer", (name) => {
        return `call DestroyTimer(${name})\nset ${name} = null`;
    }),
    new Gc("trigger", (name) => {
        return `call DestroyTrigger(${name})\nset ${name} = null`;
    }),
    new Gc("ubersplat", (name) => {
        return `call DestroyUbersplat(${name})\nset ${name} = null`;
    }),
    new Gc("unitpool", (name) => {
        return `call DestroyUnitPool(${name})\nset ${name} = null`;
    }),
    new Gc("framehandle", (name) => {
        return `call BlzDestroyFrame(${name})\nset ${name} = null`;
    }),
    new Gc("dialog", (name) => {
        return `call DialogDestroy(${name})\nset ${name} = null`;
    }),
    new Gc("location", (name) => {
        return `call RemoveLocation(${name})\nset ${name} = null`;
    }),
    new Gc("integer", (name) => {
        return `set ${name} = 0`;
    }),
    new Gc("real", (name) => {
        return `set ${name} = 0.0`;
    }),
    new Gc("string", (name) => {
        return `set ${name} = null`;
    }),
    new Gc("multiboard", (name) => {
        return `call DestroyMultiboard(${name})\nset ${name} = null`;
    }),
];
const defaultGc = new Gc("", (name) => {
    return `set ${name} = null`;
});
vscode.languages.registerCompletionItemProvider("jass", new class GcCompletionItemProvider {
    provideCompletionItems(document, position, token, context) {
        const items = [];
        data_1.default.programs().forEach((program) => {
            if (document.uri.fsPath == program.source) {
                program.functions.forEach(func => {
                    if (new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position).contains(position)) {
                        const item = new vscode.CompletionItem("gc", vscode.CompletionItemKind.Unit);
                        const localGcString = func.locals.map(local => {
                            const gc = RecoverableTypes.find((gc) => gc.type == local.type);
                            return gc ? gc.gc(local.name) : defaultGc.gc(local.name);
                        }).join("\n");
                        const takesGcString = func.takes.map(take => {
                            const gc = RecoverableTypes.find((gc) => gc.type == take.type);
                            return gc ? gc.gc(take.name) : defaultGc.gc(take.name);
                        }).join("\n");
                        item.documentation = new vscode.MarkdownString().appendText("自动排泄\n").appendCodeblock(`function auto_gc take nothing returns nothing\n\tlocal unit u = null\n\t// gc automatic excretion is output at the end of the function\n\tgc\nendfunction`);
                        item.insertText = `${localGcString}\n${takesGcString}`;
                        items.push(item);
                    }
                });
            }
        });
        return items;
    }
}());
vscode.languages.registerCompletionItemProvider("jass", new class TypeCompletionItemProvider {
    provideCompletionItems(document, position, token, context) {
        const text = document.lineAt(position.line).text;
        if (/^\s*\/\//.test(text))
            return;
        const items = [];
        const fsPath = document.uri.fsPath;
        const tokens = tokens_1.tokenize(text.substring(0, position.character)).reverse();
        const ids = [];
        let argc = 0;
        let field = 0;
        let state = 0;
        for (let index = 0; index < tokens.length; index++) {
            const token = tokens[index];
            if (state == 0) {
                if (token.isOp() && token.value == ".") {
                    state = 1;
                }
                else if (token.isId()) {
                    ids.push(token.value);
                    state = 2;
                }
                else
                    break;
            }
            else if (state == 1) {
                if (token.isId()) {
                    ids.push(token.value);
                    state = 2;
                }
                else
                    break;
            }
            else if (state == 2) {
                if (token.isOp() && token.value == ".") {
                    state = 1;
                }
                else
                    break;
            }
        }
        if (ids.length != 1 && ids.length != 2) {
            return null;
        }
        ids.reverse();
        const fieldFunctions = () => {
            const funcs = data_1.default.functions();
            if (!options_1.Options.isOnlyJass) {
                const requires = [];
                data_1.default.librarys().filter((library) => {
                    if (tool_1.compare(library.source, fsPath) && library.loc.contains(tool_2.convertPosition(position))) {
                        requires.push(...library.requires);
                        funcs.push(...library.functions);
                        return false;
                    }
                    return true;
                }).forEach((library) => {
                    if (requires.includes(library.name)) {
                        funcs.push(...library.functions.filter((func) => func.tag != "private"));
                    }
                });
                if (options_1.Options.supportZinc) {
                    data_1.default.zincLibrarys().filter((library) => {
                        if (tool_1.compare(library.source, fsPath) && library.loc.contains(tool_2.convertPosition(position))) {
                            requires.push(...library.requires);
                            funcs.push(...library.functions);
                            return false;
                        }
                        return true;
                    }).forEach((library) => {
                        if (requires.includes(library.name)) {
                            funcs.push(...library.functions.filter((func) => func.tag != "private"));
                        }
                    });
                }
            }
            return funcs;
        };
        const fieldStructs = () => {
            const structs = data_1.default.structs();
            if (!options_1.Options.isOnlyJass) {
                const requires = [];
                data_1.default.librarys().filter((library) => {
                    if (tool_1.compare(library.source, fsPath) && library.loc.contains(tool_2.convertPosition(position))) {
                        requires.push(...library.requires);
                        structs.push(...library.structs);
                        return false;
                    }
                    return true;
                }).forEach((library) => {
                    if (requires.includes(library.name)) {
                        structs.push(...library.structs.filter((struct) => struct.tag != "private"));
                    }
                });
                if (options_1.Options.supportZinc) {
                    data_1.default.zincLibrarys().filter((library) => {
                        if (tool_1.compare(library.source, fsPath) && library.loc.contains(tool_2.convertPosition(position))) {
                            requires.push(...library.requires);
                            structs.push(...library.structs);
                            return false;
                        }
                        return true;
                    }).forEach((library) => {
                        if (requires.includes(library.name)) {
                            structs.push(...library.structs.filter((struct) => struct.tag != "private"));
                        }
                    });
                }
            }
            return structs;
        };
        const fieldTakes = () => {
            const takes = [];
            data_1.default.functions().forEach((func) => {
                if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                    takes.push(...func.takes.map((take) => {
                        return { take, func };
                    }));
                }
            });
            if (!options_1.Options.isOnlyJass) {
                data_1.default.libraryFunctions().forEach((func) => {
                    if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                        takes.push(...func.takes.map((take) => {
                            return { take, func };
                        }));
                    }
                });
                if (options_1.Options.supportZinc) {
                    data_1.default.zincLibraryFunctions().forEach((func) => {
                        if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                            takes.push(...func.takes.map((take) => {
                                return { take, func };
                            }));
                        }
                    });
                }
            }
            return takes;
        };
        const fieldLocals = () => {
            const locals = [];
            data_1.default.functions().forEach((func) => {
                if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                    locals.push(...func.locals);
                }
            });
            if (!options_1.Options.isOnlyJass) {
                data_1.default.libraryFunctions().forEach((func) => {
                    if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                        locals.push(...func.locals);
                    }
                });
                if (options_1.Options.supportZinc) {
                    data_1.default.zincLibraryFunctions().forEach((func) => {
                        if (tool_1.compare(func.source, fsPath) && func.loc.contains(tool_2.convertPosition(position))) {
                            locals.push(...func.locals);
                        }
                    });
                }
            }
            return locals;
        };
        if (ids[0] == "this") {
        }
        else {
            const usebleStructs = fieldStructs();
            const struct = usebleStructs.find((struct, index, structs) => {
                return struct.name == ids[0];
            });
            if (struct) {
                struct.methods.filter((method) => {
                    return method.modifier.includes("static");
                }).forEach((method) => {
                    items.push(methodToCompletionItem(method));
                });
                struct.members.filter((member) => {
                    return member.modifier.includes("static");
                }).forEach((member) => {
                    items.push(memberToCompletionItem(member));
                });
            }
            const usebleLocals = fieldLocals();
            usebleLocals.filter((local) => {
                return local.name == ids[0];
            }).forEach((local) => {
                const struct = usebleStructs.find((struct, index, structs) => {
                    return struct.name == local.type;
                });
                if (struct) {
                    console.log(struct);
                    struct.methods.filter((method) => {
                        return !method.modifier.includes("static");
                    }).forEach((method) => {
                        items.push(methodToCompletionItem(method));
                    });
                    struct.members.filter((member) => {
                        return !member.modifier.includes("static");
                    }).forEach((member) => {
                        items.push(memberToCompletionItem(member));
                    });
                }
            });
        }
        return items;
    }
}(), ".", ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
