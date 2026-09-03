import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { ConfigKeys } from '../core/constants';
import { isCompanionInstalled } from '../features/settings/companionPresetReconciler';
import { readInstallPromptEnabled } from './specKitExtensionInstall';
import { reportInstallPromptShown } from '../core/telemetry';

/** Inputs to the render decision — all pre-resolved so the predicate stays pure. */
export interface ActivationInstallNudgeGateInput {
    specKitDetected: boolean;
    companionInstalled: boolean;
    dismissed: boolean;
    installPromptEnabled: boolean;
    alreadyShownThisSession: boolean;
}

/**
 * Whether the activation install prompt should render. True only when spec-kit is
 * detected (the project already uses it), the companion extension is absent, the
 * shared dismissal is unset, the install-prompt preference is on, and it has not
 * shown this session. Provider-agnostic on purpose: installing the extension is a
 * terminal command (`specify extension add …`) that works the same regardless of
 * which AI provider dispatches spec-kit commands, so an in-editor-chat user can
 * install it just as well as a terminal-CLI user. Both the wrapper below and the
 * tests call this exact function — no gate is re-derived inline.
 */
export function shouldShowActivationInstallNudge(input: ActivationInstallNudgeGateInput): boolean {
    return (
        input.specKitDetected &&
        !input.companionInstalled &&
        !input.dismissed &&
        input.installPromptEnabled &&
        !input.alreadyShownThisSession
    );
}

// Once per session: the prompt is a quiet reminder on open, not a per-window nag.
let shownThisSession = false;

/** Reset the per-session guard. Test-only — never called in production. */
export function __resetActivationInstallNudgeSession(): void {
    shownThisSession = false;
}

/**
 * On activation of a project that already uses spec-kit, show a single
 * non-blocking notification offering to install the SpecKit Companion extension.
 * Reuses the existing install command, the shared `installNudgeDismissed`
 * dismissal, and the `speckit.companion.installPrompt` preference — no parallel
 * system. Never throws: any failure is swallowed so activation always proceeds.
 */
export function maybeShowActivationInstallNudge(
    context: vscode.ExtensionContext,
    root: string | undefined
): void {
    try {
        if (!root) {
            return;
        }
        const dismissed = context.globalState.get<boolean>(
            ConfigKeys.globalState.installNudgeDismissed,
            false
        );
        const input: ActivationInstallNudgeGateInput = {
            specKitDetected: fs.existsSync(path.join(root, '.specify')),
            companionInstalled: isCompanionInstalled(root),
            dismissed,
            installPromptEnabled: readInstallPromptEnabled(),
            alreadyShownThisSession: shownThisSession,
        };
        if (!shouldShowActivationInstallNudge(input)) {
            return;
        }
        // Present the prompt first; only then burn the session slot and report the
        // show (under the SAME gate the prompt renders on), so a failed presentation
        // never over-counts telemetry or silently suppresses the nudge for the session.
        const installAction = '安装';
        const dismissAction = '不再提示';
        const shown = vscode.window.showInformationMessage(
            '此项目正在使用 spec-kit。安装 SpecKit Companion 扩展即可解锁实时状态、可恢复执行、复杂度快速路径和 Living Specs 🌱。',
            installAction,
            dismissAction
        );
        shownThisSession = true;
        reportInstallPromptShown('activation');
        void shown.then(choice => {
            if (choice === installAction) {
                void vscode.commands.executeCommand('speckit.companion.installNudge', 'activation');
            } else if (choice === dismissAction) {
                void vscode.commands.executeCommand('speckit.companion.dismissInstallNudge');
            }
        });
    } catch {
        /* the nudge must never block or fail activation */
    }
}
