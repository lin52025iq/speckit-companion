# 实施计划：[功能名称]

**分支**：`[###-feature-name]` | **日期**：[DATE] | **规格**：[link]
**输入**：来自 `/specs/[###-feature-name]/spec.md` 的功能规格

**说明**：此模板由 `/speckit.plan` 命令填写。最终生成内容默认使用简体中文；代码、命令、文件路径、API、配置键和标识符保持原文。

## 摘要

[从功能规格中提取主要需求，并结合研究结果概述技术方案]

## 技术上下文

<!-- 使用项目真实技术信息替换本节占位内容，不保留英文模板提示。 -->

**语言/版本**：[例如 Python 3.11、Swift 5.9、Rust 1.75，或“需要澄清”]  
**主要依赖**：[例如 FastAPI、UIKit、LLVM，或“需要澄清”]  
**存储**：[如适用，例如 PostgreSQL、CoreData、文件，或“不适用”]  
**测试**：[例如 pytest、XCTest、cargo test，或“需要澄清”]  
**目标平台**：[例如 Linux 服务器、iOS 15+、WASM，或“需要澄清”]  
**项目类型**：[单体/Web/移动端，用于确定源码结构]  
**性能目标**：[领域指标，例如 1000 req/s、10k 行/秒、60 fps，或“需要澄清”]  
**约束**：[领域约束，例如 p95 < 200ms、内存 < 100MB、支持离线，或“需要澄清”]  
**规模/范围**：[例如 1 万用户、100 万行代码、50 个页面，或“需要澄清”]

## Constitution 检查

*门禁：Phase 0 研究开始前必须通过；Phase 1 设计完成后重新检查。*

[根据 constitution 文件列出并验证门禁条件]

## 项目结构

### 本功能文档

```text
specs/[###-feature]/
├── plan.md              # 本文件（/speckit.plan 输出）
├── research.md          # Phase 0 输出
├── data-model.md        # Phase 1 输出
├── quickstart.md        # Phase 1 输出
├── contracts/           # Phase 1 输出
└── tasks.md             # Phase 2 输出（由 /speckit.tasks 创建）
```

### 源码结构（仓库根目录）

<!-- 用本功能实际目录结构替换下面的示例。删除未使用方案，不要在最终计划中保留“方案 1/2/3”字样。 -->

```text
# [未使用则删除] 单项目（默认）
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [未使用则删除] Web 应用
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [未使用则删除] 移动端 + API
api/
└── [同上方 backend]

ios/ 或 android/
└── [平台特定结构：功能模块、UI 流程、平台测试]
```

**结构决策**：[说明选定的结构，并引用上方真实目录]

## 复杂度跟踪

> **仅当 Constitution 检查存在必须解释的违规时填写**

| 违规项 | 为什么需要 | 为什么拒绝更简单的方案 |
|---|---|---|
| [例如：第 4 个子项目] | [当前需求] | [为什么 3 个项目不足] |
| [例如：Repository 模式] | [具体问题] | [为什么直接访问数据库不足] |
