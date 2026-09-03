import * as vscode from 'vscode';
import { isCompanionInstalled } from '../features/settings/companionPresetReconciler';
import { coerceLegacyBoolean } from '../core/settingsMigration';
import { SPEC_KIT_FORCE_INSTALL_COMMAND, SPEC_KIT_TARGET_VERSION } from './versionCompatibility';

/**
 * One-click install / update of the Companion **spec-kit CLI extension**.
 *
 * This is a spec-kit *CLI* extension (it ships the `/speckit.companion.*` command
 * family + the capture hooks), NOT a VS Code marketplace extension — so there is
 * no `vscode.extensions` install path. The install/update runs through the
 * `specify extension` CLI surface introduced by modern Spec Kit releases.
 */

/** Stable rolling release asset for the Companion spec-kit extension. */
export const RELEASE_URL =
    'https://github.com/alfredoperez/speckit-companion/releases/download/companion-latest/companion.zip';

/** Catalog by-name form, used once the extension is listed by spec-kit. */
export const BY_NAME_INSTALL = 'companion';

/** Keep false until the official spec-kit catalog lists `companion`. */
export const USE_BY_NAME_INSTALL = false;

/**
 * Reproducible Spec Kit baseline used by this VS Code extension. Spec Kit 1.0.4
 * supports both source and PyPI distribution; the source-tag form is deliberately
 * pinned here so an in-editor repair cannot silently move to a future incompatible
 * release while this extension still targets 1.0.4.
 */
export const CLI_PREREQ_COMMAND = SPEC_KIT_FORCE_INSTALL_COMMAND;

/** README section a banner's "Learn more" link falls back to. */
export const README_FALLBACK_URL =
    'https://github.com/alfredoperez/speckit-companion#install-the-spec-kit-extension';

export function buildInstallCommand(): string {
    if (USE_BY_NAME_INSTALL) {
        return `specify extension add ${BY_NAME_INSTALL}`;
    }
    return `specify extension add ${BY_NAME_INSTALL} --from ${RELEASE_URL}`;
}

export function shouldShowInstallPrompt(
    enabled: boolean,
    installed: boolean
): boolean {
    return enabled && !installed;
}

export function readInstallPromptEnabled(): boolean {
    const config = vscode.workspace.getConfiguration('speckit');
    return coerceLegacyBoolean(config.get<unknown>('companion.installPrompt', true), true);
}

/**
 * Run the Companion extension install/update in a VS Code terminal. The first
 * line prints the exact Spec Kit baseline expected by this build so a version
 * mismatch is actionable before `specify extension add` runs.
 */
export function runInstallSpecKitExtension(workspaceRoot?: string): void {
    const terminal = vscode.window.createTerminal({
        name: '安装 spec-kit 扩展',
        ...(workspaceRoot ? { cwd: workspaceRoot } : {}),
    });
    terminal.show();
    terminal.sendText(`echo "Spec Kit 版本要求：${SPEC_KIT_TARGET_VERSION}；如需修复请运行：${CLI_PREREQ_COMMAND}"`);
    terminal.sendText(buildInstallCommand());
}

function firstWorkspaceRoot(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

export function isSpecKitExtensionInstalled(): boolean {
    const root = firstWorkspaceRoot();
    return root ? isCompanionInstalled(root) : false;
}

export function openReadmeFallback(): void {
    void vscode.env.openExternal(vscode.Uri.parse(README_FALLBACK_URL));
}
