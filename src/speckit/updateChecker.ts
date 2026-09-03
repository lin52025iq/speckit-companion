import * as vscode from 'vscode';
import { ConfigKeys } from '../core/constants';
import { NotificationUtils } from '../core/utils/notificationUtils';
import type { GitHubRelease } from '../core/types/config';

const PROJECT_REPOSITORY = 'lin52025iq/speckit-companion';
const PROJECT_RELEASES_API = `https://api.github.com/repos/${PROJECT_REPOSITORY}/releases?per_page=100`;
const PROJECT_RELEASES_URL = `https://github.com/${PROJECT_REPOSITORY}/releases`;

export class UpdateChecker {
    private static readonly SKIP_VERSION_KEY = ConfigKeys.globalState.skipVersion;
    private static readonly LAST_CHECK_KEY = ConfigKeys.globalState.lastUpdateCheck;
    private static readonly CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
    
    constructor(
        private context: vscode.ExtensionContext,
        private outputChannel: vscode.OutputChannel
    ) {}
    
    /**
     * Check for updates
     * @param force Force check even if already checked today
     */
    async checkForUpdates(force = false): Promise<void> {
        if (!force && this.hasCheckedRecently()) {
            return;
        }
        
        try {
            const currentVersion = this.getCurrentVersion();
            if (!currentVersion) {
                this.outputChannel.appendLine('[UpdateChecker] ERROR: Could not get current extension version');
                return;
            }
            
            this.outputChannel.appendLine(`[UpdateChecker] Checking for updates... (current: ${currentVersion})`);
            const latestRelease = await this.fetchLatestRelease();
            if (!latestRelease) {
                return;
            }
            
            const latestVersion = latestRelease.tag_name.replace(/^v/, '');
            const skipVersion = this.context.globalState.get<string>(UpdateChecker.SKIP_VERSION_KEY);
            
            if (this.isNewerVersion(currentVersion, latestVersion) && latestVersion !== skipVersion) {
                this.showUpdateNotification(currentVersion, latestVersion);
            }
            
            await this.context.globalState.update(UpdateChecker.LAST_CHECK_KEY, Date.now());
            this.outputChannel.appendLine('[UpdateChecker] Update check completed');
        } catch (error) {
            this.outputChannel.appendLine(`[UpdateChecker] ERROR: Failed to check for updates: ${error}`);
        }
    }
    
    private getCurrentVersion(): string | undefined {
        return this.context.extension.packageJSON.version;
    }

    /** Fetch the newest VS Code (`v*`) release from this project's GitHub repository. */
    private async fetchLatestRelease(): Promise<GitHubRelease | null> {
        try {
            this.outputChannel.appendLine(`[UpdateChecker] Fetching releases from ${PROJECT_REPOSITORY}...`);
            const response = await fetch(PROJECT_RELEASES_API, {
                headers: { 'User-Agent': 'speckit-companion', Accept: 'application/vnd.github+json' },
            });

            if (!response.ok) {
                this.outputChannel.appendLine(`[UpdateChecker] GitHub API returned ${response.status}: ${response.statusText}`);
                return null;
            }

            const releases = await response.json() as GitHubRelease[];
            const latest = this.selectLatestVsCodeRelease(releases);
            this.outputChannel.appendLine(`[UpdateChecker] Latest VS Code release: ${latest?.tag_name || 'none'}`);
            return latest;
        } catch (error) {
            this.outputChannel.appendLine(`[UpdateChecker] ERROR: Failed to fetch releases: ${error}`);
            return null;
        }
    }

    /**
     * Pick the highest-version published release whose tag is a VS Code `v<major>.<minor>.<patch>` tag.
     * Drafts/prereleases and non-extension tags are ignored.
     */
    private selectLatestVsCodeRelease(releases: GitHubRelease[]): GitHubRelease | null {
        if (!Array.isArray(releases)) {
            return null;
        }
        let latest: GitHubRelease | null = null;
        let latestVersion = '';
        for (const release of releases) {
            if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+$/.test(release.tag_name)) {
                continue;
            }
            const version = release.tag_name.replace(/^v/, '');
            if (!latest || this.isNewerVersion(latestVersion, version)) {
                latest = release;
                latestVersion = version;
            }
        }
        return latest;
    }
    
    private showUpdateNotification(currentVersion: string, latestVersion: string): void {
        const message = `🎉 SpecKit Companion ${latestVersion} 已发布！（当前版本：${currentVersion}）`;
        this.outputChannel.appendLine(`[UpdateChecker] Showing update notification: ${message}`);

        vscode.window.showInformationMessage(
            message,
            '查看新版本',
            '跳过此版本'
        ).then(async (selection) => {
            if (selection === '查看新版本') {
                const releaseUrl = `${PROJECT_RELEASES_URL}/tag/v${latestVersion}`;
                await vscode.env.openExternal(vscode.Uri.parse(releaseUrl));
            } else if (selection === '跳过此版本') {
                await this.context.globalState.update(UpdateChecker.SKIP_VERSION_KEY, latestVersion);
                await NotificationUtils.showAutoDismissNotification(
                    `后续检查将跳过版本 ${latestVersion}。`,
                    5000
                );
            }
        });
    }
    
    private isNewerVersion(current: string, latest: string): boolean {
        const currentParts = current.split('.').map(Number);
        const latestParts = latest.split('.').map(Number);
        
        for (let i = 0; i < 3; i++) {
            const currentPart = currentParts[i] || 0;
            const latestPart = latestParts[i] || 0;
            
            if (latestPart > currentPart) {
                return true;
            }
            if (latestPart < currentPart) {
                return false;
            }
        }
        return false;
    }
    
    private hasCheckedRecently(): boolean {
        const lastCheck = this.context.globalState.get<number>(UpdateChecker.LAST_CHECK_KEY, 0);
        const now = Date.now();
        return (now - lastCheck) < UpdateChecker.CHECK_INTERVAL;
    }
    
    async clearSkipVersion(): Promise<void> {
        await this.context.globalState.update(UpdateChecker.SKIP_VERSION_KEY, undefined);
    }
}
