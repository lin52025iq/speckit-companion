import fs from 'node:fs';

const packagePath = new URL('../package.json', import.meta.url);
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

pkg.scripts ??= {};
pkg.scripts['build:vsix'] = 'npm run package';

fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
