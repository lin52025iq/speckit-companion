import { useRef, useEffect, useState } from 'preact/hooks';
import { NavigationBar } from './components/NavigationBar';
import { StaleBanner } from './components/StaleBanner';
import { PageChrome } from './components/PageChrome';
import { FooterActions } from './components/FooterActions';
import { ActivityPanel } from './components/ActivityPanel';
import { ActivityErrorBoundary } from './components/ActivityErrorBoundary';
import { markdownHtml, navState, showingOverview, viewerState } from './signals';
import { restoreComments, clearAllRefinements } from './editor';
import { installDomLocalization, t } from '../shared/i18n';

export interface AppProps {
    specStatus: string;
}

export function App({ specStatus }: AppProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const html = markdownHtml.value;
    const ns = navState.value;
    const vs = viewerState.value;
    const reviewComments = vs?.reviewComments;

    const living = !!ns?.livingMode;
    const showOverview = showingOverview.value;

    const [hasMountedActivity, setHasMountedActivity] = useState(false);
    useEffect(() => {
        if (showOverview) setHasMountedActivity(true);
    }, [showOverview]);

    // Keep canonical Markdown/source strings untouched and localize only the
    // rendered Webview surface. The observer also covers Preact updates and
    // dynamically rendered Overview/activity content.
    useEffect(() => installDomLocalization(document.body), []);

    useEffect(() => {
        if (html && contentRef.current) {
            contentRef.current.dispatchEvent(new CustomEvent('content-rendered'));
        }
    }, [html]);

    useEffect(() => {
        if (html && contentRef.current) {
            clearAllRefinements();
            restoreComments();
        }
    }, [html]);
    useEffect(() => {
        if (html && contentRef.current) restoreComments();
    }, [reviewComments]);

    useEffect(() => {
        const has = !!(ns?.specContextName || ns?.badgeText);
        document.body.dataset.hasSpecContext = has ? 'true' : 'false';
    }, [ns?.specContextName, ns?.badgeText]);

    return (
        <>
            <PageChrome />
            {living && (
                <nav class="compact-nav">
                    <NavigationBar />
                </nav>
            )}
            <div class={`shell-grid${living ? ' shell-grid--no-rail' : ''}`}>
                {!living && <NavigationBar />}
                <div class="main-column">
                    <StaleBanner />
                    <main class="content-area" id="content-area">
                        <div
                            id="markdown-content"
                            ref={contentRef}
                            dangerouslySetInnerHTML={{ __html: html }}
                            hidden={showOverview}
                        />
                        {hasMountedActivity && (
                            <div class="overview-pane" hidden={!showOverview}>
                                <ActivityErrorBoundary>
                                    <ActivityPanel />
                                </ActivityErrorBoundary>
                            </div>
                        )}
                        <aside class="spec-toc" id="spec-toc" aria-label={t('app.toc', 'Table of contents')} hidden={showOverview}></aside>
                    </main>
                </div>
            </div>
            <FooterActions initialSpecStatus={specStatus} />
        </>
    );
}
