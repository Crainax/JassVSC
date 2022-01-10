"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const data_1 = require("./data");
const tool_1 = require("./tool");
const tokens_1 = require("../jass/tokens");
const tool_2 = require("../tool");
const options_1 = require("./options");
class SignatureHelp {
    provideSignatureHelp(document, position, token, context) {
        var _a, _b, _c;
        const text = document.lineAt(position.line).text;
        if (/^\s*\/\//.test(text))
            return;
        const fsPath = document.uri.fsPath;
        const tokens = tokens_1.tokenize(text.substring(0, position.character)).reverse();
        const ids = [];
        let argc = 0;
        let field = 0;
        let state = 0;
        for (let index = 0; index < tokens.length; index++) {
            const token = tokens[index];
            if (state == 0) {
                if (token.isOp() && token.value == ",") {
                    if (field == 0) {
                        argc++;
                    }
                }
                else if (token.isOp() && token.value == "(") {
                    if (field == 0) {
                        state = 1;
                    }
                    else if (field > 0) {
                        field--;
                    }
                }
                else if (token.isOp() && token.value == ")") {
                    field++;
                }
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
        if (ids.length == 0) {
            return null;
        }
        ids.reverse();
        const fieldFunctions = () => {
            const funcs = data_1.default.functions();
            if (!options_1.Options.isOnlyJass) {
                const requires = [];
                data_1.default.librarys().filter((library) => {
                    if (tool_2.compare(library.source, fsPath) && library.loc.contains(tool_1.convertPosition(position))) {
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
                        if (tool_2.compare(library.source, fsPath) && library.loc.contains(tool_1.convertPosition(position))) {
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
                    if (tool_2.compare(library.source, fsPath) && library.loc.contains(tool_1.convertPosition(position))) {
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
                        if (tool_2.compare(library.source, fsPath) && library.loc.contains(tool_1.convertPosition(position))) {
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
                if (tool_2.compare(func.source, fsPath) && func.loc.contains(tool_1.convertPosition(position))) {
                    takes.push(...func.takes.map((take) => {
                        return { take, func };
                    }));
                }
            });
            if (!options_1.Options.isOnlyJass) {
                data_1.default.libraryFunctions().forEach((func) => {
                    if (tool_2.compare(func.source, fsPath) && func.loc.contains(tool_1.convertPosition(position))) {
                        takes.push(...func.takes.map((take) => {
                            return { take, func };
                        }));
                    }
                });
                if (options_1.Options.supportZinc) {
                    data_1.default.zincLibraryFunctions().forEach((func) => {
                        if (tool_2.compare(func.source, fsPath) && func.loc.contains(tool_1.convertPosition(position))) {
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
                if (tool_2.compare(func.source, fsPath) && func.loc.contains(tool_1.convertPosition(position))) {
                    locals.push(...func.locals);
                }
            });
            if (!options_1.Options.isOnlyJass) {
                data_1.default.libraryFunctions().forEach((func) => {
                    if (tool_2.compare(func.source, fsPath) && func.loc.contains(tool_1.convertPosition(position))) {
                        locals.push(...func.locals);
                    }
                });
                if (options_1.Options.supportZinc) {
                    data_1.default.zincLibraryFunctions().forEach((func) => {
                        if (tool_2.compare(func.source, fsPath) && func.loc.contains(tool_1.convertPosition(position))) {
                            locals.push(...func.locals);
                        }
                    });
                }
            }
            return locals;
        };
        if (ids.length == 1) {
            const func = fieldFunctions().find((func) => {
                return ids[0] == func.name;
            });
            if (func) {
                const SignatureInformation = new vscode.SignatureInformation(`${func.name}(${func.takes.length > 0 ? func.takes.map(x => x.origin).join(", ") : ""}) -> ${(_a = func.returns) !== null && _a !== void 0 ? _a : "nothing"}`);
                SignatureInformation.documentation = new vscode.MarkdownString().appendText(func.getContents().join("\n"));
                func.takes.forEach(take => {
                    if (take.name) {
                        SignatureInformation.parameters.push(new vscode.SignatureInformation(take.name));
                    }
                });
                const SignatureHelp = new vscode.SignatureHelp();
                SignatureHelp.activeParameter = argc;
                SignatureHelp.signatures.push(SignatureInformation);
                return SignatureHelp;
            }
        }
        else if (ids.length == 2) {
            if (ids[0] == "this") {
            }
            else {
                const usebleStructs = fieldStructs();
                const struct = usebleStructs.find((struct, index, structs) => {
                    return struct.name == ids[0];
                });
                if (struct) {
                    const method = struct.methods.find((method) => {
                        return method.modifier.includes("static") && method.name == ids[1];
                    });
                    if (method) {
                        const SignatureInformation = new vscode.SignatureInformation(`${method.name}(${method.takes.length > 0 ? method.takes.map(x => x.origin).join(", ") : ""}) -> ${(_b = method.returns) !== null && _b !== void 0 ? _b : "nothing"}`);
                        SignatureInformation.documentation = new vscode.MarkdownString().appendText(method.getContents().join("\n"));
                        method.takes.forEach(method => {
                            if (method.name) {
                                SignatureInformation.parameters.push(new vscode.SignatureInformation(method.name));
                            }
                        });
                        const SignatureHelp = new vscode.SignatureHelp();
                        SignatureHelp.activeParameter = argc;
                        SignatureHelp.signatures.push(SignatureInformation);
                        return SignatureHelp;
                    }
                }
                const usebleLocals = fieldLocals();
                const local = usebleLocals.find((local) => {
                    return local.name == ids[0];
                });
                if (local) {
                    const struct = usebleStructs.find((struct, index, structs) => {
                        return struct.name == local.type;
                    });
                    if (struct) {
                        const method = struct.methods.find((method) => {
                            return !method.modifier.includes("static") && method.name == ids[1];
                        });
                        if (method) {
                            const SignatureInformation = new vscode.SignatureInformation(`${method.name}(${method.takes.length > 0 ? method.takes.map(x => x.origin).join(", ") : ""}) -> ${(_c = method.returns) !== null && _c !== void 0 ? _c : "nothing"}`);
                            SignatureInformation.documentation = new vscode.MarkdownString().appendText(method.getContents().join("\n"));
                            method.takes.forEach(method => {
                                if (method.name) {
                                    SignatureInformation.parameters.push(new vscode.SignatureInformation(method.name));
                                }
                            });
                            const SignatureHelp = new vscode.SignatureHelp();
                            SignatureHelp.activeParameter = argc;
                            SignatureHelp.signatures.push(SignatureInformation);
                            return SignatureHelp;
                        }
                    }
                }
            }
        }
        return null;
    }
}
vscode.languages.registerSignatureHelpProvider("jass", new SignatureHelp, "(", ",");
