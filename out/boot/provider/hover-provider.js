"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const types_1 = require("./types");
const keyword_1 = require("./keyword");
const options_1 = require("./options");
const data_1 = require("./data");
const tool_1 = require("../tool");
const tool_2 = require("./tool");
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
        const hovers = [];
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
        [...fieldFunctions(), ...data_1.default.natives()].forEach((func) => {
            if (key == func.name) {
                const ms = new vscode.MarkdownString();
                ms.appendMarkdown(`#### ${func.name}`);
                ms.appendText("\n");
                func.getContents().forEach((content) => {
                    ms.appendText(content);
                });
                func.getParams().forEach((param) => {
                    if (func.takes.findIndex((take) => take.name == param.id) != -1) {
                        ms.appendText("\n");
                        ms.appendMarkdown(`***@param*** **${param.id}** *${param.descript}*`);
                    }
                });
                ms.appendText("\n");
                ms.appendCodeblock(func.origin);
                hovers.push(ms);
            }
        });
        fieldGlobals().forEach((global) => {
            if (key == global.name) {
                const ms = new vscode.MarkdownString();
                ms.appendMarkdown(`#### ${global.name}`);
                ms.appendText("\n");
                global.getContents().forEach((content) => {
                    ms.appendText(content);
                });
                ms.appendText("\n");
                ms.appendCodeblock(global.origin);
                hovers.push(ms);
            }
        });
        fieldLocals().forEach((local) => {
            if (key == local.name) {
                const ms = new vscode.MarkdownString();
                ms.appendMarkdown(`#### ${local.name}`);
                ms.appendText("\n");
                local.getContents().forEach((content) => {
                    ms.appendText(content);
                });
                ms.appendText("\n");
                ms.appendCodeblock(local.origin);
                hovers.push(ms);
            }
        });
        fieldTakes().forEach((funcTake) => {
            if (key == funcTake.take.name) {
                const ms = new vscode.MarkdownString();
                ms.appendMarkdown(`#### ${funcTake.take.name}`);
                ms.appendText("\n");
                funcTake.func.getParams().forEach((param) => {
                    if (param.id == funcTake.take.name) {
                        ms.appendText(param.descript);
                    }
                });
                ms.appendText("\n");
                ms.appendCodeblock(funcTake.take.origin);
                hovers.push(ms);
            }
        });
        fieldStructs().forEach((struct) => {
            if (key == struct.name) {
                const ms = new vscode.MarkdownString();
                ms.appendMarkdown(`#### ${struct.name}`);
                ms.appendText("\n");
                struct.getContents().forEach((content) => {
                    ms.appendText(content);
                });
                ms.appendText("\n");
                ms.appendCodeblock(struct.origin);
                hovers.push(ms);
            }
        });
        fieldLibrarys().forEach((library) => {
            if (key == library.name) {
                const ms = new vscode.MarkdownString();
                ms.appendMarkdown(`#### ${library.name}`);
                ms.appendText("\n");
                library.getContents().forEach((content) => {
                    ms.appendText(content);
                });
                ms.appendText("\n");
                ms.appendCodeblock(library.origin);
                hovers.push(ms);
            }
        });
        return new vscode.Hover([...hovers]);
    }
}
vscode.languages.registerHoverProvider("jass", new HoverProvider());
