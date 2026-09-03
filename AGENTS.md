<!-- SPECKIT START -->

## 默认语言与 SpecKit 使用规范

- 与用户交流时默认使用简体中文，除非用户明确要求其他语言。
- 当任务涉及新功能、跨文件行为变化、需求澄清、技术方案设计或需要可追踪实施计划时，优先使用项目已安装的 SpecKit `/speckit.*` 工作流或对应 Skill；简单问答、代码解释和微小修改可直接处理。
- 使用 SpecKit 生成或更新 `spec.md`、`plan.md`、`tasks.md`、`research.md`、`data-model.md`、`quickstart.md`、`contracts/`、checklist、constitution、steering 文档以及其他说明性 Markdown 时，面向人的标题、正文、表格说明、验收场景、任务描述、进度说明和总结默认使用简体中文。
- 代码、命令、文件路径、API、配置键、标识符、协议字段、`FR-xxx`、`SC-xxx`、`Txxx`、JSON 字段和其他机器可读值保持原文，不为了中文化而改动协议结构。
- 上游英文模板和 Skill 保持其原始结构与执行语义；生成最终文档时将自然语言内容表达为中文，不要求翻译或维护 SpecKit 内部 Skill/模板副本。
- Git 提交信息和 PR 标题/正文优先使用中文；若仓库已有强制格式，则保留其类型前缀和机器可识别结构。

如需了解当前使用的技术、项目结构、Shell 命令和其他重要上下文，请读取当前计划：
`specs/108-clarify-provider-labels/plan.md`

<!-- SPECKIT END -->
