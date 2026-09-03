import * as vscode from 'vscode';
import { SpecKitDetector } from './detector';

jest.mock('child_process', () => ({
    exec: jest.fn(),
}));

jest.mock('fs', () => ({
    existsSync: jest.fn().mockReturnValue(false),
    readFileSync: jest.fn(),
}));

const mockWindow = vscode.window as jest.Mocked<typeof vscode.window>;

beforeEach(() => {
    jest.clearAllMocks();
    (SpecKitDetector as any).instance = undefined;
});

describe('SpecKitDetector', () => {
    describe('createSpec', () => {
        it('shows the localized input box', async () => {
            const detector = SpecKitDetector.getInstance();
            mockWindow.showInputBox.mockResolvedValue('增加 OAuth 支持');
            await detector.createSpec();
            expect(mockWindow.showInputBox).toHaveBeenCalledWith(
                expect.objectContaining({ title: '新建规格' })
            );
        });

        it('returns early when user cancels', async () => {
            const detector = SpecKitDetector.getInstance();
            mockWindow.showInputBox.mockResolvedValue(undefined);
            await detector.createSpec();
            expect(mockWindow.showInputBox).toHaveBeenCalled();
        });
    });

    describe('singleton', () => {
        it('returns the same instance', () => {
            expect(SpecKitDetector.getInstance()).toBe(SpecKitDetector.getInstance());
        });
    });

    describe('Spec Kit 1.0.5.dev0 upgrade dispatch', () => {
        const getConfig = vscode.workspace.getConfiguration as jest.Mock;

        function mockProvider(value: string | undefined): void {
            getConfig.mockReturnValue({ get: jest.fn().mockReturnValue(value) });
        }

        function lastSentText(): string {
            const results = mockWindow.createTerminal.mock.results;
            const terminal = results[results.length - 1].value;
            return terminal.sendText.mock.calls.at(-1)?.[0] as string;
        }

        beforeEach(() => {
            (vscode.workspace as any).workspaceFolders = [{ uri: { fsPath: '/tmp/ws' } }];
        });

        afterEach(() => {
            (vscode.workspace as any).workspaceFolders = undefined;
        });

        it('initializes with --integration instead of legacy --ai', async () => {
            mockProvider('codex');
            await SpecKitDetector.getInstance().initializeWorkspace();
            const sent = lastSentText();
            expect(sent).toContain('specify init . --integration codex');
            expect(sent).not.toContain('--ai');
        });

        it('upgrades project files through integration upgrade and extension update', async () => {
            mockProvider('codex');
            await SpecKitDetector.getInstance().upgradeProject();
            const sent = lastSentText();
            expect(sent).toContain('specify integration upgrade codex');
            expect(sent).toContain('specify extension update');
            expect(sent).not.toContain('specify init --here --force');
        });

        it('upgradeAll pins the CLI source and then upgrades the configured integration', async () => {
            mockProvider('claude');
            await SpecKitDetector.getInstance().upgradeAll();
            const sent = lastSentText();
            expect(sent).toContain('git+https://github.com/github/spec-kit.git@');
            expect(sent).toContain('specify integration upgrade claude');
            expect(sent).toContain('specify extension update');
        });
    });
});
