#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';
import { execSync } from 'child_process';

(async () => {
  const exampleDir = fileURLToPath(new URL('../example', import.meta.url));
  await fse.copy(exampleDir, path.resolve());
  execSync('npm install --save joi express swagger-ui-express mysql2 && npm install --save-dev nodemon', { stdio: 'inherit' });
})();
