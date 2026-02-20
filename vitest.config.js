import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = (p) => path.resolve(__dirname, 'src', p);

export default defineConfig({
  resolve: {
    alias: {
      'pixelrest/service': src('nodeExpress/Service/Service'),
      'pixelrest/middleware': src('nodeExpress/Middleware/Middleware'),
      'pixelrest/server': src('nodeExpress/Server/Server'),
      'pixelrest/controller': src('nodeExpress/Controller/Controller'),
      'pixelrest/logger': src('loggers/Logger/Logger'),
      'pixelrest/httpResolver': src('loggers/HttpResolver/HttpResolver'),
      'pixelrest/clone': src('general/Clone/Clone'),
      'pixelrest/collection': src('general/Collection/Collection'),
      'pixelrest/snakeToCamelParser': src('general/SnakeToCamelParser/SnakeToCamelParser'),
      'pixelrest/repository': src('database/Repository/Repository'),
      'pixelrest/bddParser': src('database/BddParser/BddParser'),
      'pixelrest/mysqlParser': src('database/MysqlParser/MysqlParser'),
      'pixelrest/postgresParser': src('database/PostgresParser/PostgresParser'),
      'pixelrest/auth': src('authentication/Auth/Auth'),
      'pixelrest/password': src('authentication/Password/Password'),
      'pixelrest/types': src('types'),
      'pixelrest/httpMethods': src('nodeExpress/http-methods.config'),
      'pixelrest/dbConnection': src('database/Repository/repository.config'),
      'pixelrest/express': src('nodeExpress/express')
    }
  },
  test: {
    include: ['src/**/*.spec.{js,ts}'],
    globals: true
  }
});
