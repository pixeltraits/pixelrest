#!/usr/bin/env node
import path from 'path';
import fse from 'fs-extra';
import { exec } from 'child_process';

(async () => {
  await fse.copy(new URL(`../example`, import.meta.url).pathname.substring(1), path.resolve());
  exec('npm install --save nodemon & npm install --save joi & npm install --save express & npm install --save swagger-ui-express & npm install --save mysql2');
})();
