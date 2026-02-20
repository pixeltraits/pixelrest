export const APP_MYSQL_URL = process.env.APP_MYSQL_URL || 'http://localhost:1338';
export const APP_POSTGRES_URL = process.env.APP_POSTGRES_URL || 'http://localhost:1339';

let userCounter = 0;

export function uniqueEmail(): string {
  userCounter++;
  return `test-${Date.now()}-${userCounter}@example.com`;
}

export async function createUser(baseUrl: string, overrides: Record<string, string> = {}): Promise<{ user: Record<string, unknown>; password: string }> {
  const password = 'password123';
  const body = {
    firstname: 'Test',
    lastname: 'User',
    email: uniqueEmail(),
    password,
    roles: 'admin',
    ...overrides
  };

  const res = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`createUser failed (${res.status}): ${text}`);
  }

  const user = await res.json() as Record<string, unknown>;
  return { user, password };
}

export async function login(baseUrl: string, email: string, password: string): Promise<string> {
  const res = await fetch(`${baseUrl}/connexion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`login failed (${res.status}): ${text}`);
  }

  const data = await res.json() as { token: string };
  return data.token;
}

export function authHeaders(token: string): Record<string, string> {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// Minimal valid 1x1 PNG
export const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  'base64'
);
