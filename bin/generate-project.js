#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';
import { execSync } from 'child_process';

(async () => {
  const exampleDir = fileURLToPath(new URL('../example', import.meta.url));
  const destDir = path.resolve();

  await fse.copy(exampleDir, destDir);

  // Copy .env.example to .env so the project has working defaults
  await fse.copy(path.join(destDir, '.env.example'), path.join(destDir, '.env'));

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
  await fse.writeJson(path.join(destDir, 'tsconfig.json'), tsconfig, { spaces: 2 });

  execSync('npm install --save pixelrest joi express swagger-ui-express mysql2 && npm install --save-dev @types/swagger-ui-express nodemon tsx typescript', { stdio: 'inherit' });
})();
