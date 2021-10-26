"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class DocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        const symbols = [];
        for (let index = 0; index < document.lineCount; index++) {
            const lineText = document.lineAt(index);
            if (lineText.isEmptyOrWhitespace) {
                continue;
            }
            const text = lineText.text;
            if (/^\s*(?:static\s+|private\s+|public\s+)*function\s*[a-zA-Z][a-zA-Z\d_]*\b/.test(text)) {
                const result = text.match(/^\s*(?:static\s+|private\s+|public\s+)*function\s*(?<name>[a-zA-Z][a-zA-Z\d_]*)/);
                if (result && result.groups) {
                    const name = result.groups["name"];
                    const nameIndex = result.indexOf(name);
                    const selectRange = new vscode.Range(lineText.lineNumber, nameIndex, lineText.lineNumber, nameIndex + name.length);
                    symbols.push(new vscode.DocumentSymbol(name, "", vscode.SymbolKind.Function, lineText.range, selectRange));
                }
            }
            else if (/^\s*(?:static\s+|private\s+|public\s+)*method\s*[a-zA-Z][a-zA-Z\d_]*\b/.test(text)) {
                const result = text.match(/^\s*(?:static\s+|private\s+|public\s+)*method\s*(?<name>[a-zA-Z][a-zA-Z\d_]*)/);
                if (result && result.groups) {
                    const name = result.groups["name"];
                    const nameIndex = result.indexOf(name);
                    const selectRange = new vscode.Range(lineText.lineNumber, nameIndex, lineText.lineNumber, nameIndex + name.length);
                    symbols.push(new vscode.DocumentSymbol(name, "", vscode.SymbolKind.Method, lineText.range, selectRange));
                }
            }
            else if (/^\s*(?:static\s+|private\s+|public\s+)*struct\s*[a-zA-Z][a-zA-Z\d_]*\b/.test(text)) {
                const result = text.match(/^\s*(?:static\s+|private\s+|public\s+)*struct\s*(?<name>[a-zA-Z][a-zA-Z\d_]*)/);
                if (result && result.groups) {
                    const name = result.groups["name"];
                    const nameIndex = result.indexOf(name);
                    const selectRange = new vscode.Range(lineText.lineNumber, nameIndex, lineText.lineNumber, nameIndex + name.length);
                    symbols.push(new vscode.DocumentSymbol(name, "", vscode.SymbolKind.Struct, lineText.range, selectRange));
                }
            }
            else if (/^\s*library(_once)?\s*[a-zA-Z][a-zA-Z\d_]*\b/.test(text)) {
                const result = text.match(/^\s*library(_once)?\s*(?<name>[a-zA-Z][a-zA-Z\d_]*)/);
                if (result && result.groups) {
                    const name = result.groups["name"];
                    const nameIndex = result.indexOf(name);
                    const selectRange = new vscode.Range(lineText.lineNumber, nameIndex, lineText.lineNumber, nameIndex + name.length);
                    symbols.push(new vscode.DocumentSymbol(name, "", vscode.SymbolKind.Module, lineText.range, selectRange));
                }
            }
            else if (/^\s*scope\s*[a-zA-Z][a-zA-Z\d_]*\b/.test(text)) {
                const result = text.match(/^\s*scope\s*(?<name>[a-zA-Z][a-zA-Z\d_]*)/);
                if (result && result.groups) {
                    const name = result.groups["name"];
                    const nameIndex = result.indexOf(name);
                    const selectRange = new vscode.Range(lineText.lineNumber, nameIndex, lineText.lineNumber, nameIndex + name.length);
                    symbols.push(new vscode.DocumentSymbol(name, "", vscode.SymbolKind.Module, lineText.range, selectRange));
                }
            }
        }
        return symbols;
    }
}
vscode.languages.registerDocumentSymbolProvider("jass", new DocumentSymbolProvider());
