"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const FoldingOptions = [
    {
        start: "^\\s*//\\s*region\\b",
        end: "^\\s*//\\s*endregion\\b",
        kind: vscode.FoldingRangeKind.Region
    },
    {
        start: "^\\s*globals\\b",
        end: "^\\s*endglobals\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*((private|public|static)\\s+)?function\\b",
        end: "^\\s*endfunction\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*if\\b",
        end: "^\\s*elseif\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*if\\b",
        end: "^\\s*else\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*if\\b",
        end: "^\\s*endif\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*else\\b",
        end: "^\\s*endif\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*elseif\\b",
        end: "^\\s*else\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*elseif\\b",
        end: "^\\s*endif\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*elseif\\b",
        end: "^\\s*elseif\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*loop\\b",
        end: "^\\s*endloop\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*library\\b",
        end: "^\\s*endlibrary\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*/\\*",
        end: "^\\s*\\*/",
        kind: vscode.FoldingRangeKind.Comment
    },
    {
        start: "^\\s*//!\\s+textmacro\\b",
        end: "^\\s*//!\\s+endtextmacro\\b",
        kind: vscode.FoldingRangeKind.Comment
    },
    {
        start: "^\\s*scope\\b",
        end: "^\\s*endscope\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*module\\b",
        end: "^\\s*endmodule\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*((private|public)\\s+)?struct\\b",
        end: "^\\s*endstruct\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*((private|public)\\s+)?interface\\b",
        end: "^\\s*endinterface\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*((private|public|static|stub)\\s+)?method\\b",
        end: "^\\s*endmethod\\b",
        kind: vscode.FoldingRangeKind.Imports
    },
    {
        start: "^\\s*//!\\s+externalblock\\b",
        end: "^\\s*//!\\s+endexternalblock\\b",
        kind: vscode.FoldingRangeKind.Comment
    },
    {
        start: "^\\s*//!\\s+novjass\\b",
        end: "^\\s*//!\\s+endnovjass\\b",
        kind: vscode.FoldingRangeKind.Comment
    },
    {
        start: "^\\s*//!\\s+zinc\\b",
        end: "^\\s*//!\\s+endzinc\\b",
        kind: vscode.FoldingRangeKind.Comment
    },
    {
        start: "^\\s*//!\\s+inject\\b",
        end: "^\\s*//!\\s+endinject\\b",
        kind: vscode.FoldingRangeKind.Comment
    },
    {
        start: "{\\s*$|{\\s*//.*$",
        end: "^\\s*}",
        kind: vscode.FoldingRangeKind.Imports
    }
];
const globalStartRegExp = new RegExp(`^\\s*globals\\b`);
const globalEndRegExp = new RegExp(`^\\s*endglobals\\b`);
const functionStartRegExp = new RegExp(`^\\s*((private|public|static)\\s+)?function\\b`);
const functionEndRegExp = new RegExp(`^\\s*endfunction\\b`);
const libraryStartRegExp = new RegExp(`^\\s*library\\b`);
const libraryEndRegExp = new RegExp(`^\\s*endlibrary\\b`);
const ifStartRegExp = new RegExp(`^\\s*if\\b`);
const elseRegExp = new RegExp(`^\\s*else\\b`);
const elseIfRegExp = new RegExp(`^\\s*elseif\\b`);
const ifEndRegExp = new RegExp(`^\\s*endif\\b`);
const loopStartRegExp = new RegExp(`^\\s*loop\\b`);
const loopEndRegExp = new RegExp(`^\\s*endloop\\b`);
const regionStartRegExp = new RegExp(`^\\s*//\\s*region\\b`);
const endRegionRegExp = new RegExp(`^\\s*//\\s*endregion\\b`);
const methodStartRegExp = new RegExp(`^\\s*method\\b`);
const endMethodionRegExp = new RegExp(`^\\s*endmethod\\b`);
class ElseIf {
    constructor(line) {
        this.line = line;
    }
}
class ElseIfArray extends Array {
    constructor() {
        super(...arguments);
        this.first = () => {
            return this[0];
        };
        this.last = () => {
            return this[this.length - 1];
        };
    }
}
class If {
    constructor(line) {
        this.elseIfArray = new ElseIfArray();
        this.elseLine = null;
        this.line = line;
    }
}
class IfArray extends Array {
    constructor() {
        super(...arguments);
        this.first = () => {
            return this[0];
        };
        this.last = () => {
            return this[this.length - 1];
        };
    }
}
class Loop {
    constructor(line) {
        this.line = line;
    }
}
class LoopArray extends Array {
    constructor() {
        super(...arguments);
        this.first = () => {
            return this[0];
        };
        this.last = () => {
            return this[this.length - 1];
        };
    }
}
class FoldingRangeProvider {
    provideFoldingRanges(document, context, token) {
        const foldings = new Array();
        FoldingOptions.forEach(option => {
            let wrap = false;
            let field = 0;
            let lines = [];
            for (let index = 0; index < document.lineCount; index++) {
                const TextLine = document.lineAt(index);
                if (field > 0) {
                    const regExp = option.end instanceof RegExp ? option.end : new RegExp(option.end);
                    if (regExp.test(TextLine.text)) {
                        const folding = new vscode.FoldingRange(lines[field - 1], index - 1, option.kind);
                        foldings.push(folding);
                        field--;
                    }
                }
                const regExp = option.start instanceof RegExp ? option.start : new RegExp(option.start);
                if (regExp.test(TextLine.text)) {
                    lines[field] = index;
                    field++;
                }
            }
        });
        return foldings;
    }
}
vscode.languages.registerFoldingRangeProvider("jass", new FoldingRangeProvider);
