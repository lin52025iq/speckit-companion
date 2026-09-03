import * as vscode from 'vscode';
import { SpecKitDetector } from './detector';

/**
 * Register CLI-related commands (install, init, upgrade)
 */
export function registerCliCommands(
    context: vscode.ExtensionContext,
    specKitDetector: SpecKitDetector
): void {
    context.subscriptions.push(
        vscode.commands.registerCommand('speckit.installCli', async () => {
            await specKitDetector.installCli();
        }),

        vscode.commands.registerCommand('speckit.initWorkspace', async () => {
            await specKitDetector.initializeWorkspace();
        }),

        vscode.commands.registerCommand('speckit.upgradeCli', async () => {
            await specKitDetector.upgradeCli();
        }),

        vscode.commands.registerCommand('speckit.upgradeProject', async () => {
            await specKitDetector.upgradeProject();
        }),

        vscode.commands.registerCommand('speckit.upgradeAll', async () => {
            await specKitDetector.upgradeAll();
        }),

        vscode.commands.registerCommand('speckit.upgrade', async () => {
            const pick = await vscode.window.showQuickPick(
                [
                    {
                        label: '$(sync) 全部升级',
                        description: '更新 spec-kit CLI 和当前项目脚手架',
                        commandId: 'speckit.upgradeAll',
                    },
                    {
                        label: '$(refresh) 升级项目',
                        description: '为当前 AI 提供商更新此工作区的脚手架',
                        commandId: 'speckit.upgradeProject',
                    },
                    {
                        label: '$(cloud-download) 升级 CLI',
                        description: '全局安装最新版 spec-kit CLI',
                        commandId: 'speckit.upgradeCli',
                    },
                    {
                        label: '$(cloud-download) 更新 spec-kit 扩展',
                        description: '安装或更新 Companion spec-kit 扩展（Turbo + Capture）',
                        commandId: 'speckit.companion.installSpecKitExtension',
                    },
                ],
                { title: 'SpecKit：升级', placeHolder: '请选择要升级的内容' }
            );
            if (pick) {
                await vscode.commands.executeCommand(pick.commandId);
            }
        })
    );
}
