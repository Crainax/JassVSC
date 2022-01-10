"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const tool_1 = require("../tool");
class Options {
    static get configuration() {
        return vscode.workspace.getConfiguration("jass");
    }
    static get commonJPath() {
        return this.isUsableJFile(this.configuration["common_j"]) ? this.configuration["common_j"] : path.resolve(__dirname, "../../../static/common.j");
    }
    static get blizzardJPath() {
        return this.isUsableJFile(this.configuration["blizzard"]) ? this.configuration["blizzard"] : path.resolve(__dirname, "../../../static/blizzard.j");
    }
    static get commonAiPath() {
        return this.isUsableAiFile(this.configuration["common_ai"]) ? this.configuration["common_ai"] : path.resolve(__dirname, "../../../static/common.ai");
    }
    static get dzApiJPath() {
        return this.isUsableJFile(this.configuration["dzapi"]) ? this.configuration["dzapi"] : path.resolve(__dirname, "../../../static/DzAPI.j");
    }
    static isUsableFile(filePath) {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    }
    static isUsableJFile(filePath) {
        return this.isUsableFile(filePath) && tool_1.isJFile(filePath);
    }
    static isUsableAiFile(filePath) {
        return this.isUsableFile(filePath) && tool_1.isAiFile(filePath);
    }
    static get includes() {
        const includes = this.configuration["includes"];
        return tool_1.resolvePaths(includes);
    }
    static get supportZinc() {
        return this.configuration["support"]["zinc"];
    }
    static get supportVJass() {
        return this.configuration["support"]["vjass"];
    }
    static get isOnlyJass() {
        return this.configuration["only"];
    }
    static get isJassDiagnostic() {
        return this.configuration["diagnostic"];
    }
    static get workspaces() {
        if (vscode.workspace.workspaceFolders) {
            return vscode.workspace.workspaceFolders.map((floder) => {
                const files = tool_1.resolvePaths([floder.uri.fsPath]);
                return files;
            }).flat();
        }
        return [];
    }
}
exports.Options = Options;
