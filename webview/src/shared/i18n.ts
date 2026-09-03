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
