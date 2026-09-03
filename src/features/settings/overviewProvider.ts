import * as vscode from 'vscode';
import { BaseTreeDataProvider } from '../../core/providers';
import { Commands } from '../../core/constants';

export class OverviewItem extends vscode.TreeItem {
    constructor(
        label: string,
        collapsibleState: vscode.TreeItemCollapsibleState,
        contextValue?: string,
        icon?: string,
        command?: vscode.Command
    ) {
        super(label, collapsibleState);
        if (contextValue) { this.contextValue = contextValue; }
        if (icon) { this.iconPath = new vscode.ThemeIcon(icon); }
        if (command) { this.command = command; }
    }
}

export class OverviewProvider extends BaseTreeDataProvider<OverviewItem> {
    constructor(context: vscode.ExtensionContext) {
        super(context, { name: 'OverviewProvider' });
    }

    async getChildren(element?: OverviewItem): Promise<OverviewItem[]> {
        if (element) { return []; }
        return [
            new OverviewItem('打开设置', vscode.TreeItemCollapsibleState.None,
                'settings-open', 'gear', { command: Commands.settings.open, title: '打开设置' }),
            new OverviewItem('报告问题', vscode.TreeItemCollapsibleState.None,
                'feedback-bug', 'bug', { command: Commands.feedback.bugReport, title: '报告问题' }),
            new OverviewItem('提出功能建议', vscode.TreeItemCollapsibleState.None,
                'feedback-feature', 'lightbulb', { command: Commands.feedback.featureRequest, title: '提出功能建议' }),
            new OverviewItem('在 Marketplace 评分', vscode.TreeItemCollapsibleState.None,
                'feedback-review', 'star-empty', { command: Commands.feedback.review, title: '在 Marketplace 评分' }),
        ];
    }
}
