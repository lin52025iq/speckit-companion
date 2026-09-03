export type UiLocale = 'en' | 'zh-CN';

const zhCN: Record<string, string> = {
    'common.install': '安装',
    'common.learnMore': '了解更多',
    'common.dismiss': '关闭',
    'nav.overview': '概览',
    'nav.pipeline': '流程',
    'nav.artifacts': '相关文档',
    'nav.markComplete': '标记完成',
    'nav.resume': '继续执行',
    'nav.setStatus': '设置状态…',
    'nav.markCompleteTitle': '将此规格标记为已完成',
    'nav.resumeTitle': '从上次停止的位置继续执行流程',
    'nav.setStatusTitle': '强制设置此规格的生命周期状态',
    'nav.specDocuments': '规格文档',
    'nav.livingSpecTiers': 'Living Spec 文档层级',
    'nav.files': '文件',
    'footer.scopeSpec': '影响整个规格',
    'footer.scopeStep': '影响当前步骤',
    'footer.stepRunning': '步骤执行中，完成后将解锁操作',
    'footer.archived': '已归档，只读',
    'footer.runComplete': '流程已完成',
    'footer.next': '下一步：{label}',
    'footer.otherActions': '其他操作',
    'step.spec': '定义规格 — 明确需求与验收场景',
    'step.plan': '制定计划 — 设计实现方案',
    'step.tasks': '生成任务 — 将方案拆分为工作项',
    'step.done': '实施 — 执行并交付',
    'step.disabled': '{label}（{step} 执行期间不可用）',
    'step.tasksComplete': '任务已完成 {percent}%',
    'activity.installRegion': '安装 SpecKit Companion CLI 扩展',
    'activity.installMessage': '安装 spec-kit Companion 扩展，以启用更精简的 /speckit.companion.* 流程和运行记录。',
    'activity.latest': '最新活动',
    'activity.noActivity': '暂无执行记录',
    'activity.taskFinished': '{task} 已完成',
    'activity.stepComplete': '{step} 已完成',
    'activity.runLog': '运行记录',
    'activity.runLogTasks': '运行记录及 {count} 条任务记录',
    'app.toc': '目录',
};

const literalZhCN: Record<string, string> = {
    'Overview': '概览',
    'Pipeline': '流程',
    'Artifacts': '相关文档',
    'Intent': '目标',
    'Approach': '方案',
    'Living specs': 'Living Specs',
    'Working area': '工作范围',
    'Size': '规模',
    'Expectations': '约束与预期',
    'The fence around the work': '本次工作的边界',
    'Must stay true': '必须保持成立',
    'Deliberately out of scope': '明确不在范围内',
    'Verified': '验证结果',
    'What was checked, and what happened': '检查了什么，以及结果如何',
    'Decisions': '关键决策',
    'Choices future work should not have to rediscover': '后续工作无需再次推导的选择',
    'Why': '原因',
    'Rejected': '未采用',
    'Coverage': '覆盖关系',
    'Requirement': '需求',
    'Delivery': '实现',
    'Evidence': '证据',
    'No test linked': '未关联测试',
    'Run overview': '运行概览',
    'Timing not recorded': '未记录耗时',
    'Phases': '阶段',
    'Started': '开始',
    'Elapsed': '耗时',
    'Ended': '结束',
    'Tasks': '任务',
    'Concerns': '注意事项',
    'Files touched': '涉及文件',
    'Review comments': '审阅意见',
    'Applied': '已应用',
    'Pending': '待处理',
    'Run refinement': '执行优化',
    'Latest activity': '最新活动',
    'Run log': '运行记录',
    'Other actions': '其他操作',
    'Mark complete': '标记完成',
    'Resume': '继续执行',
    'Set status…': '设置状态…',
    'Install': '安装',
    'Learn more': '了解更多',
    'User Scenarios & Testing': '用户场景与测试',
    'Acceptance Scenarios': '验收场景',
    'Edge Cases': '边界情况',
    'Requirements': '需求',
    'Functional Requirements': '功能需求',
    'Key Entities': '关键实体',
    'Success Criteria': '成功标准',
    'Measurable Outcomes': '可衡量结果',
    'Assumptions': '假设',
    'Why this priority': '优先级原因',
    'Independent Test': '独立测试',
    'Given': '前提',
    'When': '当',
    'Then': '则',
    'Summary': '摘要',
    'Technical Context': '技术上下文',
    'Constitution Check': 'Constitution 检查',
    'Project Structure': '项目结构',
    'Complexity Tracking': '复杂度记录',
    'Dependencies & Execution Order': '依赖与执行顺序',
    'Implementation Strategy': '实施策略',
    'Notes': '备注',
};

function detectLocale(): UiLocale {
    const language = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : '';
    return language === 'zh-cn' || language === 'zh-sg' || language.startsWith('zh-hans') ? 'zh-CN' : 'en';
}

export const uiLocale: UiLocale = detectLocale();

export function t(key: string, fallback: string, vars?: Record<string, string | number>): string {
    let text = uiLocale === 'zh-CN' ? (zhCN[key] ?? fallback) : fallback;
    if (vars) {
        for (const [name, value] of Object.entries(vars)) {
            text = text.replaceAll(`{${name}}`, String(value));
        }
    }
    return text;
}

function translateDynamic(text: string): string {
    let match = text.match(/^User Story (\d+) - (.+) \(Priority: (P\d+)\)$/);
    if (match) return `用户故事 ${match[1]} - ${match[2]}（优先级：${match[3]}）`;

    match = text.match(/^(\d+) passed · (\d+) warned$/);
    if (match) return `${match[1]} 项通过 · ${match[2]} 项有警告`;
    match = text.match(/^(\d+) passed$/);
    if (match) return `${match[1]} 项通过`;
    match = text.match(/^Show (\d+) more decisions?$/);
    if (match) return `再显示 ${match[1]} 条决策`;
    match = text.match(/^(\d+) tests? not found$/);
    if (match) return `${match[1]} 个测试未找到`;
    match = text.match(/^(\d+) of (\d+) found$/);
    if (match) return `找到 ${match[1]}/${match[2]}`;
    match = text.match(/^(\d+) tests?$/);
    if (match) return `${match[1]} 个测试`;
    match = text.match(/^(\d+)\/(\d+) traced$/);
    if (match) return `已追踪 ${match[1]}/${match[2]}`;
    match = text.match(/^Show all (\d+) requirements$/);
    if (match) return `显示全部 ${match[1]} 条需求`;
    match = text.match(/^Timing coverage: (\d+) of (\d+) phases$/);
    if (match) return `耗时记录覆盖 ${match[1]}/${match[2]} 个阶段`;
    match = text.match(/^(.+) elapsed$/);
    if (match) return `用时 ${match[1]}`;
    match = text.match(/^folded into (.+)$/);
    if (match) return `折叠到 ${match[1]}`;
    if (text === 'folded') return '已折叠';
    match = text.match(/^(\d+) files$/);
    if (match) return `${match[1]} 个文件`;
    match = text.match(/^(\d+) tasks$/);
    if (match) return `${match[1]} 个任务`;
    match = text.match(/^Open (.+)$/);
    if (match) return `打开 ${match[1]}`;
    match = text.match(/^Run refinement on (\d+) pending comments?$/);
    if (match) return `处理 ${match[1]} 条待处理审阅意见`;
    match = text.match(/^Run refinement \((\d+)\)$/);
    if (match) return `执行优化（${match[1]}）`;
    match = text.match(/^Run log and (\d+) task records?$/);
    if (match) return `运行记录及 ${match[1]} 条任务记录`;
    match = text.match(/^Next: (.+)$/);
    if (match) return `下一步：${match[1]}`;
    match = text.match(/^(.+) finished$/);
    if (match) return `${match[1]} 已完成`;
    match = text.match(/^(.+) complete$/);
    if (match) return `${match[1]} 已完成`;
    return text;
}

export function translateUiText(text: string): string {
    if (uiLocale !== 'zh-CN') return text;
    return literalZhCN[text] ?? translateDynamic(text);
}

function isMachineTextNode(node: Text): boolean {
    const parent = node.parentElement;
    return !!parent?.closest('code, pre, kbd, samp, script, style, textarea, input');
}

function localizeTextNode(node: Text): void {
    if (isMachineTextNode(node)) return;
    const original = node.nodeValue ?? '';
    const trimmed = original.trim();
    if (!trimmed) return;
    const translated = translateUiText(trimmed);
    if (translated !== trimmed) node.nodeValue = original.replace(trimmed, translated);
}

function localizeAttributes(element: Element): void {
    for (const name of ['title', 'aria-label'] as const) {
        const value = element.getAttribute(name);
        if (!value) continue;
        const translated = translateUiText(value);
        if (translated !== value) element.setAttribute(name, translated);
    }
}

function localizeNode(node: Node): void {
    if (uiLocale !== 'zh-CN') return;
    if (node.nodeType === Node.TEXT_NODE) {
        localizeTextNode(node as Text);
        return;
    }
    if (!(node instanceof Element) && !(node instanceof DocumentFragment) && !(node instanceof Document)) return;

    if (node instanceof Element) localizeAttributes(node);
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let current: Node | null = walker.currentNode;
    while (current) {
        if (current.nodeType === Node.TEXT_NODE) localizeTextNode(current as Text);
        else if (current instanceof Element) localizeAttributes(current);
        current = walker.nextNode();
    }
}

/**
 * Localize rendered Webview copy without changing the canonical Markdown source.
 * This intentionally skips code/pre/input content so identifiers, commands and
 * machine-readable protocol values remain untouched.
 */
export function installDomLocalization(root: Node = document.body): () => void {
    if (uiLocale !== 'zh-CN') return () => undefined;
    localizeNode(root);

    const observer = new MutationObserver(records => {
        for (const record of records) {
            if (record.type === 'characterData') {
                localizeNode(record.target);
                continue;
            }
            if (record.type === 'attributes' && record.target instanceof Element) {
                localizeAttributes(record.target);
                continue;
            }
            for (const added of Array.from(record.addedNodes)) localizeNode(added);
        }
    });
    observer.observe(root, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['title', 'aria-label'],
    });
    return () => observer.disconnect();
}
