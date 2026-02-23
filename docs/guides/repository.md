# Repository guide

A **Repository** encapsulates all SQL for one database table. It extends pixelrest's `Repository` base class, which provides driver-agnostic query helpers and translates `~param` placeholders into the correct syntax for MySQL or PostgreSQL.

---

## Extending `Repository`

```ts
import Repository from 'pixelrest/repository';
import type BddParser from 'pixelrest/bddParser';
import type { DbConnection } from 'pixelrest/dbConnection';

export default class ArticlesRepository extends Repository {

  constructor(db: DbConnection, parser: BddParser) {
    super(db, parser);
  }

  // ... query methods
}
```

The `db` and `parser` arguments are injected by the `App` class — you never instantiate them yourself.

---

## Base methods

| Method | Returns | When to use |
|--------|---------|-------------|
| `any(sql, params)` | `Promise<unknown>` | SELECT that returns zero or more rows |
| `one(sql, params)` | `Promise<unknown>` | SELECT that returns a single row (or UPDATE / DELETE that returns a row) |
| `insertAndGetLastInsertId(sql, params)` | `Promise<number \| null>` | INSERT — returns the auto-generated primary key |

All three methods accept:
- `sql` — a SQL string containing `~param` placeholders
- `params` — a plain object whose keys match the placeholder names

---

## `~param` placeholder syntax

Write SQL using `~paramName` wherever you would normally put a value. The `BddParser` converts these at runtime:

| Placeholder | MySQL (`MysqlParser`) | PostgreSQL (`PostgresParser`) |
|-------------|-----------------------|-------------------------------|
| `~id` | `?` (positional) | `$id` (named) |
| `~email` | `?` | `$email` |

This means the same SQL string works with both drivers — no duplication, no switching.

```ts
// correct — parameterised, safe
await this.one(
  'SELECT * FROM users WHERE id = ~id',
  { id }
);

// wrong — string interpolation, SQL injection risk
await this.one(
  `SELECT * FROM users WHERE id = ${id}`,
  {}
);
```

> **Rule:** user-controlled values must **always** travel through the `params` object, never through the SQL string itself.

---

## Error handling pattern

Every repository method must follow this pattern:

```ts
async getById(id: number): Promise<unknown> {
  try {
    return await this.one(
      'SELECT id, firstname, email FROM users WHERE id = ~id',
      { id }
    );
  } catch (error) {
    Logger.handleSQLError(error);
    throw error;                // re-throw so HttpResolver.handle() can classify it
  }
}
```

1. `Logger.handleSQLError(error)` logs the raw SQL error to file.
2. `throw error` propagates the error to the service layer where `HttpResolver.handle()` converts it to the appropriate HTTP response.

---

## Registering a repository

Add the repository class to the `REPOSITORIES` map in `example/app/repositories/index.ts` (or the equivalent file in your application):

```ts
// repositories/index.ts
import UsersRepository from './users.repository.js';
import ArticlesRepository from './articles.repository.js';

export const REPOSITORIES = {
  users:    UsersRepository,
  articles: ArticlesRepository
};
```

The `App` class iterates this map, instantiates each repository with the shared DB connection and parser, and stores the instances under the same key. Services then access them via `this.repositories.articles.getAll()`.

---

## Full annotated example

```ts
// repositories/articles.repository.ts
import Repository from 'pixelrest/repository';
import type BddParser from 'pixelrest/bddParser';
import type { DbConnection } from 'pixelrest/dbConnection';
import Logger from 'pixelrest/logger';

export type Article = {
  id?: number;
  title?: string;
  content?: string;
  authorId?: number;
};

export default class ArticlesRepository extends Repository {

  constructor(db: DbConnection, parser: BddParser) {
    super(db, parser);
  }

  // Returns all articles as an array
  async getAll(): Promise<unknown> {
    try {
      return await this.any(
        `SELECT id, title, author_id FROM articles ORDER BY id DESC`,
        {}
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  // Returns a single article by primary key
  async getById(id: number): Promise<unknown> {
    try {
      return await this.one(
        `SELECT id, title, content, author_id FROM articles WHERE id = ~id`,
        { id }
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  // Inserts a new article and returns the new id
  async add(article: Article): Promise<number | null> {
    try {
      return await this.insertAndGetLastInsertId(
        `INSERT INTO articles (title, content, author_id)
         VALUES (~title, ~content, ~authorId)`,
        article
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }

  // Updates title and content for an existing article
  async update(article: Article): Promise<void> {
    try {
      await this.one(
        `UPDATE articles SET title = ~title, content = ~content WHERE id = ~id`,
        article
      );
    } catch (error) {
      Logger.handleSQLError(error);
      throw error;
    }
  }
}
```

For a production example covering MySQL/PostgreSQL compatibility (using `isPostgres` to switch DDL), see `example/app/repositories/users.repository.ts`.
