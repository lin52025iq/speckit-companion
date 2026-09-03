import type { ViewerState } from '../types';
import { viewerState, navState, historyEntries } from '../signals';
import { hasAnyData } from '../overviewModel';
import { t } from '../../shared/i18n';
import {
    IntentSection,
    ExpectationsSection,
    VerifiedSection,
    DecisionsSection,
    CoverageSection,
} from './OverviewDossier';
import { PhasesCard } from './cards/PhasesCard';
import { TasksCard } from './cards/TasksCard';
import { ConcernsCard } from './cards/ConcernsCard';
import { FilesCard } from './cards/FilesCard';
import { CommentsCard } from './cards/CommentsCard';

function InstallBanner() {
    if (!navState.value?.showInstallPrompt) return null;
    return (
        <div class="install-banner" id="install-banner" role="region" aria-label={t('activity.installRegion', 'Install spec-kit extension')}>
            <span class="install-banner__icon codicon codicon-rocket" aria-hidden="true" />
            <span class="install-banner__text">{t('activity.installMessage', 'Install the spec-kit extension for the leaner /speckit.companion.* pipeline and capture.')}</span>
            <button type="button" class="install-banner__btn install-banner__btn--primary" data-action="installSpecKitExtension">{t('common.install', 'Install')}</button>
            <button type="button" class="install-banner__btn install-banner__btn--link" data-action="openReadme">{t('common.learnMore', 'Learn more')}</button>
            <button type="button" class="install-banner__dismiss codicon codicon-close" data-action="dismissInstallBanner" aria-label={t('common.dismiss', 'Dismiss install prompt')} />
        </div>
    );
}

function LatestFeed() {
    const entries = historyEntries.value
        .filter(entry => entry.kind === 'complete')
        .slice(-3)
        .reverse();
    if (entries.length === 0) return null;
    const fmtTime = (iso: string) => {
        const d = new Date(iso);
        return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return (
        <section class="activity-feed" aria-label={t('activity.latest', 'Latest activity')}>
            <span class="activity-feed__label">{t('activity.latest', 'Latest activity')}</span>
            <ul>
                {entries.map((entry, i) => (
                    <li key={`${entry.step}-${entry.at}-${i}`}>
                        <span class="activity-feed__mark" aria-hidden="true"></span>
                        <span class="activity-feed__text">
                            {entry.task
                                ? t('activity.taskFinished', '{task} finished', { task: entry.task })
                                : t('activity.stepComplete', '{step} complete', { step: `${entry.step}${entry.substep ? ` · ${entry.substep}` : ''}` })}
                        </span>
                        <time>{fmtTime(entry.at)}</time>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function hasRunLogData(state: ViewerState): boolean {
    return (
        (state.history?.length ?? 0) > 0 ||
        Object.keys(state.stepHistory ?? {}).length > 0 ||
        Object.keys(state.taskSummaries ?? {}).length > 0 ||
        (state.concerns?.length ?? 0) > 0 ||
        (state.filesModified?.length ?? 0) > 0 ||
        (state.reviewComments?.length ?? 0) > 0 ||
        !!state.lastAction
    );
}

export function ActivityPanel() {
    const state = viewerState.value;

    if (!state || !hasAnyData(state)) {
        return (
            <div class="activity-panel">
                <InstallBanner />
                <div class="activity-empty">{t('activity.noActivity', 'No activity recorded yet')}</div>
            </div>
        );
    }

    const taskCount = Object.keys(state.taskSummaries ?? {}).length;
    const runLogLabel = taskCount > 0
        ? t('activity.runLogTasks', 'Run log and {count} task records', { count: taskCount })
        : t('activity.runLog', 'Run log');

    return (
        <div class="activity-panel dossier">
            <InstallBanner />
            <IntentSection state={state} />
            <ExpectationsSection state={state} />
            <VerifiedSection state={state} />
            <DecisionsSection state={state} />
            <CoverageSection state={state} />
            {hasRunLogData(state) && (
                <details class="dossier-log">
                    <summary>{runLogLabel}</summary>
                    <div class="dossier-log__body">
                        {state.lastAction && <p class="dossier-log__last-action">{state.lastAction}</p>}
                        <LatestFeed />
                        <PhasesCard state={state} />
                        <TasksCard state={state} />
                        <ConcernsCard state={state} />
                        <FilesCard state={state} />
                        <CommentsCard state={state} />
                    </div>
                </details>
            )}
        </div>
    );
}
