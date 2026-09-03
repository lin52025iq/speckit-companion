import fs from 'node:fs';

const packagePath = new URL('../package.json', import.meta.url);
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

pkg.scripts ??= {};
// `vsce package` 会自动执行 `vscode:prepublish`，该流程已经包含 TypeScript 编译
// 和生产环境 Webview 打包，因此这个入口可以完整完成“构建 + 生成 VSIX”。
pkg.scripts['build:vsix'] = 'npm run package';

fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
