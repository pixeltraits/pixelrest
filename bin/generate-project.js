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

  execSync('npm install --save pixelrest joi express swagger-ui-express mysql2 && npm install --save-dev @types/swagger-ui-express tsx typescript', { stdio: 'inherit' });
})();
