"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const data_1 = require("./data");
const tool_1 = require("./tool");
class SignatureHelp {
    allFunctions(document, position) {
        const functions = [];
        functions.push(...data_1.commonJProgram.natives, ...data_1.commonJProgram.functions);
        functions.push(...data_1.commonAiProgram.natives, ...data_1.commonAiProgram.functions);
        functions.push(...data_1.blizzardJProgram.natives, ...data_1.blizzardJProgram.functions);
        functions.push(...data_1.dzApiJProgram.natives, ...data_1.dzApiJProgram.functions);
        data_1.JassMap.forEach((program) => {
            functions.push(...program.natives, ...program.functions);
        });
        data_1.VjassMap.forEach((program) => {
            program.librarys.forEach((library) => {
                functions.push(...library.functions);
                library.structs.forEach((struct) => {
                    functions.push(...struct.methods);
                });
            });
        });
        data_1.ZincMap.forEach((program) => {
            program.librarys.forEach((library) => {
                functions.push(...library.functions);
                library.structs.forEach((struct) => {
                    functions.push(...struct.methods);
                });
            });
        });
        return functions;
    }
    provideSignatureHelp(document, position, token, context) {
        if (/^\s*\/\//.test(document.lineAt(position.line).text))
            return;
        const provideSignatureHelp = (document, position, token, context) => {
            var _a;
            const SignatureHelp = new vscode.SignatureHelp();
            const lineText = document.lineAt(position.line);
            let funcNames = [];
            let field = 1;
            let activeParameter = 0;
            let inString = false;
            for (let i = position.character - 1; i >= 0; i--) {
                const char = lineText.text.charAt(i);
                if (field > 0) {
                    if (!inString && char == '"') {
                        inString = true;
                    }
                    else if (inString && char == '"' && lineText.text.charAt(i - 1) != '\\') {
                        inString = false;
                    }
                    else if (!inString && char == '(') {
                        field--;
                    }
                    else if (!inString && char == ')') {
                        field++;
                    }
                    else if (!inString && char == ',') {
                        activeParameter++;
                    }
                }
                else if (field == 0) {
                    if (funcNames.length == 0 && /\s/.test(char)) {
                        continue;
                    }
                    else if (/\w/.test(char)) {
                        funcNames.push(char);
                        if (funcNames.length > 0 && (/\W/.test(lineText.text.charAt(i - 1)) || i == 0)) {
                            const funcName = funcNames.reverse().join("");
                            const allFunctions = this.allFunctions(document, position);
                            console.log(funcName);
                            for (let index = 0; index < allFunctions.length; index++) {
                                const func = allFunctions[index];
                                if (func.name == funcName) {
                                    const SignatureInformation = new vscode.SignatureInformation(`${func.name}(${func.takes.length > 0 ? func.takes.map(x => x.origin).join(", ") : ""}) -> ${(_a = func.returns) !== null && _a !== void 0 ? _a : "nothing"}`);
                                    SignatureInformation.documentation = new vscode.MarkdownString().appendText(func.text);
                                    func.takes.forEach(take => {
                                        if (take.name) {
                                            SignatureInformation.parameters.push(new vscode.SignatureInformation(take.name));
                                        }
                                    });
                                    SignatureHelp.activeParameter = activeParameter;
                                    SignatureHelp.signatures.push(SignatureInformation);
                                    break;
                                }
                            }
                        }
                        ;
                    }
                }
            }
            return SignatureHelp;
        };
        try {
            const sh = provideSignatureHelp(document, position, token, context);
            return sh;
        }
        catch (err) {
            console.error(err);
        }
    }
}
vscode.languages.registerSignatureHelpProvider("jass", new SignatureHelp, "(", ",");
class LuaSignatureHelp {
    allFunctions() {
        const functions = [];
        functions.push(...data_1.commonJProgram.natives, ...data_1.commonJProgram.functions);
        functions.push(...data_1.commonAiProgram.natives, ...data_1.commonAiProgram.functions);
        functions.push(...data_1.blizzardJProgram.natives, ...data_1.blizzardJProgram.functions);
        functions.push(...data_1.dzApiJProgram.natives, ...data_1.dzApiJProgram.functions);
        return functions;
    }
    provideSignatureHelp(document, position, token, context) {
        var _a;
        const key = tool_1.functionKey(document, position);
        if (key.isEmpty()) {
            return;
        }
        const SignatureHelp = new vscode.SignatureHelp();
        const functions = this.allFunctions();
        if (key.isSingle()) {
            const funcName = key.keys[0];
            const func = functions.find((func) => func.name == funcName);
            if (!func) {
                return;
            }
            const SignatureInformation = new vscode.SignatureInformation(`${func.name}(${func.takes.length > 0 ? func.takes.map(x => x.origin).join(", ") : ""}) -> ${(_a = func.returns) !== null && _a !== void 0 ? _a : "nothing"}`);
            SignatureInformation.documentation = new vscode.MarkdownString().appendText(func.text);
            func.takes.forEach(take => {
                if (take.name) {
                    SignatureInformation.parameters.push(new vscode.SignatureInformation(take.name));
                }
            });
            SignatureHelp.activeParameter = key.takeIndex;
            SignatureHelp.signatures.push(SignatureInformation);
        }
        return SignatureHelp;
    }
}
