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
                        description: '同时对齐 Spec Kit CLI 和当前项目文件',
                        commandId: 'speckit.upgradeAll',
                    },
                    {
                        label: '$(refresh) 升级项目',
                        description: '按当前 AI 集成更新工作区中的 Spec Kit 项目文件',
                        commandId: 'speckit.upgradeProject',
                    },
                    {
                        label: '$(cloud-download) 升级 CLI',
                        description: '安装此项目要求的 Spec Kit CLI 版本',
                        commandId: 'speckit.upgradeCli',
                    },
                    {
                        label: '$(cloud-download) 更新 Companion 扩展',
                        description: '安装或强制更新 Companion 的 Spec Kit 扩展',
                        commandId: 'speckit.companion.installSpecKitExtension',
                    },
                ],
                { title: 'SpecKit：升级', placeHolder: '选择需要升级或对齐的内容' }
            );
            if (pick) {
                await vscode.commands.executeCommand(pick.commandId);
            }
        })
    );
}
