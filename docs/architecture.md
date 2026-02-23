# Architecture

## What pixelrest is

pixelrest is an opinionated Node.js / Express framework. It takes care of the cross-cutting concerns that every REST API needs — JWT-based authentication, Zod request validation, file upload via Multer, per-route rate limiting, and driver-agnostic parameterised SQL — so that application code can stay focused on business logic.

The framework is published as an npm package (`pixelrest`). Consumer applications install it, extend its base classes (`Service`, `Repository`), and wire everything together in their own `App` class. The `example/` directory in this repository is a fully working reference application.

---

## Module map

| Module (npm export path) | Class | Responsibility |
|--------------------------|-------|---------------|
| `pixelrest/service` | `Service` | Abstract base for route declaration, middleware orchestration, JWT auth |
| `pixelrest/middleware` | `Middleware` | Zod validation, Multer file upload, body parsing |
| `pixelrest/server` | `Server` | Express server helpers: error handling, startup logging, security headers (helmet + CORS) |
| `pixelrest/controller` | `Controller` | Tiny utility: `isNullOrNumber()` for DB result checks |
| `pixelrest/repository` | `Repository` | Abstract base for SQL queries (`any`, `one`, `insertAndGetLastInsertId`) |
| `pixelrest/bddParser` | `BddParser` | Abstract SQL parser — translates `~param` into driver-specific placeholders |
| `pixelrest/mysqlParser` | `MysqlParser` | Concrete parser for MySQL2 — maps `~param` → `?` positional parameters |
| `pixelrest/postgresParser` | `PostgresParser` | Concrete parser for pg-promise — maps `~param` → `$param` named parameters |
| `pixelrest/auth` | `Auth` | JWT sign / verify via `jose` (HS256), role checking |
| `pixelrest/password` | `Password` | bcrypt hash and validate |
| `pixelrest/httpResolver` | `HttpResolver` | Centralised HTTP response helpers (401, 204, 409, 503 …) |
| `pixelrest/logger` | `Logger` | File-based error and SQL logging |
| `pixelrest/httpMethods` | `HTTP_METHODS` enum | `get`, `post`, `put`, `patch`, `delete` |
| `pixelrest/types` | — | Public TypeScript type re-exports (`RouteConfig`, `RateLimitConfig`, `RouteSchema`, …) |

---

## Request lifecycle

When a request arrives at an endpoint, Express runs the middleware stack assembled by `Service.addRoute()` in this order:

1. **Rate limiting** (`express-rate-limit`) — only if `rateLimit` is set on the `RouteConfig`. Rejects the request with 429 if the client has exceeded the configured window/max.

2. **Multer file upload** — only if `multerConfig` is set. Parses `multipart/form-data`, validates the MIME type against `allowedMimeTypes`, and sanitises the filename.

3. **`Middleware.parseMulterBody`** — only when Multer ran. Iterates over string fields that look like JSON objects and parses them so that nested data sent as form fields is available as proper objects on `req.body`.

4. **`Middleware.validate`** — always present. Calls `safeParse()` on the Zod schemas attached to `RouteSchema.body`, `RouteSchema.params`, and/or `RouteSchema.query`. If any segment fails validation, responds immediately with 503 and a Zod error message. The request does not proceed further.

5. **`authorizationMiddleware`** — always present. Reads the `Authorization` header (accepts both bare token and `Bearer <token>`). If the route's `roles` array contains `'public'`, skips JWT verification entirely and calls `next()`. Otherwise, verifies the JWT with `Auth.verify()`, writes `req.tokenData` on success, and checks that the token's `roles` overlap with the route's `roles` using `Auth.checkMultiRoles()`. Responds with 401 on any failure.

6. **Service method execution** — calls the method named by `RouteConfig.execute` on the service instance. This is where your business logic lives.

---

## Application wiring pattern

A pixelrest application is assembled in a custom `App` class. The typical flow is:

```
main.ts
  └── new App(dbConnection, config, parser)
        ├── makeRepositories()   — instantiate each Repository with (dbConnection, parser)
        ├── makeRoutes()         — instantiate each Service, call setRepositories(), mount router
        └── makeHeaders() / makeLogger() / makeSwagger() / makeErrorHandler()
```

**Repositories** are defined in a `REPOSITORIES` map (plain object keyed by name):

```ts
// example/app/repositories/index.ts
export const REPOSITORIES = {
  users: UsersRepository,
  documents: DocumentsRepository
};
```

**Services** are listed in a `SERVICES` array:

```ts
// example/app/services/index.ts
export const SERVICES = [UsersService, ConnexionService, DocumentsService];
```

The `App` constructor iterates both structures: it instantiates every repository with the shared DB connection and parser, then instantiates every service with the JWT secret and calls `service.setRepositories(this.repositories)` so that each service can reach any repository via `this.repositories.repoName`.

---

## Key design decisions

**Zod for validation and type inference**
Zod schemas are the single source of truth for request shapes. The same schema object used for runtime validation is also used (via `z.infer<>`) to produce the TypeScript type consumed in the service method body, eliminating duplication.

**`~param` SQL placeholders**
SQL queries are written with `~param` syntax (e.g. `WHERE id = ~id`). The `BddParser` subclass for each driver translates these into the driver's native format (`?` for MySQL, `$param` for PostgreSQL). This means SQL queries in repository files are database-agnostic and never need to be rewritten when switching drivers. User data never touches the SQL string itself, which prevents SQL injection.

**`'public'` role convention**
Routes that should be accessible without a token (login, registration …) declare `roles: ['public']`. The `authorizationMiddleware` checks for this role first and skips JWT verification entirely, without any special-casing in the service method.
