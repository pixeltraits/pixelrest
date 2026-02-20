import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = (p) => path.resolve(__dirname, 'src', p);

export default defineConfig({
  resolve: {
    alias: {
      'pixelrest/service': src('nodeExpress/Service'),
      'pixelrest/middleware': src('nodeExpress/Middleware'),
      'pixelrest/server': src('nodeExpress/Server'),
      'pixelrest/controller': src('nodeExpress/Controller'),
      'pixelrest/logger': src('loggers/Logger'),
      'pixelrest/httpResolver': src('loggers/HttpResolver'),
      'pixelrest/clone': src('general/Clone'),
      'pixelrest/collection': src('general/Collection'),
      'pixelrest/snakeToCamelParser': src('general/SnakeToCamelParser'),
      'pixelrest/repository': src('database/Repository'),
      'pixelrest/bddParser': src('database/BddParser'),
      'pixelrest/mysqlParser': src('database/MysqlParser'),
      'pixelrest/postgresParser': src('database/PostgresParser'),
      'pixelrest/auth': src('authentication/Auth'),
      'pixelrest/password': src('authentication/Password')
    }
  },
  test: {
    include: ['spec/**/*.spec.{js,ts}'],
    globals: true
  }
});
