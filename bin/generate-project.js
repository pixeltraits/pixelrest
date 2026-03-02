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

  // Rewrite Dockerfile for the standalone project (no example/ prefix)
  const dockerfile = `FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN mkdir -p temp documents
ENTRYPOINT ["./docker-entrypoint.sh"]
`;
  await fs.writeFile(path.join(destDir, 'Dockerfile'), dockerfile);

  // Rewrite docker-entrypoint.sh for the standalone project
  const entrypoint = `#!/bin/sh
set -e
echo "Initializing database tables..."
npx tsx app/scripts/prepareDatabase.ts
echo "Starting server..."
exec npx tsx main.ts
`;
  await fs.writeFile(path.join(destDir, 'docker-entrypoint.sh'), entrypoint);
  await fs.chmod(path.join(destDir, 'docker-entrypoint.sh'), 0o755);

  // Rewrite docker-compose.yml for the standalone project
  const dockerCompose = `services:
  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_PASSWORD:-pixelrest}
      MYSQL_DATABASE: \${MYSQL_DATABASE:-pixelrest}
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 10

  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: \${POSTGRES_USER:-pixelrest}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-pixelrest}
      POSTGRES_DB: \${POSTGRES_DB:-pixelrest}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER:-pixelrest}"]
      interval: 5s
      timeout: 5s
      retries: 10

  adminer:
    image: adminer:latest
    ports:
      - "8080:8080"

  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "\${SERVER_PORT:-1338}:\${SERVER_PORT:-1338}"
    env_file:
      - .env
    depends_on:
      mysql:
        condition: service_healthy
      postgres:
        condition: service_healthy

volumes:
  mysql_data:
  postgres_data:
`;
  await fs.writeFile(path.join(destDir, 'docker-compose.yml'), dockerCompose);

  // Create Makefile
  const makefile = `.PHONY: dev prepare-db docker docker-stop

dev:
\tnpm run start

prepare-db:
\tnpm run prepare-file

docker:
\tdocker compose up --build

docker-stop:
\tdocker compose down
`;
  await fs.writeFile(path.join(destDir, 'Makefile'), makefile);

  execSync(
    'npm install --save pixelrest zod express swagger-ui-express morgan multer mysql2 && ' +
    'npm install --save-dev @types/swagger-ui-express @types/morgan @types/express @types/multer tsx typescript vitest',
    { stdio: 'inherit' }
  );
})();
