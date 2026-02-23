# Service guide

A **Service** owns one slice of the API surface. It declares which routes exist, what schema validates each request, which roles are allowed, and which method handles the request. The framework wires the middleware stack automatically.

---

## Minimal skeleton

```ts
import type { Request, Response } from 'express';
import Service from 'pixelrest/service';
import { HTTP_METHODS } from 'pixelrest/httpMethods';
import HttpResolver from 'pixelrest/httpResolver';
import type { RouteConfig } from 'pixelrest/types';

export default class ArticlesService extends Service {

  routesConfig: RouteConfig[] = [
    {
      route: '/articles',
      execute: 'getAll',
      method: HTTP_METHODS.GET,
      schema: null,
      roles: ['public']
    }
  ];

  constructor(tokenSecret: string) {
    super(tokenSecret);
    this.initRoutes();   // must be the last statement in every constructor
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const articles = await this.repositories.articles.getAll();
      res.send(articles);
    } catch (error) {
      HttpResolver.handle(error as { type: string; message: string }, 'ArticlesService#getAll', res);
    }
  }
}
```

---

## `RouteConfig` field reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `route` | `string` | Yes | Express route pattern, e.g. `'/users/:id'` |
| `execute` | `string` | Yes | Name of the method on this class to call when the route matches |
| `method` | `string` | Yes | HTTP method — use the `HTTP_METHODS` enum |
| `schema` | `RouteSchema \| null` | Yes | Zod schema object for validation, or `null` to skip validation |
| `roles` | `string[]` | Yes | Roles that may access this route. Use `['public']` for unauthenticated access |
| `multerConfig` | `MulterConfig` | No | File upload configuration. When set, Multer middleware is inserted before validation |
| `rateLimit` | `RateLimitConfig` | No | Rate limiting configuration. When set, `express-rate-limit` middleware is the first in the stack |

---

## `HTTP_METHODS` enum

```ts
import { HTTP_METHODS } from 'pixelrest/httpMethods';

HTTP_METHODS.GET     // 'get'
HTTP_METHODS.POST    // 'post'
HTTP_METHODS.PUT     // 'put'
HTTP_METHODS.PATCH   // 'patch'
HTTP_METHODS.DELETE  // 'delete'
```

---

## Role-based access

Roles are arbitrary strings. The framework has one built-in value: `'public'`.

| Scenario | `roles` value | Behaviour |
|----------|--------------|-----------|
| No auth required | `['public']` | JWT verification is skipped entirely |
| Single role | `['admin']` | Token must contain `'admin'` in its `roles` array |
| Multiple allowed roles | `['admin', 'editor']` | Token must contain at least one of the listed roles |

When auth is required, `req.tokenData` is populated before the service method runs:

```ts
async getCurrent(req: Request, res: Response): Promise<void> {
  const userId = req.tokenData!.id;       // number — the user's database id
  const userRoles = req.tokenData!.roles; // string[] — e.g. ['admin']
  // ...
}
```

> The `!` non-null assertion is safe here because `authorizationMiddleware` guarantees that `req.tokenData` is set before a protected route handler is called.

To get TypeScript to recognise `req.tokenData`, import the Express type augmentation once at the top of your entry file (or in the service file):

```ts
import 'pixelrest/express';
```

---

## Accessing repositories

Every repository registered in the `REPOSITORIES` map is available via `this.repositories`:

```ts
const user = await this.repositories.users.getById(req.params.id);
```

The `repositories` object is typed as `Record<string, unknown>`. Cast the repository to its concrete type when you need autocomplete, or keep the pattern simple as shown in the example app.

---

## Rate limiting

```ts
{
  route: '/users',
  execute: 'add',
  method: HTTP_METHODS.POST,
  schema: addSchema,
  roles: ['public'],
  rateLimit: {
    windowMs: 60 * 60 * 1000,  // 1 hour in milliseconds
    max: 100,                   // max requests per window per IP
    message: 'Too many accounts created, please try again in an hour.'
  }
}
```

`message` is optional; the default is `'Too many requests, please try again later.'`.

---

## File upload

```ts
{
  route: '/documents',
  execute: 'upload',
  method: HTTP_METHODS.POST,
  schema: uploadSchema,
  roles: ['admin'],
  multerConfig: {
    uploadDirectory: './uploads',
    documentFieldName: 'file',
    multerMethodName: 'single',
    limits: { fieldSize: 1_000_000, fileSize: 10_000_000 },
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
  }
}
```

When `multerConfig` is set, the middleware stack becomes:
1. Multer (handles multipart upload + MIME validation)
2. `parseMulterBody` (parses JSON-encoded form fields)
3. `validate`, auth, execute — the usual stack

---

## Full annotated example

See `example/app/services/users/users.service.ts` in the repository for a production-grade service covering GET, POST, and PUT routes with schemas, roles, rate limiting, token data access, and `HttpResolver` error handling.
