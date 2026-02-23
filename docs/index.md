---
layout: home
hero:
  name: pixelrest
  tagline: Opinionated Node.js / Express — auth, validation, file upload, and rate limiting out of the box.
  actions:
    - theme: brand
      text: Architecture
      link: /architecture
    - theme: alt
      text: npm
      link: https://www.npmjs.com/package/pixelrest
    - theme: alt
      text: GitHub
      link: https://github.com/pixeltraits/pixelrest
features:
  - title: JWT Authentication
    details: Built-in role-based auth middleware. Use 'public' to skip JWT entirely.
  - title: Zod Validation
    details: Schema-first request validation with automatic TypeScript type inference — zero duplication.
  - title: Driver-agnostic SQL
    details: ~param placeholders compile to ? (MySQL) or $param (PostgreSQL) automatically.
  - title: Rate limiting & file upload
    details: Per-route express-rate-limit and Multer config — declared alongside the route.
---

# pixelrest

**pixelrest** is an opinionated Node.js / Express framework that gives you built-in JWT authentication, Zod validation, file upload, rate limiting, and driver-agnostic SQL — so you can ship a secure REST API without re-inventing the same boilerplate every time.

Current version: **2.0.0** · License: MIT · [npm](https://www.npmjs.com/package/pixelrest) · [GitHub](https://github.com/pixeltraits/pixelrest)

---

## Getting started

```bash
npm install pixelrest
```

See the [README on GitHub](https://github.com/pixeltraits/pixelrest#readme) for database setup and your first endpoint.

---

## Documentation

| Document | What you will find |
|----------|--------------------|
| [Architecture](./architecture.md) | Module map, request lifecycle, key design decisions |
| [Service guide](./guides/service.md) | How to define routes, roles, rate limiting, and file upload |
| [Schema guide](./guides/schema.md) | Zod schema conventions, coercion, type inference |
| [Repository guide](./guides/repository.md) | SQL helpers, `~param` syntax, error handling |
| [Error-handling guide](./guides/error-handling.md) | `HttpResolver` API, `ERROR_TYPES`, response format |

---

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for local setup, code conventions, and the PR checklist.
