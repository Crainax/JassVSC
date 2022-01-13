"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const data_1 = require("./data");
const jassAst = require("../jass/ast");
const types_1 = require("./types");
const keyword_1 = require("./keyword");
class HoverProvider {
    constructor() {
        this._maxLength = 526;
        this.isNumber = function (val) {
            var regPos = /^\d+(\.\d+)?$/;
            var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
            if (regPos.test(val) || regNeg.test(val)) {
                return true;
            }
            else {
                return false;
            }
        };
    }
    all(document, position) {
        const contents = [];
        contents.push(...data_1.commonJProgram.natives, ...data_1.commonJProgram.functions, ...data_1.commonJProgram.globals);
        contents.push(...data_1.commonAiProgram.natives, ...data_1.commonAiProgram.functions, ...data_1.commonAiProgram.globals);
        contents.push(...data_1.blizzardJProgram.natives, ...data_1.blizzardJProgram.functions, ...data_1.blizzardJProgram.globals);
        contents.push(...data_1.dzApiJProgram.natives, ...data_1.dzApiJProgram.functions, ...data_1.dzApiJProgram.globals);
        data_1.JassMap.forEach((program, path) => {
            contents.push(...program.natives, ...program.functions, ...program.globals);
            if (path == document.uri.fsPath) {
                program.functions.forEach((func) => {
                    if (new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position).contains(position)) {
                        contents.push(...func.locals);
                        contents.push(...func.takes);
                    }
                });
            }
        });
        data_1.VjassMap.forEach((program, path) => {
            program.librarys.forEach((library) => {
                contents.push(...library.functions);
                contents.push(...library.globals);
                library.structs.forEach((struct) => {
                    contents.push(struct);
                    contents.push(...struct.methods);
                });
                if (path == document.uri.fsPath) {
                    library.functions.forEach((func) => {
                        if (new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position).contains(position)) {
                            contents.push(...func.locals);
                            contents.push(...func.takes);
                        }
                    });
                    library.structs.forEach((struct) => {
                        if (new vscode.Range(struct.loc.start.line, struct.loc.start.position, struct.loc.end.line, struct.loc.end.position).contains(position)) {
                            contents.push(...struct.members);
                            contents.push(...struct.methods);
                            struct.methods.forEach((method) => {
                                if (new vscode.Range(method.loc.start.line, method.loc.start.position, method.loc.end.line, method.loc.end.position).contains(position)) {
                                    contents.push(...method.locals);
                                    contents.push(...method.takes);
                                }
                            });
                        }
                    });
                }
            });
        });
        data_1.ZincMap.forEach((program, path) => {
            program.librarys.forEach((library) => {
                contents.push(...library.functions);
                contents.push(...library.globals);
                library.structs.forEach((struct) => {
                    contents.push(struct);
                    contents.push(...struct.methods);
                });
                if (path == document.uri.fsPath) {
                    library.functions.forEach((func) => {
                        if (new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position).contains(position)) {
                            contents.push(...func.locals);
                            contents.push(...func.takes);
                        }
                    });
                    library.structs.forEach((struct) => {
                        if (new vscode.Range(struct.loc.start.line, struct.loc.start.position, struct.loc.end.line, struct.loc.end.position).contains(position)) {
                            contents.push(...struct.members);
                            contents.push(...struct.methods);
                            struct.methods.forEach((method) => {
                                if (new vscode.Range(method.loc.start.line, method.loc.start.position, method.loc.end.line, method.loc.end.position).contains(position)) {
                                    contents.push(...method.locals);
                                    contents.push(...method.takes);
                                }
                            });
                        }
                    });
                }
            });
        });
        return contents;
    }
    provideHover(document, position, token) {
        const key = document.getText(document.getWordRangeAtPosition(position));
        if (key.length > this._maxLength) {
            return null;
        }
        if (this.isNumber(key)) {
            return null;
        }
        if (keyword_1.AllKeywords.includes(key)) {
            return null;
        }
        const type = types_1.Types.find(type => type === key);
        if (type) {
            const markdownString = new vscode.MarkdownString().appendCodeblock(type);
            return new vscode.Hover(markdownString);
        }
        const hovers = [];
        this.all(document, position).forEach(expr => {
            if (key == expr.name) {
                const ms = new vscode.MarkdownString(expr.name);
                if (expr instanceof jassAst.Take) {
                    ms.appendText("");
                }
                else {
                    ms.appendText("\n" + expr.text);
                }
                ms.appendCodeblock(expr.origin);
                hovers.push(ms);
            }
        });
        return new vscode.Hover([...hovers]);
    }
}
vscode.languages.registerHoverProvider("jass", new HoverProvider());
