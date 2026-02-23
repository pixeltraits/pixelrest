# Schema guide

pixelrest uses [Zod](https://zod.dev) for request validation. A schema file declares the shape of each validated request segment and exports TypeScript types derived from those schemas — with zero duplication.

---

## File convention

Create one schema file per feature, placed next to its service file:

```
app/services/users/
├── users.service.ts
└── users.schema.ts    ← schema file
```

---

## Three schema locations

A `RouteSchema` can validate up to three parts of an incoming request:

| Key | Validates | Typical use |
|-----|-----------|-------------|
| `body` | `req.body` | POST / PUT payload |
| `params` | `req.params` | URL path segments like `/users/:id` |
| `query` | `req.query` | Query string like `?page=2&limit=10` |

Pass only the segments you need:

```ts
export const createArticleSchema = { body: createArticleBodySchema };
export const getByIdSchema        = { params: getByIdParamsSchema };
export const listSchema           = { query: listQuerySchema };
export const updateSchema         = { body: updateBodySchema, params: updateParamsSchema };
```

---

## Common Zod primitives

```ts
import { z } from 'zod';

z.string()               // any string
z.string().min(1)        // non-empty string
z.string().max(100)      // max 100 characters
z.string().email()       // valid e-mail format
z.number()               // JavaScript number
z.number().int()         // integer only
z.boolean()              // true / false
z.enum(['admin', 'user']) // one of the listed literals
z.array(z.string())      // array of strings
```

---

## `z.coerce.number()` for params and query

URL path parameters and query string values arrive as **strings** — Express never converts them automatically. Zod's plain `z.number()` will reject a string like `"42"`. Use `z.coerce.number()` to convert first, then validate:

```ts
// users.schema.ts
const getByIdParamsSchema = z.object({
  id: z.coerce.number().int()  // "42" → 42, "abc" → validation error
});
```

> Rule of thumb: use `z.coerce.number()` (and `z.coerce.boolean()`) for every field that comes from `params` or `query`. Use plain `z.number()` / `z.boolean()` for `body` fields, where the JSON parser has already converted types.

---

## Reusing sub-schemas

Extract schemas that appear in multiple features into a shared file:

```ts
// services/password.schema.ts
import { z } from 'zod';

export const passwordSchema = z.string().min(8).max(255);
```

```ts
// services/users/users.schema.ts
import { passwordSchema } from '../password.schema.js';

const updatePasswordBodySchema = z.object({
  id: z.number().int(),
  password: passwordSchema,
  oldPassword: passwordSchema
});
```

---

## Exporting inferred types

Never write the TypeScript type manually — derive it from the schema:

```ts
// users.schema.ts
import { z } from 'zod';

const addBodySchema = z.object({
  firstname: z.string().max(50),
  lastname:  z.string().max(50),
  email:     z.string().email().max(100),
  password:  z.string().min(8).max(255),
  roles:     z.string()
});

export const addSchema = { body: addBodySchema };
export type AddUserBody = z.infer<typeof addBodySchema>;
```

Then use the type in the service:

```ts
// users.service.ts
import type { AddUserBody } from './users.schema.js';

async add(req: Request, res: Response): Promise<void> {
  const body = req.body as AddUserBody;
  // body.firstname, body.email, etc. are fully typed
}
```

---

## Full annotated example

```ts
// services/users/users.schema.ts
import { z } from 'zod';
import { passwordSchema } from '../password.schema.js';

// ── params schemas (use coerce for URL segments) ──────────────────────────
const getByIdParamsSchema = z.object({
  id: z.coerce.number().int()
});

// ── body schemas ──────────────────────────────────────────────────────────
const addBodySchema = z.object({
  firstname: z.string().max(50),
  lastname:  z.string().max(50),
  email:     z.string().email().max(100),
  password:  passwordSchema,
  roles:     z.string()
});

const updateInformationsBodySchema = z.object({
  id:        z.number().int(),
  firstname: z.string().max(50),
  lastname:  z.string().max(50),
  email:     z.string().email().max(100)
});

const updatePasswordBodySchema = z.object({
  id:          z.number().int(),
  password:    passwordSchema,
  oldPassword: passwordSchema
});

// ── RouteSchema objects (passed to routesConfig) ──────────────────────────
export const getByIdSchema             = { params: getByIdParamsSchema };
export const addSchema                 = { body: addBodySchema };
export const updateInformationsSchema  = { body: updateInformationsBodySchema };
export const updatePasswordSchema      = { body: updatePasswordBodySchema };

// ── Inferred TypeScript types ─────────────────────────────────────────────
export type GetByIdParams          = z.infer<typeof getByIdParamsSchema>;
export type AddUserBody            = z.infer<typeof addBodySchema>;
export type UpdateInformationsBody = z.infer<typeof updateInformationsBodySchema>;
export type UpdatePasswordBody     = z.infer<typeof updatePasswordBodySchema>;
```
