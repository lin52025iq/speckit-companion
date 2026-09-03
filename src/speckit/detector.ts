import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { CONTEXT_KEYS, setContextKey } from '../core/utils/contextKeys';
import { getConfiguredSpecKitAgent } from './specKitAgent';
import {
    SPEC_KIT_FORCE_INSTALL_COMMAND,
    SPEC_KIT_TARGET_VERSION,
    checkSpecKitVersionConsistency,
    clearSpecKitVersionCache,
} from './versionCompatibility';

const execAsync = promisify(exec);

export class SpecKitDetector {
    private static instance: SpecKitDetector;
    private _isInstalled = false;
    private _isInitialized = false;
    private _constitutionNeedsSetup = false;
    private outputChannel: vscode.OutputChannel | null = null;

    private constructor() {}

    static getInstance(): SpecKitDetector {
        if (!SpecKitDetector.instance) {
            SpecKitDetector.instance = new SpecKitDetector();
        }
        return SpecKitDetector.instance;
    }

    setOutputChannel(channel: vscode.OutputChannel): void {
        this.outputChannel = channel;
    }

    private log(message: string): void {
        if (this.outputChannel) {
            this.outputChannel.appendLine(`[SpecKitDetector] ${message}`);
        }
    }

    /** Check whether the Spec Kit CLI is installed. Modern Spec Kit exposes --version. */
    async checkCliInstalled(): Promise<boolean> {
        try {
            const { stdout, stderr } = await execAsync('specify --version');
            this._isInstalled = true;
            this.log(`SpecKit CLI detected: ${`${stdout}\n${stderr}`.trim()}`);
            await setContextKey(CONTEXT_KEYS.cliInstalled, true);
            return true;
        } catch {
            try {
                await execAsync('specify --help');
                this._isInstalled = true;
                this.log('SpecKit CLI found via --help (legacy install)');
                await setContextKey(CONTEXT_KEYS.cliInstalled, true);
                return true;
            } catch {
                this._isInstalled = false;
                this.log('SpecKit CLI not found');
                await setContextKey(CONTEXT_KEYS.cliInstalled, false);
                return false;
            }
        }
    }

    async checkWorkspaceInitialized(): Promise<boolean> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            this._isInitialized = false;
            await setContextKey(CONTEXT_KEYS.detected, false);
            return false;
        }

        const specifyFolder = path.join(workspaceFolder.uri.fsPath, '.specify');
        if (fs.existsSync(specifyFolder)) {
            this._isInitialized = true;
            this.log('Found .specify folder');
        } else {
            const specKitAgents = [
                '.github/agents/speckit.specify.agent.md',
                '.github/agents/speckit.plan.agent.md'
            ];
            this._isInitialized = false;
            for (const agent of specKitAgents) {
                const agentPath = path.join(workspaceFolder.uri.fsPath, agent);
                if (fs.existsSync(agentPath)) {
                    this._isInitialized = true;
                    this.log(`Found SpecKit agent: ${agent}`);
                    break;
                }
            }
        }

        await setContextKey(CONTEXT_KEYS.detected, this._isInitialized);
        this.log(`Workspace initialized: ${this._isInitialized}`);
        return this._isInitialized;
    }

    async checkConstitutionSetup(): Promise<boolean> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            this._constitutionNeedsSetup = false;
            return false;
        }

        const constitutionPath = path.join(workspaceFolder.uri.fsPath, '.specify/memory/constitution.md');
        if (!fs.existsSync(constitutionPath)) {
            this._constitutionNeedsSetup = false;
            this.log('Constitution file not found');
            return false;
        }

        try {
            const content = fs.readFileSync(constitutionPath, 'utf-8');
            const hasPlaceholders = /\[PROJECT_NAME\]|\[PRINCIPLE_\d+_NAME\]|\[PLACEHOLDER\]/.test(content);
            this._constitutionNeedsSetup = hasPlaceholders;
            this.log(`Constitution needs setup: ${hasPlaceholders}`);
            await setContextKey(CONTEXT_KEYS.constitutionNeedsSetup, hasPlaceholders);
            return hasPlaceholders;
        } catch (error) {
            this.log(`Error reading constitution: ${error}`);
            this._constitutionNeedsSetup = false;
            return false;
        }
    }

    async detect(): Promise<{ cliInstalled: boolean; workspaceInitialized: boolean; constitutionNeedsSetup: boolean }> {
        const cliInstalled = await this.checkCliInstalled();
        const workspaceInitialized = await this.checkWorkspaceInitialized();
        const constitutionNeedsSetup = workspaceInitialized ? await this.checkConstitutionSetup() : false;

        if (cliInstalled) {
            const versionStatus = await checkSpecKitVersionConsistency(true);
            this.log(
                `Version check: expected=${versionStatus.expectedVersion}, cli=${versionStatus.installedVersion ?? 'unknown'}, ` +
                `project=${versionStatus.projectVersion ?? 'unknown'}, compatible=${versionStatus.compatible}`
            );
        }
        return { cliInstalled, workspaceInitialized, constitutionNeedsSetup };
    }

    async installCli(): Promise<void> {
        const terminal = vscode.window.createTerminal(`安装 Spec Kit CLI ${SPEC_KIT_TARGET_VERSION}`);
        terminal.show();
        terminal.sendText(SPEC_KIT_FORCE_INSTALL_COMMAND);

        const selection = await vscode.window.showInformationMessage(
            `正在安装项目要求的 Spec Kit CLI ${SPEC_KIT_TARGET_VERSION}。完成后请重新加载窗口，以便重新检测版本。`,
            '了解更多',
            '重新加载窗口'
        );

        clearSpecKitVersionCache();
        if (selection === '了解更多') {
            vscode.env.openExternal(vscode.Uri.parse('https://github.com/github/spec-kit#-get-started'));
        } else if (selection === '重新加载窗口') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    }

    async initializeWorkspace(): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('当前没有打开工作区文件夹');
            return;
        }

        const integration = getConfiguredSpecKitAgent();
        const terminal = vscode.window.createTerminal('初始化 Spec Kit');
        terminal.show();
        terminal.sendText(`cd "${workspaceFolder.uri.fsPath}" && specify init . --integration ${integration}`);

        const selection = await vscode.window.showInformationMessage(
            `正在使用 Spec Kit ${SPEC_KIT_TARGET_VERSION} 初始化当前项目，并配置 AI 集成“${integration}”。完成后请重新加载窗口。`,
            '重新加载窗口',
            '了解更多'
        );

        clearSpecKitVersionCache();
        if (selection === '重新加载窗口') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        } else if (selection === '了解更多') {
            vscode.env.openExternal(vscode.Uri.parse('https://github.com/github/spec-kit#-get-started'));
        }
    }

    async upgradeCli(): Promise<void> {
        const terminal = vscode.window.createTerminal(`升级 Spec Kit CLI → ${SPEC_KIT_TARGET_VERSION}`);
        terminal.show();
        // Pin the GitHub release tag for reproducibility. This is also the official
        // manual fallback for installs too old to support `specify self upgrade`.
        terminal.sendText(SPEC_KIT_FORCE_INSTALL_COMMAND);

        clearSpecKitVersionCache();
        const selection = await vscode.window.showInformationMessage(
            `正在将 Spec Kit CLI 对齐到项目要求的 ${SPEC_KIT_TARGET_VERSION}。完成后请重新加载窗口。`,
            '重新加载窗口'
        );
        if (selection === '重新加载窗口') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    }

    async upgradeProject(): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('当前没有打开工作区文件夹');
            return;
        }

        const integration = getConfiguredSpecKitAgent();
        const terminal = vscode.window.createTerminal('升级 Spec Kit 项目文件');
        terminal.show();
        terminal.sendText(
            `cd "${workspaceFolder.uri.fsPath}" && ` +
            `specify integration upgrade ${integration} && specify extension update`
        );

        clearSpecKitVersionCache();
        const selection = await vscode.window.showInformationMessage(
            `正在更新 AI 集成“${integration}”对应的项目文件，并更新已安装的 Spec Kit 扩展。目标版本为 ${SPEC_KIT_TARGET_VERSION}。完成后请重新加载窗口。`,
            '重新加载窗口'
        );
        if (selection === '重新加载窗口') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    }

    async upgradeAll(): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('当前没有打开工作区文件夹');
            return;
        }

        const integration = getConfiguredSpecKitAgent();
        const terminal = vscode.window.createTerminal(`对齐 Spec Kit ${SPEC_KIT_TARGET_VERSION}`);
        terminal.show();
        terminal.sendText(
            `${SPEC_KIT_FORCE_INSTALL_COMMAND} && ` +
            `cd "${workspaceFolder.uri.fsPath}" && ` +
            `specify integration upgrade ${integration} && specify extension update`
        );

        clearSpecKitVersionCache();
        const selection = await vscode.window.showInformationMessage(
            `正在将 Spec Kit CLI、AI 集成“${integration}”的项目文件和已安装扩展统一对齐到 ${SPEC_KIT_TARGET_VERSION}。完成后请重新加载窗口。`,
            '重新加载窗口'
        );
        if (selection === '重新加载窗口') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    }

    async createSpec(): Promise<void> {
        const description = await vscode.window.showInputBox({
            title: '新建规格',
            prompt: '你希望构建什么功能？',
            placeHolder: '例如：增加支持 OAuth 的用户认证…',
            ignoreFocusOut: true
        });
        if (!description) return;
        return;
    }

    get cliInstalled(): boolean {
        return this._isInstalled;
    }

    get workspaceInitialized(): boolean {
        return this._isInitialized;
    }

    get constitutionNeedsSetup(): boolean {
        return this._constitutionNeedsSetup;
    }
}
