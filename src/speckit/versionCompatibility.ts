import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const SPEC_KIT_TARGET_VERSION = '1.0.4';
export const SPEC_KIT_TARGET_TAG = `v${SPEC_KIT_TARGET_VERSION}`;
export const SPEC_KIT_SOURCE = `git+https://github.com/github/spec-kit.git@${SPEC_KIT_TARGET_TAG}`;
export const SPEC_KIT_INSTALL_COMMAND = `uv tool install specify-cli --from ${SPEC_KIT_SOURCE}`;
export const SPEC_KIT_FORCE_INSTALL_COMMAND = `uv tool install specify-cli --force --from ${SPEC_KIT_SOURCE}`;

export interface SpecKitVersionStatus {
    installedVersion: string | null;
    projectVersion: string | null;
    expectedVersion: string;
    cliMatches: boolean;
    projectMatches: boolean;
    compatible: boolean;
}

let lastCheckAt = 0;
let lastStatus: SpecKitVersionStatus | null = null;
let warningVisible = false;
const CACHE_MS = 30_000;

export function normalizeSpecKitVersion(value: string | null | undefined): string | null {
    if (!value) return null;
    const match = value.match(/(\d+\.\d+\.\d+(?:[.-]?[0-9A-Za-z.-]+)?)/);
    return match?.[1] ?? null;
}

export function versionsMatch(actual: string | null | undefined, expected = SPEC_KIT_TARGET_VERSION): boolean {
    return normalizeSpecKitVersion(actual) === normalizeSpecKitVersion(expected);
}

export function readProjectSpecKitVersion(workspaceRoot?: string): string | null {
    if (!workspaceRoot) return null;
    const candidates = [
        path.join(workspaceRoot, '.specify', 'init-options.json'),
        path.join(workspaceRoot, '.specify', 'integrations', 'speckit.manifest.json'),
    ];
    for (const candidate of candidates) {
        try {
            if (!fs.existsSync(candidate)) continue;
            const parsed = JSON.parse(fs.readFileSync(candidate, 'utf8')) as Record<string, unknown>;
            const raw = typeof parsed.speckit_version === 'string'
                ? parsed.speckit_version
                : typeof parsed.version === 'string'
                    ? parsed.version
                    : null;
            const normalized = normalizeSpecKitVersion(raw);
            if (normalized) return normalized;
        } catch {
            // Ignore malformed or legacy metadata and continue to the next source.
        }
    }
    return null;
}

export async function readInstalledSpecKitVersion(): Promise<string | null> {
    try {
        const { stdout, stderr } = await execAsync('specify --version');
        return normalizeSpecKitVersion(`${stdout}\n${stderr}`);
    } catch {
        return null;
    }
}

export async function checkSpecKitVersionConsistency(force = false): Promise<SpecKitVersionStatus> {
    const now = Date.now();
    if (!force && lastStatus && now - lastCheckAt < CACHE_MS) return lastStatus;

    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    const [installedVersion, projectVersion] = await Promise.all([
        readInstalledSpecKitVersion(),
        Promise.resolve(readProjectSpecKitVersion(workspaceRoot)),
    ]);

    const cliMatches = versionsMatch(installedVersion);
    const projectMatches = projectVersion === null || versionsMatch(projectVersion);
    lastStatus = {
        installedVersion,
        projectVersion,
        expectedVersion: SPEC_KIT_TARGET_VERSION,
        cliMatches,
        projectMatches,
        compatible: cliMatches && projectMatches,
    };
    lastCheckAt = now;
    return lastStatus;
}

export async function warnIfSpecKitVersionMismatch(force = false): Promise<SpecKitVersionStatus> {
    const status = await checkSpecKitVersionConsistency(force);
    if (status.compatible || warningVisible) return status;

    warningVisible = true;
    const installed = status.installedVersion ?? '未检测到';
    const project = status.projectVersion ?? '未记录';
    const choice = await vscode.window.showWarningMessage(
        `Spec Kit 版本不一致：扩展目标版本 ${status.expectedVersion}，当前 CLI ${installed}，项目脚手架 ${project}。建议先完成版本对齐再继续运行 SpecKit。`,
        '升级到匹配版本',
        '稍后处理'
    );
    warningVisible = false;

    if (choice === '升级到匹配版本') {
        void vscode.commands.executeCommand('speckit.upgradeAll');
    }
    return status;
}

export function clearSpecKitVersionCache(): void {
    lastCheckAt = 0;
    lastStatus = null;
}
