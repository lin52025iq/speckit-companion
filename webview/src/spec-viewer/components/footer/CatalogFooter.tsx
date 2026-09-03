import { useState } from 'preact/hooks';
import { Button, type ButtonVariant } from '../../../shared/components/Button';
import { Toast } from '../../../shared/components/Toast';
import { t } from '../../../shared/i18n';
import type {
    EnhancementButton,
    SerializedFooterAction,
    ViewerState,
    VSCodeApi,
    ViewerToExtensionMessage,
} from '../../types';

declare const vscode: VSCodeApi;

const SCOPE_SUFFIX: Record<'spec' | 'step', () => string> = {
    spec: () => t('footer.scopeSpec', 'Affects whole spec'),
    step: () => t('footer.scopeStep', 'Affects this step'),
};

function withScopeSuffix(a: SerializedFooterAction): string {
    return `${a.tooltip} (${SCOPE_SUFFIX[a.scope]()})`;
}

function actionVariant(id: string): ButtonVariant {
    if (id === 'refine') return 'enhancement';
    if (id === 'approve' || id === 'start' || id === 'complete' || id === 'reactivate') return 'primary';
    return 'secondary';
}

export interface CatalogFooterProps {
    vs: ViewerState;
    isActive: boolean;
    stepInFlight?: boolean;
    enhancementButtons: EnhancementButton[];
}

export function CatalogFooter({ vs, isActive, stepInFlight = false, enhancementButtons }: CatalogFooterProps) {
    const send = (msg: ViewerToExtensionMessage) => () => vscode.postMessage(msg);
    const sendFooter = (id: string) => () => vscode.postMessage({ type: 'footerAction', id });
    const [menuOpen, setMenuOpen] = useState(false);

    const visible = vs.footer;
    const LEFT_IDS = new Set(['regenerate']);
    const RIGHT_IDS = new Set(['refine', 'approve', 'reactivate', 'archive', 'complete', 'start']);
    const FORWARD_MOTION_IDS = new Set(['approve', 'start']);
    const leftActions = visible.filter((a) => LEFT_IDS.has(a.id));
    const rightActions = visible.filter(
        (a) => RIGHT_IDS.has(a.id) && !(stepInFlight && FORWARD_MOTION_IDS.has(a.id)),
    );

    const specClosureReady = visible.some((a) => a.id === 'complete' || a.id === 'reactivate');

    const renderAction = (a: SerializedFooterAction) => (
        <Button
            key={a.id}
            label={a.label}
            variant={actionVariant(a.id)}
            title={withScopeSuffix(a)}
            onClick={sendFooter(a.id)}
        />
    );

    const forward = rightActions.find(
        (a) => a.id === 'approve' || a.id === 'start' || a.id === 'complete',
    );
    const settled = vs.status === 'completed' || vs.status === 'archived';
    let context = '';
    if (stepInFlight) context = t('footer.stepRunning', 'Step running, actions unlock when it settles');
    else if (settled) context = vs.status === 'archived'
        ? t('footer.archived', 'Archived, read-only')
        : t('footer.runComplete', 'Run complete');
    else if (forward) context = t('footer.next', 'Next: {label}', { label: forward.label });

    const showEnhancements = isActive && !specClosureReady && enhancementButtons.length > 0;

    return (
        <footer class="actions">
            <Toast id="action-toast" />
            {context && <span class="footer-context">{context}</span>}
            <div class="actions-left">
                {leftActions.map(renderAction)}
                {showEnhancements && (
                    <div class="action-wrap">
                        <button
                            type="button"
                            class="secondary"
                            aria-expanded={menuOpen}
                            aria-haspopup="menu"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {t('footer.otherActions', 'Other actions')}
                        </button>
                        {menuOpen && (
                            <div class="action-menu" role="menu">
                                {enhancementButtons.map((btn) => (
                                    <button
                                        key={btn.command}
                                        role="menuitem"
                                        title={btn.tooltip || btn.label}
                                        onClick={() => {
                                            send({ type: 'clarify', command: btn.command })();
                                            setMenuOpen(false);
                                        }}
                                    >
                                        {btn.label}
                                        {btn.tooltip && <small>{btn.tooltip}</small>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div class="actions-right">
                {rightActions.map(renderAction)}
            </div>
        </footer>
    );
}
