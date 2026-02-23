import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsRoot = resolve(__dirname, '..', 'docs');

function loadDoc(relPath: string): string {
  try {
    return readFileSync(resolve(docsRoot, relPath), 'utf-8');
  } catch {
    return `[Doc not found: ${relPath}]`;
  }
}

const server = new McpServer({
  name: 'pixelrest',
  version: '2.0.0',
});

// ─── Resources ───────────────────────────────────────────────────────────────

const docPages = [
  { uri: 'pixelrest://docs/index',                 name: 'Introduction',         path: 'index.md' },
  { uri: 'pixelrest://docs/architecture',          name: 'Architecture',         path: 'architecture.md' },
  { uri: 'pixelrest://docs/guides/service',        name: 'Service guide',        path: 'guides/service.md' },
  { uri: 'pixelrest://docs/guides/schema',         name: 'Schema guide',         path: 'guides/schema.md' },
  { uri: 'pixelrest://docs/guides/repository',     name: 'Repository guide',     path: 'guides/repository.md' },
  { uri: 'pixelrest://docs/guides/error-handling', name: 'Error-handling guide', path: 'guides/error-handling.md' },
] as const;

for (const doc of docPages) {
  server.resource(
    doc.name,
    doc.uri,
    async () => ({
      contents: [{ uri: doc.uri, text: loadDoc(doc.path), mimeType: 'text/markdown' }],
    })
  );
}

// ─── Tool: scaffold_service ───────────────────────────────────────────────────

server.tool(
  'scaffold_service',
  'Generate a pixelrest Service subclass skeleton with routesConfig and initRoutes()',
  {
    name: z.string().describe('Class name, e.g. "UsersService"'),
    routes: z.array(z.object({
      route:   z.string().describe('Express path, e.g. "/users/:id"'),
      method:  z.string().describe('HTTP method: get | post | put | patch | delete'),
      execute: z.string().describe('Method name to call, e.g. "getUser"'),
      roles:   z.array(z.string()).describe('Authorized roles; use ["public"] to skip auth'),
    })).optional().describe('Route definitions — defaults to a sample GET / route'),
  },
  async ({ name, routes }) => {
    const effectiveRoutes = routes ?? [
      { route: '/', method: 'get', execute: 'getAll', roles: ['public'] },
    ];

    const routesConfig = effectiveRoutes
      .map((r) =>
        `    {\n` +
        `      route:   '${r.route}',\n` +
        `      method:  '${r.method}',\n` +
        `      execute: '${r.execute}',\n` +
        `      schema:  null,\n` +
        `      roles:   ${JSON.stringify(r.roles)},\n` +
        `    }`
      )
      .join(',\n');

    const methodStubs = effectiveRoutes
      .map((r) =>
        `\n  private ${r.execute}(_req: Request, res: Response): void {\n` +
        `    // TODO: implement\n` +
        `    res.json({ message: '${r.execute} not implemented' });\n` +
        `  }`
      )
      .join('\n');

    const code =
      `import type { Request, Response } from 'express';\n` +
      `import Service from 'pixelrest/service';\n` +
      `import type { RouteConfig } from 'pixelrest/types';\n` +
      `\n` +
      `export default class ${name} extends Service {\n` +
      `  protected routesConfig: RouteConfig[] = [\n` +
      `${routesConfig}\n` +
      `  ];\n` +
      `\n` +
      `  constructor(tokenSecret: string) {\n` +
      `    super(tokenSecret);\n` +
      `    this.initRoutes();\n` +
      `  }\n` +
      `${methodStubs}\n` +
      `}\n`;

    return { content: [{ type: 'text' as const, text: code }] };
  }
);

// ─── Tool: validate_route_config ─────────────────────────────────────────────

server.tool(
  'validate_route_config',
  'Validate a pixelrest RouteConfig object against framework rules',
  {
    routeConfig: z.object({
      route:       z.string(),
      execute:     z.string(),
      method:      z.string(),
      schema:      z.any().nullable(),
      roles:       z.array(z.string()),
      multerConfig: z.any().optional(),
      rateLimit:   z.any().optional(),
    }).describe('The RouteConfig object to validate'),
  },
  async ({ routeConfig }) => {
    const errors: string[] = [];
    const VALID_METHODS = ['get', 'post', 'put', 'patch', 'delete'];

    if (!routeConfig.route.startsWith('/')) {
      errors.push(`route must start with "/", got: "${routeConfig.route}"`);
    }

    if (!VALID_METHODS.includes(routeConfig.method.toLowerCase())) {
      errors.push(`method must be one of [${VALID_METHODS.join(', ')}], got: "${routeConfig.method}"`);
    }

    if (!routeConfig.execute || typeof routeConfig.execute !== 'string') {
      errors.push('execute must be a non-empty string referencing a method on the Service class');
    }

    if (!Array.isArray(routeConfig.roles) || routeConfig.roles.length === 0) {
      errors.push('roles must be a non-empty array; use ["public"] to skip auth');
    }

    if (routeConfig.rateLimit != null) {
      const rl = routeConfig.rateLimit as Record<string, unknown>;
      if (typeof rl.windowMs !== 'number' || rl.windowMs <= 0) {
        errors.push('rateLimit.windowMs must be a positive number (milliseconds)');
      }
      if (typeof rl.max !== 'number' || rl.max <= 0) {
        errors.push('rateLimit.max must be a positive number');
      }
    }

    if (routeConfig.multerConfig != null) {
      const mc = routeConfig.multerConfig as Record<string, unknown>;
      for (const field of ['uploadDirectory', 'documentFieldName', 'multerMethodName', 'limits', 'allowedMimeTypes']) {
        if (mc[field] === undefined) {
          errors.push(`multerConfig.${field} is required`);
        }
      }
    }

    const valid = errors.length === 0;
    const text = valid
      ? '✓ RouteConfig is valid.'
      : `✗ RouteConfig has ${errors.length} error(s):\n` +
        errors.map((e, i) => `  ${i + 1}. ${e}`).join('\n');

    return { content: [{ type: 'text' as const, text }] };
  }
);

// ─── Tool: scaffold_repository ────────────────────────────────────────────────

server.tool(
  'scaffold_repository',
  'Generate a pixelrest Repository subclass skeleton with typed query methods',
  {
    name: z.string().describe('Class name, e.g. "UsersRepository"'),
    dialect: z.enum(['mysql', 'postgres']).optional()
      .describe('SQL dialect — affects parser import and placeholder comments (default: mysql)'),
    methods: z.array(z.object({
      name: z.string().describe('Method name, e.g. "findById"'),
      type: z.enum(['any', 'one', 'insert'])
        .describe('"any" → rows[], "one" → single row, "insert" → last insert id'),
      sql:  z.string().describe('SQL with ~param placeholders, e.g. "SELECT * FROM users WHERE id = ~id"'),
    })).optional().describe('Query methods to scaffold — defaults to a sample find/create pair'),
  },
  async ({ name, dialect = 'mysql', methods }) => {
    const effectiveMethods = methods ?? [
      { name: 'findAll',  type: 'any' as const,    sql: 'SELECT * FROM table_name' },
      { name: 'findById', type: 'one' as const,    sql: 'SELECT * FROM table_name WHERE id = ~id' },
      { name: 'create',   type: 'insert' as const, sql: 'INSERT INTO table_name (column) VALUES (~column)' },
    ];

    const dialectNote = dialect === 'postgres'
      ? '// PostgreSQL: ~param → $param (compiled by PostgresParser)'
      : '// MySQL: ~param → ? (compiled by MysqlParser)';

    const methodCode = effectiveMethods.map((m) => {
      if (m.type === 'insert') {
        return (
          `\n  async ${m.name}(params: Record<string, unknown>): Promise<number | null> {\n` +
          `    ${dialectNote}\n` +
          `    return this.insertAndGetLastInsertId(\n` +
          `      \`${m.sql}\`,\n` +
          `      params\n` +
          `    );\n` +
          `  }`
        );
      }
      if (m.type === 'one') {
        return (
          `\n  async ${m.name}(params: Record<string, unknown>): Promise<unknown> {\n` +
          `    ${dialectNote}\n` +
          `    return this.one(\n` +
          `      \`${m.sql}\`,\n` +
          `      params\n` +
          `    );\n` +
          `  }`
        );
      }
      return (
        `\n  async ${m.name}(params: Record<string, unknown>): Promise<unknown[]> {\n` +
        `    ${dialectNote}\n` +
        `    return this.any(\n` +
        `      \`${m.sql}\`,\n` +
        `      params\n` +
        `    ) as Promise<unknown[]>;\n` +
        `  }`
      );
    }).join('\n');

    const parserImport = dialect === 'postgres'
      ? `import PostgresParser from 'pixelrest/postgresParser';`
      : `import MysqlParser from 'pixelrest/mysqlParser';`;

    const parserArg = dialect === 'postgres'
      ? `new PostgresParser()`
      : `new MysqlParser()`;

    const code =
      `import Repository from 'pixelrest/repository';\n` +
      `import type { DbConnection } from 'pixelrest/dbConnection';\n` +
      `${parserImport}\n` +
      `\n` +
      `export default class ${name} extends Repository {\n` +
      `  constructor(db: DbConnection) {\n` +
      `    super(db, ${parserArg});\n` +
      `  }\n` +
      `${methodCode}\n` +
      `}\n`;

    return { content: [{ type: 'text' as const, text: code }] };
  }
);

// ─── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
