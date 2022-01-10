"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const keyword_1 = require("./keyword");
const types_1 = require("./types");
const data_1 = require("./data");
const options_1 = require("./options");
const tool_1 = require("../tool");
const tool_2 = require("./tool");
const toVsPosition = (any) => {
    const range = new vscode.Range(any.loc.start.line, any.loc.start.position, any.loc.end.line, any.loc.end.position);
    return range !== null && range !== void 0 ? range : new vscode.Position(any.loc.start.line, any.loc.start.position);
};
vscode.languages.registerDefinitionProvider("jass", new class NewDefinitionProvider {
    constructor() {
        this._maxLength = 255;
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
    provideDefinition(document, position, token) {
        const key = document.getText(document.getWordRangeAtPosition(position));
        console.log(key);
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
            return null;
        }
        console.log(key);
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
        const locations = new Array();
        [...fieldFunctions(), ...data_1.default.natives()].forEach((func) => {
            if (func.name == key) {
                const location = new vscode.Location(vscode.Uri.file(func.source), toVsPosition(func));
                locations.push(location);
            }
        });
        fieldGlobals().forEach((global) => {
            if (global.name == key) {
                const location = new vscode.Location(vscode.Uri.file(global.source), toVsPosition(global));
                locations.push(location);
            }
        });
        fieldLocals().forEach((local) => {
            if (local.name == key) {
                const location = new vscode.Location(vscode.Uri.file(local.source), toVsPosition(local));
                locations.push(location);
            }
        });
        fieldTakes().forEach((funcTake) => {
            if (funcTake.take.name == key) {
                const location = new vscode.Location(vscode.Uri.file(funcTake.func.source), toVsPosition(funcTake.take));
                locations.push(location);
            }
        });
        fieldStructs().forEach((struct) => {
            if (struct.name == key) {
                const location = new vscode.Location(vscode.Uri.file(struct.source), toVsPosition(struct));
                locations.push(location);
            }
        });
        fieldLibrarys().forEach((library) => {
            if (library.name == key) {
                const location = new vscode.Location(vscode.Uri.file(library.source), toVsPosition(library));
                locations.push(location);
            }
        });
        return locations;
    }
}());
