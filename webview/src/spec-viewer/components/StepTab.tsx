import type { SpecDocument, StalenessMap } from '../types';
import { viewerState } from '../signals';
import { IMPLEMENT_STEP, isStepInFlight } from '../stepInFlight';
import { t } from '../../shared/i18n';
import { ElapsedTimer } from './ElapsedTimer';

const DOC_TO_STEP: Record<string, string> = {
    spec: 'specify',
    plan: 'plan',
    tasks: 'tasks',
};

function stepTooltip(phase: string, fallback: string): string {
    if (phase === 'spec') return t('step.spec', 'Specify — define requirements and scenarios');
    if (phase === 'plan') return t('step.plan', 'Plan — design the implementation approach');
    if (phase === 'tasks') return t('step.tasks', 'Tasks — break the plan into work items');
    if (phase === 'done') return t('step.done', 'Implement — execute and ship');
    return fallback;
}

export interface StepTabProps {
    doc: SpecDocument;
    index: number;
    currentDoc: string;
    taskCompletionPercent: number;
    isViewingRelatedDoc: boolean;
    parentPhaseForRelated: string;
    activeStep?: string | null;
    currentStep?: string | null;
    stepHistory?: Record<string, { startedAt?: string; completedAt?: string | null }>;
    stalenessMap?: StalenessMap;
    hasRelatedChildren?: boolean;
    runningStepIndex?: number | null;
    isPercentHost?: boolean;
    onClick: (phase: string) => void;
}

export function StepTab(props: StepTabProps) {
    const { doc, index, currentDoc,
        taskCompletionPercent, isViewingRelatedDoc, parentPhaseForRelated,
        activeStep, currentStep, stepHistory, stalenessMap, hasRelatedChildren,
        runningStepIndex, isPercentHost, onClick } = props;

    const phase = doc.type;
    const stepDocExists = doc.exists;
    const exists = stepDocExists || !!hasRelatedChildren;
    const isViewing = phase === currentDoc || (isViewingRelatedDoc && phase === parentPhaseForRelated);
    const isStale = stalenessMap?.[phase]?.isStale ?? false;
    const stepName = DOC_TO_STEP[phase] ?? phase;
    const vs = viewerState.value;

    const run = {
        status: vs?.status,
        activeStep,
        currentStep,
        stepBadges: vs?.steps,
        stepHistory,
        taskCompletionPercent,
    };
    const hostsRunningImplement = !!isPercentHost && isStepInFlight(IMPLEMENT_STEP, run);
    const isWorking = isStepInFlight(stepName, run) || hostsRunningImplement;
    const isLocked = runningStepIndex != null
        && index > runningStepIndex
        && !isViewing
        && !stepDocExists;
    const isClickable = (exists || index === 0) && !isLocked;
    const vsCompleted = (vs?.highlights?.includes(stepName) ?? false) && stepDocExists;
    const vsSubstep = vs?.activeSubstep?.step === stepName ? vs.activeSubstep.name : null;

    let canonicalState: 'current' | 'done' | 'in-flight' | 'locked' | null = null;
    if (isLocked) canonicalState = 'locked';
    else if (isWorking) canonicalState = 'in-flight';
    else if (stepDocExists || vsCompleted) canonicalState = 'done';
    else if (isViewing) canonicalState = 'current';

    const classes = [
        'step-tab',
        canonicalState,
        canonicalState !== 'current' && isViewing && 'current',
        isStale && 'stale',
    ].filter(Boolean).join(' ');

    const showPercentLabel = canonicalState === 'in-flight' && hostsRunningImplement;
    const statusIcon = canonicalState === 'done' && !showPercentLabel ? '✓' : '';
    const showSyncGlyph = canonicalState === 'in-flight';

    const baseTooltip = stepTooltip(phase, doc.label);
    const tooltip = isLocked
        ? t('step.disabled', '{label} (disabled while {step} is running)', { label: baseTooltip, step: activeStep ?? '' })
        : baseTooltip;

    const runEntry = stepHistory?.[stepName];
    const runningStartedAt = canonicalState === 'in-flight'
        && runEntry?.startedAt
        && !runEntry.completedAt
        && !hostsRunningImplement
        ? runEntry.startedAt
        : null;

    return (
        <button
            class={classes}
            data-phase={phase}
            title={tooltip}
            aria-current={isViewing ? 'page' : undefined}
            aria-disabled={!isClickable}
            disabled={!isClickable}
            onClick={() => isClickable && phase !== 'done' && onClick(phase)}
        >
            {!showPercentLabel && (
                <span class="step-status">
                    {showSyncGlyph
                        ? <span class="codicon codicon-sync step-status__sync" aria-hidden="true" />
                        : statusIcon}
                </span>
            )}
            <span class="step-label">{doc.label}</span>
            {showPercentLabel && (
                <span
                    class="step-tab__percent"
                    style={{ '--impl-progress': taskCompletionPercent / 100 } as Record<string, string | number>}
                    aria-label={t('step.tasksComplete', '{percent}% of tasks complete', { percent: taskCompletionPercent })}
                >
                    {showSyncGlyph && (
                        <span class="codicon codicon-sync step-status__sync" aria-hidden="true" />
                    )}
                    {taskCompletionPercent}%
                </span>
            )}
            {vsSubstep && <span class="step-tab__substep">{vsSubstep}</span>}
            {runningStartedAt && <ElapsedTimer startedAt={runningStartedAt} />}
            {isStale && <span class="stale-badge">!</span>}
        </button>
    );
}
