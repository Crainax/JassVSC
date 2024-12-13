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
        let chainCallBraceIndent = false;
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
            //检查链式调用和逗号开头的参数换行
            if (/^\s*[,\.]/.test(text)) {
                if (lineText.firstNonWhitespaceCharacterIndex != indent + 1) {
                    textEdits.push(vscode.TextEdit.replace(
                        new vscode.Range(
                            lineText.lineNumber,
                            0,
                            lineText.lineNumber,
                            lineText.firstNonWhitespaceCharacterIndex
                        ),
                        genString(indent + 1, indentChar)
                    ));
                }
                if (/^\s*[,\.].*\{+\s*(\/\/.*)?$/.test(text)) {
                    indent += 2;
                    chainCallBraceIndent = true;
                }
            }
            //如果要实现function() 不前缩,还得在这里做非匹配  目前只有if,while与for需要括号,其他的都不
            //这里都以vjass为主,要前缩就不能有括号
            else if (/^\s*((library|library_once)|scope|struct|interface|globals|(?:(?:private|public)\s+)?(?:static\s+)?function(?!\s+interface\b)|(?:(?:private|public)\s+)?(?:static\s+)?(?:stub\s+)?method|loop|\/\/!\s+(?:textmacro|nov[Jj]ass|inject))\b[^\(\)\{]*$/.test(text)) {
                if (lineText.firstNonWhitespaceCharacterIndex > 0 && indent == 0) {
                    textEdits.push(vscode.TextEdit.delete(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex)));
                } else if (lineText.firstNonWhitespaceCharacterIndex != indent) {
                    textEdits.push(vscode.TextEdit.replace(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex), genString(indent, indentChar)));
                }
                indent++;
            }
            //VJ的if如果有then也缩进 (?:static\s+)?if
            //if()                匹配失败(没有then)
            //if() then           匹配成功
            //if() then  //XXXX   匹配成功
            else if (/^\s*(?:static\s+)?if\b.*then\s*(\/\/.*)?$/.test(text)) {
                if (lineText.firstNonWhitespaceCharacterIndex > 0 && indent == 0) {
                    textEdits.push(vscode.TextEdit.delete(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex)));
                } else if (lineText.firstNonWhitespaceCharacterIndex != indent) {
                    textEdits.push(vscode.TextEdit.replace(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex), genString(indent, indentChar)));
                }
                indent++;
            }
            //Zinc有关的前缩(已经把|while|for| 转到这里)
            //原理:按最后一个字符是否为{来看,最前面的字符不是/且不是}
            else if (/.*\{+\s*(\/\/.*)?$/.test(text) && (!(/^\s*[\/\}]/.test(text)))) {
                // else if (/.*\{+$/.test(text)) {
                //两次匹配,第二次匹配开头
                // XXXXX {               匹配成功
                // // XXXX {            匹配失败
                // } XXXX {              匹配失败
                //二次更新: XXXXX {  //XX     匹配成功
                if (lineText.firstNonWhitespaceCharacterIndex > 0 && indent == 0) {
                    textEdits.push(vscode.TextEdit.delete(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex)));
                }
                else if (lineText.firstNonWhitespaceCharacterIndex != indent) {
                    textEdits.push(vscode.TextEdit.replace(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex), genString(indent, indentChar)));
                }
                indent++;
            }

            else if (indent > 0 && /^\s*(?:(endlibrary|endscope|endstruct|endinterface|endglobals|endfunction|endmethod|endif|endloop|endmodule|\/\/!\s+(?:endtextmacro|endnov[Jj]ass|endinject))\b)/.test(text)) {
                indent--;
                if (lineText.firstNonWhitespaceCharacterIndex > 0 && indent == 0) {
                    textEdits.push(vscode.TextEdit.delete(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex)));
                }
                else if (lineText.firstNonWhitespaceCharacterIndex != indent) {
                    textEdits.push(vscode.TextEdit.replace(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex), genString(indent, indentChar)));
                }
            }
            else if (indent > 0 && /^\s*\}/.test(text) && (!(/\{+\s*(\/\/.*)?$/.test(text)))) {
                let temp = false; // 是否需要额外减少缩进
                if (chainCallBraceIndent) { //处理之前链式调用缩进2级,这时也要-2级
                    indent -= 1; //先减少一级缩进,保证这行内容正常
                    chainCallBraceIndent = false;
                    temp = true;
                } else {
                    indent--;
                }
                if (lineText.firstNonWhitespaceCharacterIndex > 0 && indent == 0) {
                    textEdits.push(vscode.TextEdit.delete(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex)));
                }
                else if (lineText.firstNonWhitespaceCharacterIndex != indent) {
                    textEdits.push(vscode.TextEdit.replace(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex), genString(indent, indentChar)));
                }
                if (temp) { //本级内容-1级就行了,但是下一行内容要-2级,所以这里补偿多-1级
                    indent--;
                }
            }
            else if (/^\s*(else|elseif\b.*then\b)\s*(\/\/.*)?$/.test(text)) {
                if (indent > 0) {
                    if (lineText.firstNonWhitespaceCharacterIndex > 0 && indent - 1 == 0) {
                        textEdits.push(vscode.TextEdit.delete(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex)));
                    }
                    else if (lineText.firstNonWhitespaceCharacterIndex != indent - 1) {
                        textEdits.push(vscode.TextEdit.replace(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex), genString(indent - 1, indentChar)));
                    }
                }
            }
            else if (/^\s*\}\s*else\b/.test(text) && /\{+\s*(\/\/.*)?$/.test(text)) {
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

        return textEdits;
    }
}
vscode.languages.registerDocumentFormattingEditProvider("jass", new DocumentFormattingSortEditProvider());
