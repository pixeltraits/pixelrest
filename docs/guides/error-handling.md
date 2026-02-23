# Error-handling guide

pixelrest centralises HTTP error responses in the `HttpResolver` class. Every `catch` block in a service method must delegate to `HttpResolver` — never write `res.status(500)` directly.

---

## `HttpResolver` method reference

| Method | HTTP code | When to use |
|--------|-----------|-------------|
| `handle(error, where, res)` | Varies — see below | Default handler. Reads `error.type` and routes to the correct specific method automatically |
| `noContent(res)` | 204 | The operation succeeded but there is nothing to return |
| `badRequest(res)` | 400 | Malformed request that was not caught by Zod validation |
| `unauthorized(where, message, res)` | 401 | Authentication or authorisation failure (also used for wrong password) |
| `tokenExpired(where, message, res)` | 401 | JWT is valid but expired |
| `contentAlreadyExists(where, message, res)` | 409 | Unique constraint violation / duplicate resource |
| `serviceUnavailable(where, message, res)` | 503 | Unclassified server/database error |

---

## `ERROR_TYPES` constants

When a repository throws an error, it must carry a `type` field that matches one of these constants so that `HttpResolver.handle()` can classify it:

| Constant | Value | `handle()` routes to |
|----------|-------|----------------------|
| `ERROR_TYPES.NO_CONTENT` | `'NO_CONTENT'` | `noContent()` — 204 |
| `ERROR_TYPES.UNAUTHORIZED` | `'UNAUTHORIZED'` | `unauthorized()` — 401 |
| `ERROR_TYPES.TOKEN_EXPIRED` | `'TOKEN_EXPIRED'` | `tokenExpired()` — 401 |
| `ERROR_TYPES.ALREADY_EXIST` | `'ALREADY_EXIST'` | `contentAlreadyExists()` — 409 |
| _(anything else)_ | — | `serviceUnavailable()` — 503 |

If the error does not have a recognised `type`, `handle()` falls back to `serviceUnavailable()`.

---

## Standard error response format

Every `HttpResolver` method sends a JSON body with this shape:

```json
{
  "code": 401,
  "message": "Wrong login"
}
```

The `message` field comes from the framework's internal `HTTP_ERRORS` constants and is not configurable per call — it is a stable, predictable string that clients can rely on.

---

## Service method pattern

```ts
async myMethod(req: Request, res: Response): Promise<void> {
  try {
    // business logic — calls to this.repositories.*
    const result = await this.repositories.items.getAll();
    res.send(result);
  } catch (error) {
    // delegate classification and response to HttpResolver
    HttpResolver.handle(
      error as { type: string; message: string },
      'MyService#myMethod',   // identifies the location in logs
      res
    );
  }
}
```

The `where` string (second argument) appears in the log file alongside the HTTP code and the error message. Use the convention `'ClassName#methodName'` so log entries are easy to locate.

---

## Manual shortcuts for non-DB errors

Some error conditions don't originate from the database, so there is no thrown error to pass to `handle()`. Use the specific `HttpResolver` methods directly:

**Wrong password:**

```ts
if (!(await Password.validate(provided, stored))) {
  HttpResolver.unauthorized(
    'UsersService#updatePassword',
    'passwords not match',
    res
  );
  return;   // stop execution — do not fall through to res.send()
}
```

**Duplicate content (known before hitting the DB):**

```ts
if (await this.repositories.users.existsByEmail(email)) {
  HttpResolver.contentAlreadyExists(
    'UsersService#add',
    'email already registered',
    res
  );
  return;
}
```

**No content (empty result is expected):**

```ts
const item = await this.repositories.items.getById(id);
if (!item) {
  HttpResolver.noContent(res);
  return;
}
```

---

## What NOT to do

```ts
// wrong — raw Express response, bypasses logging and standard format
res.status(500).json({ error: 'Something went wrong' });

// wrong — silent catch, client receives no response
try {
  await this.repositories.items.getAll();
} catch (_error) {
  // nothing here
}

// wrong — throws without calling HttpResolver, Express 5 will catch it
// but the response format and logging will differ
async myMethod(req, res) {
  const data = await this.repositories.items.getAll(); // can throw
  res.send(data);
  // missing try/catch
}
```
