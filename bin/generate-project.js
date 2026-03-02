#!/usr/bin/env node
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

(async () => {
  const exampleDir = fileURLToPath(new URL('../example', import.meta.url));
  const destDir = path.resolve();

  await fs.cp(exampleDir, destDir, { recursive: true });

  // Copy .env.example to .env so the project has working defaults
  await fs.cp(path.join(destDir, '.env.example'), path.join(destDir, '.env'));

  // Replace the dev tsconfig (with paths pointing to src/) by a production one
  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'Node16',
      moduleResolution: 'Node16',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      noEmit: true
    },
    include: ['./**/*.ts'],
    exclude: ['node_modules']
  };
  await fs.writeFile(path.join(destDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2) + '\n');

  // Merge scripts into the existing package.json
  const pkgPath = path.join(destDir, 'package.json');
  let pkg = {};
  try {
    pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
  } catch {
    // No package.json yet — will be created by npm install
  }
  pkg.scripts = {
    ...(pkg.scripts ?? {}),
    start: 'tsx watch main.ts',
    test: 'vitest run',
    'test:watch': 'vitest',
    'prepare-file': 'tsx app/scripts/prepareDatabase.ts'
  };
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  execSync(
    'npm install --save pixelrest zod express swagger-ui-express morgan multer mysql2 && ' +
    'npm install --save-dev @types/swagger-ui-express @types/morgan @types/express @types/multer tsx typescript vitest',
    { stdio: 'inherit' }
  );
})();
