import * as vscode from 'vscode';
import {
    RELEASE_URL,
    BY_NAME_INSTALL,
    USE_BY_NAME_INSTALL,
    CLI_PREREQ_COMMAND,
    buildInstallCommand,
    shouldShowInstallPrompt,
    runInstallSpecKitExtension,
} from './specKitExtensionInstall';
import { SPEC_KIT_TARGET_VERSION } from './versionCompatibility';

describe('specKitExtensionInstall', () => {
    describe('buildInstallCommand', () => {
        it('installs from the fork release URL while the catalog form is off', () => {
            expect(USE_BY_NAME_INSTALL).toBe(false);
            const cmd = buildInstallCommand();
            expect(cmd).toBe(`specify extension add ${BY_NAME_INSTALL} --from ${RELEASE_URL} --force`);
        });

        it('uses --force so the same command can install or update the rolling asset', () => {
            expect(buildInstallCommand()).toContain('--force');
        });

        it('pins the required Spec Kit development baseline', () => {
            expect(SPEC_KIT_TARGET_VERSION).toBe('1.0.5.dev0');
            expect(CLI_PREREQ_COMMAND).toContain('git+https://github.com/github/spec-kit.git@');
            expect(CLI_PREREQ_COMMAND).toContain('--force');
        });
    });

    describe('RELEASE_URL', () => {
        it('points at this fork stable rolling Companion asset', () => {
            expect(RELEASE_URL).toBe(
                'https://github.com/lin52025iq/speckit-companion/releases/download/companion-latest/companion.zip'
            );
        });
    });

    describe('shouldShowInstallPrompt', () => {
        it('shows when missing and enabled', () => {
            expect(shouldShowInstallPrompt(true, false)).toBe(true);
        });

        it('does not show when installed or disabled', () => {
            expect(shouldShowInstallPrompt(true, true)).toBe(false);
            expect(shouldShowInstallPrompt(false, false)).toBe(false);
        });
    });

    describe('runInstallSpecKitExtension', () => {
        it('opens a workspace-scoped terminal, prints the required version, then installs', () => {
            const sendText = jest.fn();
            const show = jest.fn();
            (vscode.window.createTerminal as jest.Mock).mockReturnValueOnce({ show, sendText });

            runInstallSpecKitExtension('/work/project');

            expect(show).toHaveBeenCalled();
            expect(vscode.window.createTerminal).toHaveBeenCalledWith(
                expect.objectContaining({ cwd: '/work/project' })
            );
            const sent = sendText.mock.calls.map(c => c[0] as string);
            expect(sent.some(line => line.includes(`Spec Kit 版本要求：${SPEC_KIT_TARGET_VERSION}`))).toBe(true);
            expect(sent.some(line => line.includes(CLI_PREREQ_COMMAND))).toBe(true);
            expect(sent).toContain(buildInstallCommand());
        });

        it('omits cwd when no workspace root is given', () => {
            const sendText = jest.fn();
            const createTerminal = vscode.window.createTerminal as jest.Mock;
            createTerminal.mockReturnValueOnce({ show: jest.fn(), sendText });

            runInstallSpecKitExtension(undefined);

            const calls = createTerminal.mock.calls;
            const options = calls[calls.length - 1][0];
            expect(options).not.toHaveProperty('cwd');
            expect(sendText.mock.calls.map(c => c[0] as string)).toContain(buildInstallCommand());
        });
    });
});
