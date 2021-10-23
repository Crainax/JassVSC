"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const parse_1 = require("../jass/parse");
const options_1 = require("./options");
const diagnosticCollection = vscode.languages.createDiagnosticCollection("jass");
vscode.workspace.onDidSaveTextDocument((document) => {
    if (options_1.Options.isOnlyJass && options_1.Options.isJassDiagnostic) {
        const program = parse_1.parse(document.getText(), {
            needParseLocal: true,
            needParseInitExpr: true,
            needParseNative: true
        });
        console.log(program);
        diagnosticCollection.clear();
        const diagnostics = program.errors.map(err => {
            const range = new vscode.Range(err.loc.start.line, err.loc.start.position, err.loc.end.line, err.loc.end.position);
            const diagnostic = new vscode.Diagnostic(range, err.message, vscode.DiagnosticSeverity.Error);
            return diagnostic;
        });
        diagnosticCollection.set(document.uri, diagnostics);
    }
});
vscode.workspace.onDidChangeConfiguration((event) => {
    if (!options_1.Options.isOnlyJass || !options_1.Options.isJassDiagnostic) {
        diagnosticCollection.clear();
    }
});
vscode.languages.onDidChangeDiagnostics((event) => {
});
