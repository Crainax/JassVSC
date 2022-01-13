"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const keyword_1 = require("./keyword");
const types_1 = require("./types");
const data_1 = require("./data");
const options_1 = require("./options");
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
    programToLocation(key, uri, program) {
        let location = null;
        const currentFunc = program.functions.find(func => func.name == key);
        if (currentFunc) {
            location = new vscode.Location(uri, toVsPosition(currentFunc));
        }
        else {
            const currentGlobal = program.globals.find(global => global.name == key);
            if (currentGlobal) {
                location = new vscode.Location(uri, toVsPosition(currentGlobal));
            }
            else {
                const currentNative = program.natives.find(global => global.name == key);
                if (currentNative) {
                    location = new vscode.Location(uri, toVsPosition(currentNative));
                }
                else {
                    return null;
                }
            }
        }
        return location;
    }
    all(document, position, key) {
        const contents = [];
        const locations = new Array();
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
        return locations;
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
        let location = null;
        const commonJLocation = this.programToLocation(key, vscode.Uri.file(options_1.Options.commonJPath), data_1.commonJProgram);
        if (commonJLocation) {
            location = commonJLocation;
        }
        else {
            const blizzardJLocation = this.programToLocation(key, vscode.Uri.file(options_1.Options.blizzardJPath), data_1.blizzardJProgram);
            if (blizzardJLocation) {
                location = blizzardJLocation;
            }
            else {
                const dzApiJLocation = this.programToLocation(key, vscode.Uri.file(options_1.Options.dzApiJPath), data_1.dzApiJProgram);
                if (dzApiJLocation) {
                    location = dzApiJLocation;
                }
                else {
                    const commonAiLocation = this.programToLocation(key, vscode.Uri.file(options_1.Options.commonAiPath), data_1.commonAiProgram);
                    if (commonAiLocation) {
                        location = commonAiLocation;
                    }
                    else {
                    }
                }
            }
        }
        if (location) {
            return location;
        }
        console.log(key);
        const locations = new Array();
        data_1.JassMap.forEach((program, path) => {
            program.natives.forEach((native) => {
                if (native.name == key) {
                    const range = new vscode.Range(native.loc.start.line, native.loc.start.position, native.loc.end.line, native.loc.end.position);
                    locations.push(new vscode.Location(vscode.Uri.file(path), range));
                }
            });
            program.functions.forEach((func) => {
                if (func.name == key) {
                    const range = new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position);
                    locations.push(new vscode.Location(vscode.Uri.file(path), range));
                }
                if (path == document.uri.fsPath) {
                    program.functions.forEach((func) => {
                        if (new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position).contains(position)) {
                            func.takes.forEach(take => {
                                if (take.name == key) {
                                    const range = new vscode.Range(take.loc.start.line, take.loc.start.position, take.loc.end.line, take.loc.end.position);
                                    locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                }
                            });
                            func.locals.forEach(local => {
                                if (local.name == key) {
                                    const range = new vscode.Range(local.loc.start.line, local.loc.start.position, local.loc.end.line, local.loc.end.position);
                                    locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                }
                            });
                        }
                    });
                }
            });
            program.globals.forEach((global) => {
                if (global.name == key) {
                    const range = new vscode.Range(global.loc.start.line, global.loc.start.position, global.loc.end.line, global.loc.end.position);
                    locations.push(new vscode.Location(vscode.Uri.file(path), range));
                }
            });
        });
        data_1.VjassMap.forEach((program, path) => {
            program.librarys.forEach((library) => {
                library.functions.forEach((func) => {
                    if (func.name == key) {
                        const range = new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position);
                        locations.push(new vscode.Location(vscode.Uri.file(path), range));
                    }
                });
                library.globals.forEach((global) => {
                    if (global.name == key) {
                        const range = new vscode.Range(global.loc.start.line, global.loc.start.position, global.loc.end.line, global.loc.end.position);
                        locations.push(new vscode.Location(vscode.Uri.file(path), range));
                    }
                });
                library.structs.forEach((struct) => {
                    if (struct.name == key) {
                        const range = new vscode.Range(struct.loc.start.line, struct.loc.start.position, struct.loc.end.line, struct.loc.end.position);
                        locations.push(new vscode.Location(vscode.Uri.file(path), range));
                    }
                    struct.methods.forEach((method) => {
                        if (method.name == key) {
                            const range = new vscode.Range(method.loc.start.line, method.loc.start.position, method.loc.end.line, method.loc.end.position);
                            locations.push(new vscode.Location(vscode.Uri.file(path), range));
                        }
                    });
                });
                if (path == document.uri.fsPath) {
                    library.functions.forEach((func) => {
                        if (new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position).contains(position)) {
                            func.takes.forEach(take => {
                                if (take.name == key) {
                                    const range = new vscode.Range(take.loc.start.line, take.loc.start.position, take.loc.end.line, take.loc.end.position);
                                    locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                }
                            });
                            func.locals.forEach(local => {
                                if (local.name == key) {
                                    const range = new vscode.Range(local.loc.start.line, local.loc.start.position, local.loc.end.line, local.loc.end.position);
                                    locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                }
                            });
                        }
                    });
                    library.structs.forEach((struct) => {
                        if (new vscode.Range(struct.loc.start.line, struct.loc.start.position, struct.loc.end.line, struct.loc.end.position).contains(position)) {
                            struct.members.forEach(member => {
                                if (member.name == key) {
                                    const range = new vscode.Range(member.loc.start.line, member.loc.start.position, member.loc.end.line, member.loc.end.position);
                                    locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                }
                            });
                            struct.methods.forEach((method) => {
                                if (new vscode.Range(method.loc.start.line, method.loc.start.position, method.loc.end.line, method.loc.end.position).contains(position)) {
                                    method.takes.forEach(take => {
                                        if (take.name == key) {
                                            const range = new vscode.Range(take.loc.start.line, take.loc.start.position, take.loc.end.line, take.loc.end.position);
                                            locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                        }
                                    });
                                    method.locals.forEach(local => {
                                        if (local.name == key) {
                                            const range = new vscode.Range(local.loc.start.line, local.loc.start.position, local.loc.end.line, local.loc.end.position);
                                            locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
        data_1.ZincMap.forEach((program, path) => {
            program.librarys.forEach((library) => {
                library.functions.forEach((func) => {
                    if (func.name == key) {
                        const range = new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position);
                        locations.push(new vscode.Location(vscode.Uri.file(path), range));
                    }
                });
                library.globals.forEach((global) => {
                    if (global.name == key) {
                        const range = new vscode.Range(global.loc.start.line, global.loc.start.position, global.loc.end.line, global.loc.end.position);
                        locations.push(new vscode.Location(vscode.Uri.file(path), range));
                    }
                });
                library.structs.forEach((struct) => {
                    if (struct.name == key) {
                        const range = new vscode.Range(struct.loc.start.line, struct.loc.start.position, struct.loc.end.line, struct.loc.end.position);
                        locations.push(new vscode.Location(vscode.Uri.file(path), range));
                    }
                    struct.methods.forEach((method) => {
                        if (method.name == key) {
                            const range = new vscode.Range(method.loc.start.line, method.loc.start.position, method.loc.end.line, method.loc.end.position);
                            locations.push(new vscode.Location(vscode.Uri.file(path), range));
                        }
                    });
                });
                if (path == document.uri.fsPath) {
                    library.functions.forEach((func) => {
                        if (new vscode.Range(func.loc.start.line, func.loc.start.position, func.loc.end.line, func.loc.end.position).contains(position)) {
                            func.takes.forEach(take => {
                                if (take.name == key) {
                                    const range = new vscode.Range(take.loc.start.line, take.loc.start.position, take.loc.end.line, take.loc.end.position);
                                    locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                }
                            });
                            func.locals.forEach(local => {
                                if (local.name == key) {
                                    const range = new vscode.Range(local.loc.start.line, local.loc.start.position, local.loc.end.line, local.loc.end.position);
                                    locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                }
                            });
                        }
                    });
                    library.structs.forEach((struct) => {
                        if (new vscode.Range(struct.loc.start.line, struct.loc.start.position, struct.loc.end.line, struct.loc.end.position).contains(position)) {
                            struct.members.forEach(member => {
                                if (member.name == key) {
                                    const range = new vscode.Range(member.loc.start.line, member.loc.start.position, member.loc.end.line, member.loc.end.position);
                                    locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                }
                            });
                            struct.methods.forEach((method) => {
                                if (new vscode.Range(method.loc.start.line, method.loc.start.position, method.loc.end.line, method.loc.end.position).contains(position)) {
                                    method.takes.forEach(take => {
                                        if (take.name == key) {
                                            const range = new vscode.Range(take.loc.start.line, take.loc.start.position, take.loc.end.line, take.loc.end.position);
                                            locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                        }
                                    });
                                    console.log(method);
                                    method.locals.forEach(local => {
                                        if (local.name == key) {
                                            const range = new vscode.Range(local.loc.start.line, local.loc.start.position, local.loc.end.line, local.loc.end.position);
                                            locations.push(new vscode.Location(vscode.Uri.file(path), range));
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
        return locations;
    }
}());
