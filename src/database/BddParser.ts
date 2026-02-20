import { MYSQL_PARSER_IDENTIFIER } from './mysql-parser.config.js';
import type { SqlParseResult } from './bdd-parser.config.js';

export default abstract class BddParser {
  // Les sous-classes doivent override cette méthode.
  // Le throw sert de filet de sécurité à l'exécution tant que les specs sont en .js.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parse(_sqlRequest: string, _sqlParameters: Record<string, unknown>): SqlParseResult {
    throw new Error(MYSQL_PARSER_IDENTIFIER.PARSER_ERROR);
  }
}
