import type { VSCodeApi, SpecDocument } from '../types';
import { navState, overviewAvailable, showingOverview, viewerMode } from '../signals';
import { t } from '../../shared/i18n';
import { StepTab } from './StepTab';

declare const vscode: VSCodeApi;

export function NavigationBar() {
    const ns = navState.value;
    if (!ns) return null;

    const { coreDocs, relatedDocs, currentDoc,
        taskCompletionPercent, isViewingRelatedDoc, activeStep,
        currentStep, stepHistory, stalenessMap } = ns;

    if (ns.livingMode) {
        const tiers = coreDocs.filter(d => d.exists);
        if (tiers.length <= 1) return null;
        return (
            <div class="step-children" aria-label={t('nav.livingSpecTiers', 'Living spec tiers')}>
                <div class="step-children-tabs">
                    {tiers.map(doc => (
                        <button
                            key={doc.type}
                            class={`step-child ${doc.type === currentDoc ? 'active' : ''}`}
                            data-doc={doc.type}
                            aria-current={doc.type === currentDoc ? 'page' : undefined}
                            onClick={() => vscode.postMessage({ type: 'switchDocument', documentType: doc.type })}
                        >
                            {doc.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const railDocs = (coreDocs ?? []).filter(d => d.category !== 'action');
    const rootPhase = railDocs[0]?.type || 'spec';
    const percentHostType = railDocs.find(d => d.type === 'implement')?.type
        ?? railDocs[railDocs.length - 1]?.type;
    const viewingRelatedDoc = isViewingRelatedDoc
        ? relatedDocs.find(d => d.type === currentDoc)
        : undefined;
    const parentPhaseForRelated = viewingRelatedDoc?.parentStep || rootPhase;

    const runningStepIndex = (() => {
        if (!stepHistory) return null;
        for (const [stepKey, entry] of Object.entries(stepHistory)) {
            if (entry?.startedAt && !entry?.completedAt) {
                const idx = railDocs.findIndex(d => d.type === stepKey);
                if (idx >= 0) return idx;
            }
        }
        return null;
    })();

    const handleClick = (phase: string) => {
        viewerMode.value = 'document';
        vscode.postMessage({ type: 'stepperClick', phase });
    };

    const handleRelatedClick = (docType: string) => {
        viewerMode.value = 'document';
        vscode.postMessage({ type: 'switchDocument', documentType: docType });
    };

    const railTypes = new Set(railDocs.map(d => d.type));
    const childrenFor = (stepType: string): SpecDocument[] =>
        relatedDocs.filter(d => d.exists && (d.parentStep || rootPhase) === stepType);

    const orphanGroups: Array<{ parent: SpecDocument | undefined; key: string; docs: SpecDocument[] }> = [];
    for (const doc of relatedDocs) {
        if (!doc.exists) continue;
        const parentType = doc.parentStep || rootPhase;
        if (railTypes.has(parentType)) continue;
        let group = orphanGroups.find(g => g.key === parentType);
        if (!group) {
            group = { parent: coreDocs.find(d => d.type === parentType), key: parentType, docs: [] };
            orphanGroups.push(group);
        }
        group.docs.push(doc);
    }

    const recovery = ns.runRecovery;
    const hasOverview = overviewAvailable.value;
    const onOverview = showingOverview.value;
    const selectedDoc = onOverview ? '' : currentDoc;

    return (
        <nav class="doc-rail" aria-label={t('nav.specDocuments', 'Spec documents')}>
            {hasOverview && (
                <div class="rail-group">
                    <button
                        type="button"
                        class={`rail-overview${onOverview ? ' current' : ''}`}
                        aria-current={onOverview ? 'page' : undefined}
                        onClick={() => { viewerMode.value = 'overview'; }}
                    >
                        <span class="codicon codicon-book" aria-hidden="true" />
                        {t('nav.overview', 'Overview')}
                    </button>
                </div>
            )}
            {recovery?.show && (
                <div class={`run-recovery run-recovery--${recovery.mode}`} role="status">
                    <span class="run-recovery__msg" title={recovery.message}>{recovery.message}</span>
                    <div class="run-recovery__actions">
                        {recovery.mode === 'stale' ? (
                            <button
                                type="button"
                                class="run-recovery__btn run-recovery__btn--primary"
                                title={t('nav.markCompleteTitle', 'Mark this spec as completed')}
                                onClick={() => vscode.postMessage({ type: 'completeSpec' })}
                            >
                                {t('nav.markComplete', 'Mark complete')}
                            </button>
                        ) : (
                            <button
                                type="button"
                                class="run-recovery__btn run-recovery__btn--primary"
                                title={t('nav.resumeTitle', 'Resume the pipeline from where it left off')}
                                onClick={() => vscode.postMessage({ type: 'resumeRun' })}
                            >
                                {t('nav.resume', 'Resume')}
                            </button>
                        )}
                        <button
                            type="button"
                            class="run-recovery__btn"
                            title={t('nav.setStatusTitle', 'Force this spec to a lifecycle status')}
                            onClick={() => vscode.postMessage({ type: 'setStatus' })}
                        >
                            {t('nav.setStatus', 'Set status…')}
                        </button>
                    </div>
                </div>
            )}
            <div class="rail-group">
                <p class="rail-label">{t('nav.pipeline', 'Pipeline')}</p>
                <div class="step-tabs">
                    {railDocs.map((doc, i) => {
                        const children = childrenFor(doc.type);
                        return (
                            <div class="step-tab-group" key={doc.type}>
                                <StepTab
                                    doc={doc}
                                    index={i}
                                    currentDoc={selectedDoc}
                                    taskCompletionPercent={taskCompletionPercent}
                                    isViewingRelatedDoc={!onOverview && isViewingRelatedDoc}
                                    parentPhaseForRelated={parentPhaseForRelated}
                                    activeStep={activeStep}
                                    currentStep={currentStep}
                                    stepHistory={stepHistory}
                                    stalenessMap={stalenessMap}
                                    hasRelatedChildren={children.length > 0}
                                    runningStepIndex={runningStepIndex}
                                    isPercentHost={doc.type === percentHostType}
                                    onClick={handleClick}
                                />
                                {children.length > 0 && (
                                    <ul class="step-substeps" aria-label={`${doc.label} ${t('nav.files', 'files')}`}>
                                        {children.map(child => (
                                            <li key={child.type}>
                                                <button
                                                    class={`step-child ${child.type === selectedDoc ? 'active' : ''}`}
                                                    data-doc={child.type}
                                                    aria-current={child.type === selectedDoc ? 'page' : undefined}
                                                    onClick={() => handleRelatedClick(child.type)}
                                                >
                                                    {child.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {orphanGroups.map(group => {
                const label = group.parent ? `${group.parent.label} ${t('nav.files', 'files')}` : t('nav.artifacts', 'Artifacts');
                return (
                    <div class="rail-group" key={group.key}>
                        <p class="rail-label">{label}</p>
                        <ul class="step-substeps" aria-label={label}>
                            {group.docs.map(doc => (
                                <li key={doc.type}>
                                    <button
                                        class={`step-child ${doc.type === selectedDoc ? 'active' : ''}`}
                                        data-doc={doc.type}
                                        aria-current={doc.type === selectedDoc ? 'page' : undefined}
                                        onClick={() => handleRelatedClick(doc.type)}
                                    >
                                        {doc.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </nav>
    );
}
