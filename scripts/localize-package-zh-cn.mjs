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
  "Welcome to SpecKit\n\nA spec turns an idea into a plan and tasks your AI assistant can implement — and this panel shows every step as it runs.\n\n[$(plus) Create your first spec](command:speckit.create)\n\n[$(play) Open a live sample](command:speckit.openSampleSpec)\n\nSpecKit Companion adds living specs, lifecycle capture, and a fast-path for small changes.\n\n[$(rocket) Install SpecKit Companion](command:speckit.companion.installNudge?%5B%22welcome%22%5D)\n\n[Dismiss](command:speckit.companion.dismissInstallNudge)": "欢迎使用 SpecKit\n\n规格会把一个想法转化为计划和可由 AI 助手执行的任务；此面板会实时展示执行过程中的每一步。\n\n[$(plus) 创建第一个规格](command:speckit.create)\n\n[$(play) 打开实时示例](command:speckit.openSampleSpec)\n\nSpecKit Companion 还提供 Living Specs、生命周期记录以及适合小型改动的快速路径。\n\n[$(rocket) 安装 SpecKit Companion](command:speckit.companion.installNudge?%5B%22welcome%22%5D)\n\n[忽略](command:speckit.companion.dismissInstallNudge)",
  "No specs match the current filter.\n\n[$(clear-all) Clear filter](command:speckit.specs.filter.clear)": "没有规格符合当前筛选条件。\n\n[$(clear-all) 清除筛选](command:speckit.specs.filter.clear)",
  "[$(globe) Create User Rule](command:speckit.steering.createUserRule)\n\n[$(root-folder) Create Project Rule](command:speckit.steering.createProjectRule)": "[$(globe) 创建用户规则](command:speckit.steering.createUserRule)\n\n[$(root-folder) 创建项目规则](command:speckit.steering.createProjectRule)",
  "Install SpecKit CLI": "安装 SpecKit CLI", "Initialize SpecKit": "初始化 SpecKit", "New Spec": "新建规格", "Open a Live Sample": "打开实时示例",
  "Run Spec Hands-Off (Auto)": "自动运行规格流程", "Specify": "定义规格", "Plan": "制定计划", "Tasks": "生成任务", "Implement": "实施", "Clarify": "澄清", "Analyze": "分析", "Checklist": "检查清单",
  "Run Custom Command": "运行自定义命令", "Constitution": "项目原则（Constitution）", "Refresh Specs": "刷新规格", "Toggle Collapse/Expand All": "切换全部折叠/展开", "Collapse All": "全部折叠", "Expand All": "全部展开",
  "Filter…": "筛选…", "Clear Filter": "清除筛选", "Sort…": "排序…", "Delete": "删除", "Mark Complete": "标记为已完成", "Archive": "归档", "Reactivate": "重新激活", "Resume": "继续", "Set Status…": "设置状态…",
  "Mark All Complete": "全部标记为已完成", "Archive All": "全部归档", "Reactivate All": "全部重新激活", "New Steering Document…": "新建引导文档…", "Create User Rule": "创建用户规则", "Create Project Rule": "创建项目规则",
  "Refine Steering": "优化引导内容", "Delete Steering": "删除引导内容", "Refresh Steering": "刷新引导内容", "Refresh Agents": "刷新 Agents", "Refresh Skills": "刷新 Skills", "Refresh Hooks": "刷新 Hooks", "SpecKit Settings": "SpecKit 设置",
  "Check for Updates": "检查更新", "Report a Bug": "报告问题", "Request a Feature": "提出功能建议", "Rate on Marketplace": "在 Marketplace 评分", "Sponsor SpecKit Companion": "赞助 SpecKit Companion", "Upgrade CLI": "升级 CLI",
  "Upgrade Project Files": "升级项目文件", "Upgrade All (CLI + Project)": "全部升级（CLI + 项目）", "Upgrade…": "升级…", "Install Companion Extension": "安装 Companion 扩展", "About the Companion Extension": "关于 Companion 扩展",
  "Edit Source": "编辑源文件", "Refine Section": "优化此章节", "Remove Section": "移除此章节", "Add User Story": "添加用户故事", "Approve & Continue": "批准并继续", "Regenerate": "重新生成", "Navigate to Phase": "跳转到阶段",
  "Open Spec Editor": "打开规格编辑器", "View Spec Document": "查看规格文档", "Open Spec": "打开规格", "Open Source File": "打开源文件", "Reveal in File Manager": "在文件管理器中显示", "Reveal in VS Code Explorer": "在 VS Code 资源管理器中显示",
  "Copy Spec Path": "复制规格路径", "Copy Spec Name": "复制规格名称", "Check for Drift": "检查漂移", "Check Requirement Coverage": "检查需求覆盖率", "Adopt Code Area…": "纳入代码区域…", "Sync living specs from my changes": "根据我的更改同步 Living Specs",
  "Refresh Living Specs": "刷新 Living Specs", "Update to Match Code": "更新以匹配代码", "Copy Name": "复制名称", "Copy Path": "复制路径", "Copy Relative Path": "复制相对路径", "Install SpecKit Companion": "安装 SpecKit Companion",
  "Dismiss Companion Install Prompt": "关闭 Companion 安装提示", "More Actions…": "更多操作…", "Companion & Telemetry": "Companion 与遥测",

  "Prepend a short context-update preamble to every SpecKit step prompt dispatched to the AI CLI, instructing the AI to keep .spec-context.json current with canonical substeps (plan.research, implement.run-tests, etc.). Disable if your AI ignores the preamble or you're debugging raw prompts.": "在发送给 AI CLI 的每个 SpecKit 步骤提示词前添加一段简短的上下文更新说明，要求 AI 使用标准子步骤（如 plan.research、implement.run-tests）持续更新 .spec-context.json。如果 AI 会忽略此前言，或你正在调试原始提示词，可关闭此项。",
  "Show a notification when a spec step or task phase completes.": "当规格步骤或任务阶段完成时显示通知。",
  "Claude Code - Full feature support (steering, agents, skills, hooks)": "Claude Code — 完整功能支持（引导规则、Agents、Skills、Hooks）",
  "Claude Code (VS Code) - Opens the Claude Code panel (anthropic.claude-code) and pre-fills the prompt (press Enter to send)": "Claude Code（VS Code）— 打开 Claude Code 面板（anthropic.claude-code）并预填提示词（按 Enter 发送）",
  "Gemini CLI - Steering support": "Gemini CLI — 支持引导规则",
  "GitHub Copilot CLI - Steering and agents support": "GitHub Copilot CLI — 支持引导规则和 Agents",
  "Codex CLI - Steering and skills support": "Codex CLI — 支持引导规则和 Skills",
  "Qwen Code - Steering support": "Qwen Code — 支持引导规则",
  "OpenCode - Steering and agents support (AGENTS.md)": "OpenCode — 支持引导规则和 Agents（AGENTS.md）",
  "IDE Chat - Routes prompts to the host editor's built-in AI chat (Copilot / Cursor / Windsurf)": "IDE Chat — 将提示词发送到宿主编辑器内置的 AI 聊天（Copilot / Cursor / Windsurf）",
  "Wibey CLI - Walmart's built-in AI coding assistant (dispatches SpecKit commands to the wibey CLI in a VS Code terminal)": "Wibey CLI — Walmart 内置 AI 编程助手（在 VS Code 终端中将 SpecKit 命令发送给 wibey CLI）",
  "Wibey (VS Code) - Opens the Wibey chat panel and pre-fills the command (uses wibey.sendPrompt when available, clipboard fallback otherwise)": "Wibey（VS Code）— 打开 Wibey 聊天面板并预填命令（可用时使用 wibey.sendPrompt，否则回退到剪贴板）",
  "Antigravity - Google's agentic coding agent (runs the `agy` CLI interactively in a VS Code terminal)": "Antigravity — Google 的智能体编程工具（在 VS Code 终端中交互式运行 `agy` CLI）",
  "AI assistant to use for spec generation": "用于生成规格的 AI 助手",
  "Use provider default (Claude/Codex → dash, Gemini/Copilot/Qwen → dot)": "使用提供商默认格式（Claude/Codex → 短横线，Gemini/Copilot/Qwen → 点号）",
  "Always use dot notation (speckit.plan)": "始终使用点号格式（speckit.plan）",
  "Always use dash notation (speckit-plan)": "始终使用短横线格式（speckit-plan）",
  "Command format for speckit commands sent to AI CLI tools. Use 'auto' to let the provider decide, or override to 'dot' (speckit.plan) or 'dash' (speckit-plan) if your speckit version requires a specific format.": "发送给 AI CLI 工具的 speckit 命令格式。使用 'auto' 由提供商决定；如果当前 speckit 版本要求特定格式，可强制使用 'dot'（speckit.plan）或 'dash'（speckit-plan）。",
  "The CLI prompts before taking actions (recommended)": "CLI 在执行操作前请求确认（推荐）",
  "(YOLO) Skip all permission prompts. Faster but no review of tool calls.": "（YOLO）跳过所有权限确认。速度更快，但不会审查工具调用。",
  "Controls how the AI CLI handles permission prompts. 'interactive' is honored only by providers whose CLI supports interactive prompting (Claude, Gemini, Codex, Qwen, OpenCode). Copilot's CLI cannot surface prompts in -p mode and is auto-switched to auto-approve at dispatch time, regardless of this setting — dismissing the startup warning will not re-enable interactive mode for Copilot.": "控制 AI CLI 如何处理权限提示。只有支持交互式确认的 CLI（Claude、Gemini、Codex、Qwen、OpenCode）会遵循 'interactive'。Copilot CLI 在 -p 模式下无法显示确认提示，因此无论此设置为何，发送时都会自动切换到 auto-approve；关闭启动警告也不会为 Copilot 重新启用交互模式。",
  "Glob patterns for spec directories. Simple names (e.g. 'specs') list their children as specs. Patterns with wildcards (e.g. 'openspec/changes/*') treat each match as a spec folder. '.specify/specs' is included by default so specs created under the SpecKit CLI's '.specify/specs/' layout are discovered. Use step-level subDir to discover sub-specs within each match.": "规格目录的 Glob 模式。简单目录名（如 'specs'）会把其子目录作为规格；带通配符的模式（如 'openspec/changes/*'）会把每个匹配项作为规格目录。默认包含 '.specify/specs'，因此能发现 SpecKit CLI 在 '.specify/specs/' 布局下创建的规格。可使用步骤级 subDir 在每个匹配项中发现子规格。",
  "Custom SpecKit slash commands available in 'Run Custom Command'. Each entry can be a string (command name) or an object with name, title, command, step, tooltip, requiresSpecDir, and autoExecute.": "“运行自定义命令”中可用的自定义 SpecKit 斜杠命令。每项可以是字符串（命令名称），也可以是包含 name、title、command、step、tooltip、requiresSpecDir、autoExecute 的对象。",
  "Command name (e.g., \"review\" becomes /speckit.review)": "命令名称（例如 \"review\" 会变为 /speckit.review）",
  "Display title in the picker": "选择器中显示的标题",
  "Full slash command (e.g., \"/speckit.review\"). If omitted, name is used.": "完整斜杠命令（例如 \"/speckit.review\"）。省略时使用 name。",
  "Append or inject the spec directory (default: true)": "追加或注入规格目录（默认：true）",
  "Auto-run the command in the terminal (default: true)": "在终端中自动运行命令（默认：true）",
  "Which phase to show this command in (spec, plan, tasks, or all)": "在哪个阶段显示此命令（spec、plan、tasks 或 all）",
  "Tooltip text shown on hover": "悬停时显示的提示文本",
  "Show Steering view": "显示“规则与引导”视图",
  "Show Settings view": "显示“设置”视图",
  "Custom workflow definitions for spec-driven development": "规格驱动开发的自定义工作流定义",
  "Unique workflow identifier (lowercase, hyphenated)": "唯一工作流标识（小写、使用短横线）",
  "Display name shown in workflow picker": "工作流选择器中显示的名称",
  "Description shown in workflow picker": "工作流选择器中显示的说明",
  "Custom command for specify step": "specify 步骤的自定义命令",
  "Custom command for plan step": "plan 步骤的自定义命令",
  "Custom command for tasks step": "tasks 步骤的自定义命令",
  "Custom command for implement step": "implement 步骤的自定义命令",
  "Custom command buttons shown next to step actions (e.g., next to Submit for specify step)": "显示在步骤操作旁的自定义命令按钮（例如 specify 步骤的 Submit 旁）",
  "Unique command identifier": "唯一命令标识",
  "Button label (e.g., 'Auto Mode')": "按钮标签（例如 'Auto Mode'）",
  "Command to execute (e.g., '/myflow:auto')": "要执行的命令（例如 '/myflow:auto'）",
  "Which workflow step this command is associated with (e.g., 'specify')": "此命令关联的工作流步骤（例如 'specify'）",
  "Tooltip shown on hover": "悬停时显示的提示",
  "Flexible workflow steps (replaces legacy step-* keys)": "灵活的工作流步骤（替代旧版 step-* 键）",
  "Step identifier (e.g., 'specify', 'plan', 'design')": "步骤标识（例如 'specify'、'plan'、'design'）",
  "Display label (defaults to capitalized name)": "显示标签（默认使用首字母大写的 name）",
  "Command to execute for this step, written WITHOUT a leading slash (e.g. 'speckit.specify' or 'to-spec', not '/to-spec'). A leading slash is added automatically at dispatch; if you include one it is stripped.": "此步骤要执行的命令，填写时不要带开头的斜杠（例如 'speckit.specify' 或 'to-spec'，不要写 '/to-spec'）。发送时会自动添加斜杠；如果填写了斜杠，也会自动移除。",
  "Primary output file (defaults to '{name}.md')": "主要输出文件（默认：'{name}.md'）",
  "Explicit list of sub-files shown as children in sidebar": "在侧边栏中作为子项显示的子文件列表",
  "Subdirectory to scan for child .md files": "用于扫描子 .md 文件的子目录",
  "If true, step is action-only (no output file) and hidden from the document tree": "设为 true 时，该步骤仅执行操作（无输出文件），并从文档树中隐藏",
  "When true, unassigned related .md files in the spec folder are grouped under this step": "设为 true 时，规格目录中未归属的相关 .md 文件会归组到此步骤下",
  "Claude Code model for this step, e.g. 'opus', 'sonnet', or a full model id. Passed as `claude --model <model>`. Applies only when the active AI provider is Claude Code; ignored by other providers.": "此步骤使用的 Claude Code 模型，例如 'opus'、'sonnet' 或完整模型 ID。将以 `claude --model <model>` 传递。仅在当前 AI 提供商为 Claude Code 时生效，其他提供商会忽略。",
  "Claude Code reasoning effort for this step. Passed as `claude --effort <level>`. Applies only when the active AI provider is Claude Code; ignored by other providers.": "此步骤的 Claude Code 推理强度。将以 `claude --effort <level>` 传递。仅在当前 AI 提供商为 Claude Code 时生效，其他提供商会忽略。",
  "AI provider ids this workflow supports. Omit or leave empty to support all providers. When set, the workflow is hidden unless the active speckit.aiProvider is in this list (e.g. [\"claude\"] for a Claude-only workflow).": "此工作流支持的 AI 提供商 ID。省略或留空表示支持所有提供商。设置后，仅当当前 speckit.aiProvider 位于列表中时才显示该工作流（例如 [\"claude\"] 表示仅支持 Claude）。",
  "Reference-doc folders/files this workflow reads but that are NOT specs (e.g. GSD's '.planning/codebase'). They appear under the Steering view and are excluded from spec detection, so they never show up as an un-created spec with a phantom phase-stepper.": "此工作流会读取但不属于规格的参考文档目录/文件（例如 GSD 的 '.planning/codebase'）。它们会显示在“规则与引导”视图中，并排除在规格检测之外，因此不会以未创建规格或虚假阶段进度的形式出现。",
  "Display label under the Steering view (defaults to the path's folder/file name).": "“规则与引导”视图下显示的标签（默认使用路径中的文件夹/文件名）。",
  "Workspace-relative folder or file, e.g. '.planning/codebase'.": "相对于工作区的文件夹或文件，例如 '.planning/codebase'。",
  "SpecKit — the stock spec-driven pipeline (specify → plan → tasks → implement).": "SpecKit — 标准规格驱动流程（specify → plan → tasks → implement）。",
  "SpecKit Companion — the leaner pipeline with built-in right-sizing, through to a terminal mark-complete step. Requires the companion spec-kit extension.": "SpecKit Companion — 更精简的流程，内置规模判断，并最终执行终端标记完成步骤。需要 companion spec-kit 扩展。",
  "Workflow pre-selected in Create Spec for new features: **SpecKit** (stock) or **SpecKit Companion** (leaner, right-sizing). Companion needs the [companion spec-kit extension](https://github.com/alfredoperez/speckit-companion#install-the-spec-kit-extension); without it, a Companion spec runs the stock commands.": "新建功能时，“创建规格”中预选的工作流：**SpecKit**（标准）或 **SpecKit Companion**（更精简、自动判断规模）。Companion 需要安装 [companion spec-kit 扩展](https://github.com/alfredoperez/speckit-companion#install-the-spec-kit-extension)；未安装时，Companion 规格会运行标准命令。",
  "Offer a one-click banner to install the companion spec-kit extension when it's missing. The banner shows whenever the extension is missing and you haven't turned this off or dismissed it.": "缺少 companion spec-kit 扩展时显示一键安装横幅。只要扩展尚未安装，且你没有关闭此设置或忽略提示，就会显示该横幅。",
  "Show a per-spec Activity timeline in the viewer (steps, decisions, files touched). Requires the [companion spec-kit extension](https://github.com/alfredoperez/speckit-companion#install-the-spec-kit-extension).": "在查看器中显示每个规格的 Activity 时间线（步骤、决策、修改过的文件）。需要安装 [companion spec-kit 扩展](https://github.com/alfredoperez/speckit-companion#install-the-spec-kit-extension)。",
  "The single on/off switch for SpecKit Companion's anonymous, PII-free usage telemetry, which helps prioritize providers and features. [What's collected](https://github.com/alfredoperez/speckit-companion#telemetry). Turning this off stops all telemetry; leaving it on still respects VS Code's global `telemetry.telemetryLevel` (if you've disabled telemetry globally, nothing is sent regardless of this switch).": "SpecKit Companion 匿名、无个人身份信息（PII）使用遥测的总开关，用于帮助确定提供商和功能优先级。[查看收集内容](https://github.com/alfredoperez/speckit-companion#telemetry)。关闭后会停止全部遥测；保持开启时仍会遵循 VS Code 全局 `telemetry.telemetryLevel`（如果你已全局禁用遥测，则无论此开关如何都不会发送数据）。",

  "Get started with SpecKit Companion": "开始使用 SpecKit Companion",
  "Read a real spec in about a minute, then take an idea of your own from spec to plan to tasks without leaving the editor.": "用大约一分钟阅读一个真实规格，然后无需离开编辑器，就能把自己的想法从规格推进到计划和任务。",
  "Open a project": "打开项目", "See what a spec looks like": "了解规格的样子", "Install the Spec Kit CLI": "安装 Spec Kit CLI", "Set up this project": "配置当前项目", "Write your first spec": "编写第一个规格", "Read the Overview it leaves behind": "阅读生成的概览",
  "SpecKit Companion reads specs out of a folder in your repo, so it needs a project open before it can show you anything.\n[Open Folder](command:vscode.openFolder)": "SpecKit Companion 会从仓库目录中读取规格，因此需要先打开项目才能显示内容。\n[打开文件夹](command:vscode.openFolder)",
  "The quickest way to understand this extension is to read a finished spec. This copies a small sample into your specs folder and opens it in the viewer. No CLI, no AI, no setup, and clicking again reopens it rather than making a second copy.\n[Open a live sample](command:speckit.openSampleSpec)": "理解此扩展最快的方法是阅读一个已完成的规格。此操作会把一个小型示例复制到规格目录并在查看器中打开。无需 CLI、无需 AI、无需额外配置；再次点击只会重新打开示例，不会重复复制。\n[打开实时示例](command:speckit.openSampleSpec)",
  "Illustration under construction: a screenshot of the spec viewer belongs here": "插图制作中：此处将放置规格查看器截图",
  "Optional, and only for running phases. The viewer, review comments, and the sidebar work with no CLI at all. Install it when you want the specify, plan, tasks, and implement commands the extension dispatches to your AI.\n[Install Spec Kit CLI](command:speckit.installCli)": "可选，仅用于运行各阶段。查看器、审阅评论和侧边栏完全不依赖 CLI。需要让扩展把 specify、plan、tasks、implement 命令发送给 AI 时再安装即可。\n[安装 Spec Kit CLI](command:speckit.installCli)",
  "This writes the templates and phase commands your AI resolves into the repo, under a .specify folder. Reload the window once it finishes and the Specs view comes to life.\n[Initialize SpecKit](command:speckit.initWorkspace)": "此操作会把 AI 所需的模板和阶段命令写入仓库的 .specify 目录。完成后重新加载窗口，“规格”视图即可启用。\n[初始化 SpecKit](command:speckit.initWorkspace)",
  "Describe the feature in a sentence and pick the AI you already use. The extension hands it the prompt and follows along as the spec, the plan, and the tasks land on disk.\n[New Spec](command:speckit.create)": "用一句话描述功能，并选择你正在使用的 AI。扩展会把提示词交给它，并持续跟踪规格、计划和任务写入磁盘的过程。\n[新建规格](command:speckit.create)",
  "A spec with recorded activity opens on its Overview: why it exists, how long each phase took, the decisions made and what they rejected, and which test covers which requirement. It is what a reviewer reads instead of asking you again.\n[How the Overview works](https://github.com/alfredoperez/speckit-companion#overview-the-runs-story)": "记录了活动的规格会默认打开“概览”：包括它为何存在、各阶段耗时、做出的决策及被否决的方案，以及哪些测试覆盖哪些需求。审阅者可以直接阅读这些信息，而无需再次询问你。\n[了解概览的工作方式](https://github.com/alfredoperez/speckit-companion#overview-the-runs-story)",
  "Illustration under construction: a screenshot of the Overview belongs here": "插图制作中：此处将放置“概览”截图"
}));

const translatedKeys = new Set(['description', 'markdownDescription', 'title', 'label', 'name', 'contents', 'placeHolder', 'enumDescriptions', 'altText']);

function translateValue(value) {
  if (typeof value === 'string') return translations.get(value) ?? value;
  if (Array.isArray(value)) return value.map(translateValue);
  return value;
}

function walk(node) {
  if (Array.isArray(node)) { node.forEach(walk); return; }
  if (!node || typeof node !== 'object') return;
  for (const [key, value] of Object.entries(node)) {
    if (translatedKeys.has(key)) node[key] = translateValue(value);
    if (node[key] && typeof node[key] === 'object') walk(node[key]);
  }
}

walk(pkg);
fs.writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`);
