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
            //如果要实现function() 不前缩,还得在这里做非匹配  目前只有if,while与for需要括号,其他的都不
            //这里都以vjass为主,要前缩就不能有括号
            if (/^\s*((library|library_once)|scope|struct|interface|globals|(?:(?:private|public)\s+)?(?:static\s+)?function(?!\s+interface\b)|(?:(?:private|public)\s+)?(?:static\s+)?(?:stub\s+)?method|loop|\/\/!\s+(?:textmacro|nov[Jj]ass|inject))\b[^\(\)\{]*$/.test(text)) {
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
            //在}后加:\s*(\/\/.*)?$
            //} else {             捕获失败
            //} else {    //XXX    捕获失败
            //}                    捕获成功
            //}    //////          捕获成功
            //}));                 捕获成功
            else if (indent > 0 && /^\s*\}/.test(text) && (!(/\{+\s*(\/\/.*)?$/.test(text)))) {
                indent--;
                if (lineText.firstNonWhitespaceCharacterIndex > 0 && indent == 0) {
                    textEdits.push(vscode.TextEdit.delete(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex)));
                }
                else if (lineText.firstNonWhitespaceCharacterIndex != indent) {
                    textEdits.push(vscode.TextEdit.replace(new vscode.Range(lineText.lineNumber, 0, lineText.lineNumber, lineText.firstNonWhitespaceCharacterIndex), genString(indent, indentChar)));
                }
            }
            //后面:补了一个 如果后面接{的话
            //[^\{]*$
            //这里要同时满足2个规则:
            //VJass里:只要出现else/elseif就匹配成功 反正不会有{与}
            //Zinc里:有一种情况可能会匹配到: else XXXXX;
            //elseif (randomI == 9) then            匹配成功
            //elseif (str="{}}{{}{}{}") then        匹配成功
            //else if (str="{}}{{}{}{}") XXXXX();   匹配失败
            //else if (str="{}}{{}{}{}") {          匹配怎样都行,上面已经已经截取到了
            //else if (str="{}}{{}{}{}")            匹配失败
            //else XXXXX;                           匹配失败
            //else                                  匹配成功
            //后面新加:
            //elseif   ()  then //XXXXXX            匹配成功
            //else  //XXXXXX                        匹配成功
            //elseif   ()  //then XXXXXX            匹配失败
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
            //第三次新加:[这里只影响本行前缩]
            //} else {                              匹配成功
            //} else if (XXXX) {                    匹配成功
            //} else {      //XXXXX                 匹配成功
            //} else if (XXXX) {      //XXXXX       匹配成功
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

        //注释看看,效果还不错,有了Align后这个其实不需要了
        // for (let line = 0; line < document.lineCount; line++) {
        //     const lineText = document.lineAt(line);
        //     if (lineText.isEmptyOrWhitespace) {
        //         continue;
        //     }
        //     const text = lineText.text;
        //     const ts = tokens_1.tokens(text);
        //     ts.reduce((previousValue, currentValue, currentIndex, array) => {
        //         if (currentValue.isOp() && NeedAddSpaceOps.includes(currentValue.value) && (previousValue.isId() || previousValue.isInt() || previousValue.isReal() || previousValue.isString() || previousValue.isMark())) {
        //             if (currentValue.position - previousValue.end != 1) {
        //                 textEdits.push(vscode.TextEdit.replace(new vscode.Range(new vscode.Position(lineText.lineNumber, previousValue.end), new vscode.Position(lineText.lineNumber, currentValue.position)), " "));
        //             }
        //         }
        //         else if ((currentValue.isId() || currentValue.isInt() || currentValue.isReal() || currentValue.isString() || currentValue.isMark()) &&
        //             previousValue.isOp() && NeedAddSpaceOps.includes(previousValue.value)) {
        //             if (currentValue.position - previousValue.end != 1) {
        //                 textEdits.push(vscode.TextEdit.replace(new vscode.Range(new vscode.Position(lineText.lineNumber, previousValue.end), new vscode.Position(lineText.lineNumber, currentValue.position)), " "));
        //             }
        //         }
        //         else if (currentValue.isId() && previousValue.isId()) {
        //             if (currentValue.position - previousValue.end != 1) {
        //                 textEdits.push(vscode.TextEdit.replace(new vscode.Range(new vscode.Position(lineText.lineNumber, previousValue.end), new vscode.Position(lineText.lineNumber, currentValue.position)), " "));
        //             }
        //         }
        //         return currentValue;
        //     });
        // }
        return textEdits;
    }
}
vscode.languages.registerDocumentFormattingEditProvider("jass", new DocumentFormattingSortEditProvider());
