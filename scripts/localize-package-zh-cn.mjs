import fs from 'node:fs';

const path = new URL('../package.json', import.meta.url);
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));

const translations = new Map(Object.entries({
  "See and steer everything your AI builds. Specs 60-68% leaner, same correctness. Live pipeline, per-phase timing, and living specs for GitHub SpecKit with Copilot, Claude, Gemini, and more.": "查看并掌控 AI 构建的一切。规格文档精简 60–68%，正确性不变。为 GitHub SpecKit 提供实时流水线、阶段耗时和 Living Specs，支持 Copilot、Claude、Gemini 等。",
  "Specs": "规格",
  "Living Specs": "Living Specs（活文档）",
  "Steering": "规则与引导",
  "Settings & Feedback": "设置与反馈",
  "Open a folder to start using SpecKit.\n\n[$(folder-opened) Open Folder](command:vscode.openFolder)": "打开一个文件夹即可开始使用 SpecKit。\n\n[$(folder-opened) 打开文件夹](command:vscode.openFolder)",
  "SpecKit CLI detected. Initialize this workspace to start building with specs.\n\n[$(gear) Initialize Workspace](command:speckit.initWorkspace)": "已检测到 SpecKit CLI。初始化当前工作区后即可开始使用规格驱动开发。\n\n[$(gear) 初始化工作区](command:speckit.initWorkspace)",
  "Configure your project principles to guide AI-assisted development.\n\n[$(book) Configure Constitution](command:speckit.constitution)\n\n[$(plus) Create New Spec](command:speckit.create)": "配置项目原则，用于指导 AI 辅助开发。\n\n[$(book) 配置 Constitution](command:speckit.constitution)\n\n[$(plus) 新建规格](command:speckit.create)",
  "Welcome to SpecKit\n\nA spec turns an idea into a plan and tasks your AI assistant can implement — and this panel shows every step as it runs.\n\n[$(plus) Create your first spec](command:speckit.create)\n\n[$(play) Open a live sample](command:speckit.openSampleSpec)": "欢迎使用 SpecKit\n\n规格会把一个想法转化为计划和可由 AI 助手执行的任务；此面板会实时展示执行过程中的每一步。\n\n[$(plus) 创建第一个规格](command:speckit.create)\n\n[$(play) 打开实时示例](command:speckit.openSampleSpec)",
  "No specs match the current filter.\n\n[$(clear-all) Clear filter](command:speckit.specs.filter.clear)": "没有规格符合当前筛选条件。\n\n[$(clear-all) 清除筛选](command:speckit.specs.filter.clear)",
  "[$(globe) Create User Rule](command:speckit.steering.createUserRule)\n\n[$(root-folder) Create Project Rule](command:speckit.steering.createProjectRule)": "[$(globe) 创建用户规则](command:speckit.steering.createUserRule)\n\n[$(root-folder) 创建项目规则](command:speckit.steering.createProjectRule)",
  "Install SpecKit CLI": "安装 SpecKit CLI",
  "Initialize SpecKit": "初始化 SpecKit",
  "New Spec": "新建规格",
  "Open a Live Sample": "打开实时示例",
  "Run Spec Hands-Off (Auto)": "自动运行规格流程",
  "Specify": "定义规格",
  "Plan": "制定计划",
  "Tasks": "生成任务",
  "Implement": "实施",
  "Clarify": "澄清",
  "Analyze": "分析",
  "Checklist": "检查清单",
  "Run Custom Command": "运行自定义命令",
  "Constitution": "项目原则（Constitution）",
  "Refresh Specs": "刷新规格",
  "Toggle Collapse/Expand All": "切换全部折叠/展开",
  "Collapse All": "全部折叠",
  "Expand All": "全部展开",
  "Filter…": "筛选…",
  "Clear Filter": "清除筛选",
  "Sort…": "排序…",
  "Delete": "删除",
  "Mark Complete": "标记为已完成",
  "Archive": "归档",
  "Reactivate": "重新激活",
  "Resume": "继续",
  "Set Status…": "设置状态…",
  "Mark All Complete": "全部标记为已完成",
  "Archive All": "全部归档",
  "Reactivate All": "全部重新激活",
  "New Steering Document…": "新建引导文档…",
  "Create User Rule": "创建用户规则",
  "Create Project Rule": "创建项目规则",
  "Refine Steering": "优化引导内容",
  "Delete Steering": "删除引导内容",
  "Refresh Steering": "刷新引导内容",
  "Refresh Agents": "刷新 Agents",
  "Refresh Skills": "刷新 Skills",
  "Refresh Hooks": "刷新 Hooks",
  "SpecKit Settings": "SpecKit 设置",
  "Check for Updates": "检查更新",
  "Report a Bug": "报告问题",
  "Request a Feature": "提出功能建议",
  "Rate on Marketplace": "在 Marketplace 评分",
  "Sponsor SpecKit Companion": "赞助 SpecKit Companion",
  "Upgrade CLI": "升级 CLI",
  "Upgrade Project Files": "升级项目文件",
  "Upgrade All (CLI + Project)": "全部升级（CLI + 项目）",
  "Upgrade…": "升级…",
  "Install Companion Extension": "安装 Companion 扩展",
  "About the Companion Extension": "关于 Companion 扩展",
  "Edit Source": "编辑源文件",
  "Refine Section": "优化此章节",
  "Remove Section": "移除此章节",
  "Add User Story": "添加用户故事",
  "Approve & Continue": "批准并继续",
  "Regenerate": "重新生成",
  "Navigate to Phase": "跳转到阶段",
  "Open Spec Editor": "打开规格编辑器",
  "View Spec Document": "查看规格文档",
  "Open Spec": "打开规格",
  "Open Source File": "打开源文件",
  "Reveal in File Manager": "在文件管理器中显示",
  "Reveal in VS Code Explorer": "在 VS Code 资源管理器中显示",
  "Copy Spec Path": "复制规格路径",
  "Copy Spec Name": "复制规格名称",
  "Check for Drift": "检查漂移",
  "Check Requirement Coverage": "检查需求覆盖率",
  "Adopt Code Area…": "纳入代码区域…",
  "Sync living specs from my changes": "根据我的更改同步 Living Specs",
  "Refresh Living Specs": "刷新 Living Specs",
  "Update to Match Code": "更新以匹配代码",
  "Copy Name": "复制名称",
  "Copy Path": "复制路径",
  "Copy Relative Path": "复制相对路径",
  "Install SpecKit Companion": "安装 SpecKit Companion",
  "Dismiss Companion Install Prompt": "关闭 Companion 安装提示",
  "More Actions…": "更多操作…",
  "Companion & Telemetry": "Companion 与遥测",
  "Get started with SpecKit Companion": "开始使用 SpecKit Companion",
  "Read a real spec in about a minute, then take an idea of your own from spec to plan to tasks without leaving the editor.": "用大约一分钟阅读一个真实规格，然后无需离开编辑器，就能把自己的想法从规格推进到计划和任务。",
  "Open a project": "打开项目",
  "See what a spec looks like": "了解规格的样子",
  "Install the Spec Kit CLI": "安装 Spec Kit CLI",
  "Set up this project": "配置当前项目",
  "Write your first spec": "编写第一个规格",
  "Read the Overview it leaves behind": "阅读生成的概览"
}));

const translatedKeys = new Set([
  'description', 'markdownDescription', 'title', 'label', 'name',
  'contents', 'placeHolder', 'enumDescriptions', 'altText'
]);

function translateValue(value) {
  if (typeof value === 'string') return translations.get(value) ?? value;
  if (Array.isArray(value)) return value.map(translateValue);
  return value;
}

function walk(node) {
  if (Array.isArray(node)) {
    node.forEach(walk);
    return;
  }
  if (!node || typeof node !== 'object') return;
  for (const [key, value] of Object.entries(node)) {
    if (translatedKeys.has(key)) node[key] = translateValue(value);
    if (node[key] && typeof node[key] === 'object') walk(node[key]);
  }
}

walk(pkg);
fs.writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`);
