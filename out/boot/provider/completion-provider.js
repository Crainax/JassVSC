"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const types_1 = require("./types");
const type_desc_1 = require("./type-desc");
const keyword_1 = require("./keyword");
const data_1 = require("./data");
const options_1 = require("./options");
const jassParse = require("../jass/parse");
const zincParse = require("../zinc/parse");
const vjassParse = require("../vjass/parse");
const tool_1 = require("../tool");
const tool_2 = require("./tool");
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
function zincProgramToItem(document, position, key, program) {
    const items = new Array();
    program.librarys.forEach((library) => {
        const currentFunctionItems = library.functions.map(func => {
            const item = new vscode.CompletionItem(`${func.name}`, vscode.CompletionItemKind.Function);
            item.detail = func.name;
            item.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${func.text}`).appendCodeblock(func.origin);
            if (document.uri.fsPath == key) {
                if (new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position).contains(position)) {
                    func.locals.forEach(local => {
                        const item = new vscode.CompletionItem(local.name, vscode.CompletionItemKind.Property);
                        item.documentation = new vscode.MarkdownString().appendText(`\n${local.text}`).appendCodeblock(local.origin);
                        item.sortText = "_";
                        items.push(item);
                    });
                    func.takes.forEach(take => {
                        const item = new vscode.CompletionItem(take.name, vscode.CompletionItemKind.Property);
                        item.documentation = new vscode.MarkdownString().appendCodeblock(take.origin);
                        item.sortText = "_";
                        items.push(item);
                    });
                }
            }
            return item;
        });
        const currentGlobalItems = library.globals.map(global => {
            const item = new vscode.CompletionItem(`${global.name}`, global.isConstant ? vscode.CompletionItemKind.Constant : vscode.CompletionItemKind.Variable);
            item.detail = global.name;
            item.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${global.text}`).appendCodeblock(global.origin);
            return item;
        });
        library.structs.forEach((struct) => {
            const structItem = new vscode.CompletionItem(struct.name, vscode.CompletionItemKind.Struct);
            structItem.detail = struct.name;
            structItem.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${struct.text}`).appendCodeblock(struct.origin);
            if (new vscode.Range(new vscode.Position(struct.loc.start.line, struct.loc.start.position), new vscode.Position(struct.loc.end.line, struct.loc.end.position)).contains(position)) {
                struct.members.forEach(member => {
                    const memberItem = new vscode.CompletionItem(member.name, vscode.CompletionItemKind.Property);
                    memberItem.detail = member.name;
                    memberItem.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${member.text}`).appendCodeblock(member.origin);
                    items.push(memberItem);
                });
                struct.methods.forEach(method => {
                    const methodItem = new vscode.CompletionItem(method.name, vscode.CompletionItemKind.Method);
                    methodItem.detail = method.name;
                    methodItem.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${method.text}`).appendCodeblock(method.origin);
                    items.push(methodItem);
                    if (new vscode.Range(new vscode.Position(method.loc.start.line, method.loc.start.position), new vscode.Position(method.loc.end.line, method.loc.end.position)).contains(position)) {
                        method.takes.forEach(take => {
                            const takeItem = new vscode.CompletionItem(take.name, vscode.CompletionItemKind.Variable);
                            takeItem.detail = take.name;
                            takeItem.documentation = new vscode.MarkdownString().appendCodeblock(take.origin);
                            items.push(takeItem);
                        });
                    }
                });
                items.push(structItem);
            }
        });
        items.push(...currentGlobalItems);
        items.push(...currentFunctionItems);
    });
    return items;
}
function vjassProgramToItem(document, position, key, program) {
    const items = new Array();
    program.librarys.forEach((library) => {
        const currentFunctionItems = library.functions.map(func => {
            const item = new vscode.CompletionItem(`${func.name}`, vscode.CompletionItemKind.Function);
            item.detail = func.name;
            item.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${func.text}`).appendCodeblock(func.origin);
            if (document.uri.fsPath == key) {
                if (new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position).contains(position)) {
                    func.locals.forEach(local => {
                        const item = new vscode.CompletionItem(local.name, vscode.CompletionItemKind.Property);
                        item.documentation = new vscode.MarkdownString().appendText(`\n${local.text}`).appendCodeblock(local.origin);
                        item.sortText = "_";
                        items.push(item);
                    });
                    func.takes.forEach(take => {
                        const item = new vscode.CompletionItem(take.name, vscode.CompletionItemKind.Property);
                        item.documentation = new vscode.MarkdownString().appendCodeblock(take.origin);
                        item.sortText = "_";
                        items.push(item);
                    });
                }
            }
            return item;
        });
        const currentGlobalItems = library.globals.map(global => {
            const item = new vscode.CompletionItem(`${global.name}`, global.isConstant ? vscode.CompletionItemKind.Constant : vscode.CompletionItemKind.Variable);
            item.detail = global.name;
            item.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${global.text}`).appendCodeblock(global.origin);
            return item;
        });
        library.structs.forEach((struct) => {
            const structItem = new vscode.CompletionItem(struct.name, vscode.CompletionItemKind.Struct);
            structItem.detail = struct.name;
            structItem.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${struct.text}`).appendCodeblock(struct.origin);
            if (new vscode.Range(new vscode.Position(struct.loc.start.line, struct.loc.start.position), new vscode.Position(struct.loc.end.line, struct.loc.end.position)).contains(position)) {
                struct.members.forEach(member => {
                    const memberItem = new vscode.CompletionItem(member.name, vscode.CompletionItemKind.Property);
                    memberItem.detail = member.name;
                    memberItem.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${member.text}`).appendCodeblock(member.origin);
                    items.push(memberItem);
                });
                struct.methods.forEach(method => {
                    const methodItem = new vscode.CompletionItem(method.name, vscode.CompletionItemKind.Method);
                    methodItem.detail = method.name;
                    methodItem.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${method.text}`).appendCodeblock(method.origin);
                    items.push(methodItem);
                    if (new vscode.Range(new vscode.Position(method.loc.start.line, method.loc.start.position), new vscode.Position(method.loc.end.line, method.loc.end.position)).contains(position)) {
                        method.takes.forEach(take => {
                            const takeItem = new vscode.CompletionItem(take.name, vscode.CompletionItemKind.Variable);
                            takeItem.detail = take.name;
                            takeItem.documentation = new vscode.MarkdownString().appendCodeblock(take.origin);
                            items.push(takeItem);
                        });
                    }
                });
                items.push(structItem);
            }
        });
        items.push(...currentGlobalItems);
        items.push(...currentFunctionItems);
    });
    return items;
}
function jassProgramToItem(document, position, key, program) {
    const items = new Array();
    const currentNativeItems = program.natives.map(func => {
        const item = new vscode.CompletionItem(`${func.name}`, vscode.CompletionItemKind.Function);
        item.detail = func.name;
        item.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${func.text}`).appendCodeblock(func.origin);
        return item;
    });
    const currentFunctionItems = program.functions.map(func => {
        const item = new vscode.CompletionItem(`${func.name}`, vscode.CompletionItemKind.Function);
        item.detail = func.name;
        item.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${func.text}`).appendCodeblock(func.origin);
        if (document && position && document.uri.fsPath == key) {
            if (new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position).contains(position)) {
                func.locals.forEach(local => {
                    const item = new vscode.CompletionItem(local.name, vscode.CompletionItemKind.Property);
                    item.documentation = new vscode.MarkdownString().appendText(`\n${local.text}`).appendCodeblock(local.origin);
                    item.sortText = "_";
                    items.push(item);
                });
                func.takes.forEach(take => {
                    const item = new vscode.CompletionItem(take.name, vscode.CompletionItemKind.Property);
                    item.documentation = new vscode.MarkdownString().appendCodeblock(take.origin);
                    item.sortText = "_";
                    items.push(item);
                });
            }
        }
        return item;
    });
    const currentGlobalItems = program.globals.map(global => {
        const item = new vscode.CompletionItem(`${global.name}`, global.isConstant ? vscode.CompletionItemKind.Constant : vscode.CompletionItemKind.Variable);
        item.detail = global.name;
        item.documentation = new vscode.MarkdownString().appendText(`(${tool_1.getPathFileName(key)})\n${global.text}`).appendCodeblock(global.origin);
        return item;
    });
    items.push(...currentGlobalItems);
    items.push(...currentFunctionItems);
    items.push(...currentNativeItems);
    return items;
}
const commonJItems = jassProgramToItem(undefined, undefined, options_1.Options.commonJPath, data_1.commonJProgram);
const commonAiItems = jassProgramToItem(undefined, undefined, options_1.Options.commonAiPath, data_1.commonAiProgram);
const blizzardJItems = jassProgramToItem(undefined, undefined, options_1.Options.blizzardJPath, data_1.blizzardJProgram);
const dzApiJItems = jassProgramToItem(undefined, undefined, options_1.Options.dzApiJPath, data_1.dzApiJProgram);
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
function programFunctionItemByType(program, key, type) {
    const items = new Array();
    const natives = program.natives.filter((native) => native.returns == type).map((native) => {
        return item(native.name, vscode.CompletionItemKind.Function, `(${tool_1.getPathFileName(key)})\n${native.text}`, native.origin);
    });
    const funcs = program.functions.filter((func) => func.returns == type).map((func) => {
        return item(func.name, vscode.CompletionItemKind.Function, `(${tool_1.getPathFileName(key)})\n${func.text}`, func.origin);
    });
    items.push(...natives, ...funcs);
    return items;
}
function programGlobalItemByType(program, key, type) {
    const globals = program.globals.filter((func) => func.type == type).map((global) => {
        return item(global.name, global.isConstant ? vscode.CompletionItemKind.Constant : vscode.CompletionItemKind.Variable, `(${tool_1.getPathFileName(key)})\n${global.text}`, global.origin);
    });
    return globals;
}
function programItemByType(program, key, type) {
    const items = new Array();
    items.push(...programFunctionItemByType(program, key, type), ...programGlobalItemByType(program, key, type));
    return items;
}
function vprogramFunctionItemByType(program, key, type) {
    const funcs = program.librarys.map((library) => library.functions).flat().filter((func) => func.returns == type).map((func) => {
        return item(func.name, vscode.CompletionItemKind.Function, `(${tool_1.getPathFileName(key)})\n${func.text}`, func.origin);
    });
    return funcs;
}
function vprogramGlobalItemByType(program, key, type) {
    const globals = program.librarys.map((library) => library.globals).flat().filter((func) => func.type == type).map((global) => {
        return item(global.name, global.isConstant ? vscode.CompletionItemKind.Constant : vscode.CompletionItemKind.Variable, `(${tool_1.getPathFileName(key)})\n${global.text}`, global.origin);
    });
    return globals;
}
function vprogramItemByType(program, key, type) {
    const items = new Array();
    items.push(...vprogramFunctionItemByType(program, key, type), ...vprogramGlobalItemByType(program, key, type));
    return items;
}
function getHandleTypes() {
    return Object.keys(types_1.TypeExtends).filter(key => {
        const exs = types_1.TypeExtends[key];
        return exs.includes("handle");
    });
}
function typeFunctionAndGlobalItemNonContainExtends(type) {
    if (type === "handle") {
        return [NullKeywordItem];
    }
    const items = new Array();
    const commonJItems = programItemByType(data_1.commonJProgram, options_1.Options.commonJPath, type);
    const commonAiItems = programItemByType(data_1.commonAiProgram, options_1.Options.commonAiPath, type);
    const blizzardJItems = programItemByType(data_1.blizzardJProgram, options_1.Options.blizzardJPath, type);
    const dzApiJItems = programItemByType(data_1.dzApiJProgram, options_1.Options.dzApiJPath, type);
    items.push(...commonJItems, ...commonAiItems, ...blizzardJItems, ...dzApiJItems);
    data_1.JassMap.forEach((program, key) => {
        items.push(...programItemByType(program, key, type));
    });
    data_1.VjassMap.forEach((program, key) => {
        items.push(...vprogramItemByType(program, key, type));
    });
    return items;
}
function typeFunctionAndGlobalItems(type) {
    const items = new Array();
    if (type === "code") {
        type = null;
    }
    items.push(...typeFunctionAndGlobalItemNonContainExtends(type));
    if (type === "integer") {
        items.push(...typeFunctionAndGlobalItemNonContainExtends("real"));
    }
    else if (type === "real") {
        items.push(...typeFunctionAndGlobalItemNonContainExtends("integer"));
    }
    else if (type === "boolean") {
        data_1.findFunctionExcludeReturns(null, "code").forEach((func) => {
            items.push(item(func.name, vscode.CompletionItemKind.Function, `${func.text}`, func.origin));
        });
        data_1.findGlobalExcludeReturns("code").forEach((global) => {
            items.push(item(global.name, global.isConstant ? vscode.CompletionItemKind.Constant : vscode.CompletionItemKind.Variable, `${global.text}`, global.origin));
        });
    }
    else if (type) {
        types_1.getChildrenTypes(type).forEach(childType => {
            items.push(...typeFunctionAndGlobalItemNonContainExtends(childType));
        });
    }
    return items;
}
function setGlobalItems() {
    const items = new Array();
    data_1.getGlobalVariables().forEach((global) => {
        items.push(item(global.name, vscode.CompletionItemKind.Variable, global.text, global.origin));
    });
    return items;
}
function typeGlobalItems(type) {
    var _a;
    const items = new Array();
    if (type === "code") {
        return [];
    }
    items.push(...typeFunctionAndGlobalItemNonContainExtends(type));
    if (type === "integer") {
        items.push(...typeFunctionAndGlobalItemNonContainExtends("real"));
    }
    else if (type === "real") {
        items.push(...typeFunctionAndGlobalItemNonContainExtends("integer"));
    }
    else if (type && type === "handle") {
        getHandleTypes().forEach((type) => {
            items.push(...typeFunctionAndGlobalItemNonContainExtends(type));
        });
    }
    else if (type) {
        (_a = types_1.TypeExtends[type]) === null || _a === void 0 ? void 0 : _a.forEach((extendsName) => {
            items.push(...typeFunctionAndGlobalItemNonContainExtends(extendsName));
        });
    }
    return items;
}
function typeLocalAndTakeItem(document, position, type) {
    const locals = data_1.findLocals(document.uri.fsPath, position.line);
    const takes = data_1.findTakes(document.uri.fsPath, position.line);
    const items = new Array();
    if (locals) {
        locals.filter(local => type === null || local.type == type).forEach(local => {
            items.push(item(local.name, vscode.CompletionItemKind.Variable, local.text, local.origin));
        });
    }
    if (takes) {
        takes.filter(take => type === null || take.type == type).forEach(take => {
            items.push(item(take.name, vscode.CompletionItemKind.Variable, "", take.origin));
        });
    }
    return items;
}
vscode.languages.registerCompletionItemProvider("jass", new class JassComplation {
    provideCompletionItems(document, position, token, context) {
        const items = new Array();
        const fsPath = document.uri.fsPath;
        const isZincExt = tool_1.isZincFile(fsPath);
        if (!isZincExt) {
            if (![options_1.Options.commonJPath, options_1.Options.commonAiPath, options_1.Options.blizzardJPath, options_1.Options.dzApiJPath].includes(fsPath)) {
                const program = jassParse.parse(document.getText(), {
                    needParseLocal: true
                });
                data_1.JassMap.set(fsPath, program);
            }
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
                return [...typeLocalAndTakeItem(document, position, null), ...setGlobalItems()];
            case PositionType.Returns:
                items.push(...typeItems, NothingItem);
                return items;
            case PositionType.LocalType:
            case PositionType.ConstantType:
                items.push(...typeItems);
                return items;
            case PositionType.TakesFirstType:
                items.push(...typeItems, NothingItem, CodeItem);
                return items;
            case PositionType.TakesOtherType:
                items.push(...typeItems, CodeItem);
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
            case PositionType.Assign:
                const lineText = document.lineAt(position.line);
                const inputText = lineText.text.substring(lineText.firstNonWhitespaceCharacterIndex, position.character);
                const result = /local\s+(?<type>[a-zA-Z]+[a-zA-Z0-9_]*)\b/.exec(inputText);
                if (result && result.groups) {
                    const type = result.groups["type"];
                    return [...typeFunctionAndGlobalItems(type), ...typeLocalAndTakeItem(document, position, type)];
                }
                break;
            case PositionType.Call:
                data_1.findFunctionExcludeReturns("code").forEach((func) => {
                    items.push(item(func.name, vscode.CompletionItemKind.Function, `${func.text}`, func.origin));
                });
                return items;
            case PositionType.Args:
                const key = tool_2.functionKey(document, position);
                const func = data_1.findFunctionByName(key.keys[0]);
                if (func && func.takes[key.takeIndex]) {
                    const type = func.takes[key.takeIndex].type;
                    return [...typeFunctionAndGlobalItems(type), ...typeLocalAndTakeItem(document, position, type)];
                }
                break;
        }
        items.push(...typeItems);
        items.push(...keywordItems);
        const isAiExt = tool_1.isAiFile(document.uri.fsPath);
        items.push(...commonJItems);
        if (isAiExt) {
            items.push(...commonAiItems);
        }
        else {
            items.push(...blizzardJItems);
        }
        items.push(...dzApiJItems);
        if (!isZincExt) {
            data_1.JassMap.forEach((program, key) => {
                const currentFunctionItems = program.functions.map(func => {
                    const item = new vscode.CompletionItem(`${func.name}`, vscode.CompletionItemKind.Function);
                    item.detail = func.name;
                    item.documentation = new vscode.MarkdownString().appendText(`${func.text}(${tool_1.getPathFileName(key)})`).appendCodeblock(func.origin);
                    if (document.uri.fsPath == key) {
                        if (new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position).contains(position)) {
                            func.locals.forEach(local => {
                                const item = new vscode.CompletionItem(local.name, vscode.CompletionItemKind.Property);
                                item.documentation = new vscode.MarkdownString().appendText(`\n${local.text}`).appendCodeblock(local.origin);
                                item.sortText = "_";
                                items.push(item);
                            });
                            func.takes.forEach(take => {
                                const item = new vscode.CompletionItem(take.name, vscode.CompletionItemKind.Property);
                                item.documentation = new vscode.MarkdownString().appendCodeblock(take.origin);
                                item.sortText = "_";
                                items.push(item);
                            });
                        }
                    }
                    return item;
                });
                const currentGlobalItems = program.globals.map(global => {
                    const item = new vscode.CompletionItem(`${global.name}`, global.isConstant ? vscode.CompletionItemKind.Constant : vscode.CompletionItemKind.Variable);
                    item.detail = global.name;
                    item.documentation = new vscode.MarkdownString().appendText(`${global.text}(${tool_1.getPathFileName(key)})`).appendCodeblock(global.origin);
                    return item;
                });
                items.push(...currentGlobalItems);
                items.push(...currentFunctionItems);
            });
        }
        if (!options_1.Options.isOnlyJass) {
            const vjassProgram = vjassParse.parse(document.getText());
            data_1.VjassMap.set(document.uri.fsPath, vjassProgram);
            data_1.VjassMap.forEach((program, key) => {
                const vjassItems = vjassProgramToItem(document, position, key, program);
                items.push(...vjassItems);
            });
        }
        if (options_1.Options.supportZinc) {
            const zincProgram = zincParse.parse(document.getText(), isZincExt);
            data_1.ZincMap.set(document.uri.fsPath, zincProgram);
            data_1.ZincMap.forEach((program, key) => {
                const zincItems = zincProgramToItem(document, position, key, program);
                items.push(...zincItems);
            });
        }
        return items;
    }
});
vscode.languages.registerCompletionItemProvider("lua", new class LuaCompletionItemProvider {
    provideCompletionItems(document, position, token, context) {
        return null;
    }
}());
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
        data_1.JassMap.forEach((program, key) => {
            if (document.uri.fsPath == key) {
                program.functions.reverse().forEach(func => {
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
