"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const tokens_1 = require("../jass/tokens");
const NeedAddSpaceOps = ["=", ">", "<", ">=", "<=", "+", "-", "*", "/", "%"];
class DocumentFormattingSortEditProvider {
    provideDocumentFormattingEdits(document, options, token) {
        const textEdits = new Array();
        let indent = 0;
        let indentChar;
        function genString(count, char = " ") {
            return new Array(count).fill(char).join("");
        }
        if (options.insertSpaces) {
            indentChar = genString(options.tabSize);
        }
        else {
            indentChar = "\t";
        }
        for (let line = 0; line < document.lineCount; line++) {
            const lineText = document.lineAt(line);
            const text = lineText.text;
            if (/^\s*(library|scope|struct|interface|globals|(?:(?:private|public)\s+)?(?:static\s+)?function(?<!\s+interface\b)|(?:(?:private|public)\s+)?(?:static\s+)?method|(?:static\s+)?if|loop|while|for|module|\/\/!\s+(?:zinc|textmacro|nov[Jj]ass|inject))\b/.test(text)) {
                if (lineText.firstNonWhitespaceCharacterIndex > 0 && indent == 0) {
                    textEdits.push(vscode.TextEdit.delete(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex)));
                }
                else if (lineText.firstNonWhitespaceCharacterIndex != indent) {
                    textEdits.push(vscode.TextEdit.replace(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex), genString(indent, indentChar)));
                }
                indent++;
            }
            else if (indent > 0 && /^\s*(?:(endlibrary|endscope|endstruct|endinterface|endglobals|endfunction|endmethod|endif|endloop|endmodule|\/\/!\s+(?:endzinc|endtextmacro|endnov[Jj]ass|endinject))\b|})/.test(text)) {
                indent--;
                if (lineText.firstNonWhitespaceCharacterIndex > 0 && indent == 0) {
                    textEdits.push(vscode.TextEdit.delete(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex)));
                }
                else if (lineText.firstNonWhitespaceCharacterIndex != indent) {
                    textEdits.push(vscode.TextEdit.replace(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex), genString(indent, indentChar)));
                }
            }
            else if (/^\s*(else|elseif)\b/.test(text)) {
                if (indent > 0) {
                    if (lineText.firstNonWhitespaceCharacterIndex > 0 && indent - 1 == 0) {
                        textEdits.push(vscode.TextEdit.delete(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex)));
                    }
                    else if (lineText.firstNonWhitespaceCharacterIndex != indent - 1) {
                        textEdits.push(vscode.TextEdit.replace(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex), genString(indent - 1, indentChar)));
                    }
                }
            }
            else if (!lineText.isEmptyOrWhitespace) {
                if (lineText.firstNonWhitespaceCharacterIndex > 0 && indent == 0) {
                    textEdits.push(vscode.TextEdit.delete(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex)));
                }
                else if (lineText.firstNonWhitespaceCharacterIndex != indent) {
                    textEdits.push(vscode.TextEdit.replace(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex), genString(indent, indentChar)));
                }
            }
        }
        for (let line = 0; line < document.lineCount; line++) {
            const lineText = document.lineAt(line);
            if (lineText.isEmptyOrWhitespace) {
                continue;
            }
            const text = lineText.text;
            const ts = tokens_1.tokens(text);
            ts.reduce((previousValue, currentValue, currentIndex, array) => {
                if (currentValue.isOp() && NeedAddSpaceOps.includes(currentValue.value) && (previousValue.isId() || previousValue.isInt() || previousValue.isReal() || previousValue.isString() || previousValue.isMark())) {
                    if (currentValue.position - previousValue.end != 1) {
                        textEdits.push(vscode.TextEdit.replace(new vscode.Range(new vscode.Position(lineText.lineNumber, previousValue.end), new vscode.Position(lineText.lineNumber, currentValue.position)), " "));
                    }
                }
                else if ((currentValue.isId() || currentValue.isInt() || currentValue.isReal() || currentValue.isString() || currentValue.isMark()) &&
                    previousValue.isOp() && NeedAddSpaceOps.includes(previousValue.value)) {
                    if (currentValue.position - previousValue.end != 1) {
                        textEdits.push(vscode.TextEdit.replace(new vscode.Range(new vscode.Position(lineText.lineNumber, previousValue.end), new vscode.Position(lineText.lineNumber, currentValue.position)), " "));
                    }
                }
                else if (currentValue.isId() && previousValue.isId()) {
                    if (currentValue.position - previousValue.end != 1) {
                        textEdits.push(vscode.TextEdit.replace(new vscode.Range(new vscode.Position(lineText.lineNumber, previousValue.end), new vscode.Position(lineText.lineNumber, currentValue.position)), " "));
                    }
                }
                return currentValue;
            });
        }
        return textEdits;
    }
}
vscode.languages.registerDocumentFormattingEditProvider("jass", new DocumentFormattingSortEditProvider());
