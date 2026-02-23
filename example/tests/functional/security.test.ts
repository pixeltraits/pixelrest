import { describe, it, expect, beforeAll } from 'vitest';
import { APP_MYSQL_URL, APP_POSTGRES_URL, createUser, login, TINY_PNG } from './helpers.js';

const databases = [
  ['MySQL', APP_MYSQL_URL],
  ['PostgreSQL', APP_POSTGRES_URL]
] as const;

describe.each(databases)('%s - Security', (_dbName, baseUrl) => {
  let token: string;

  beforeAll(async () => {
    const { user, password } = await createUser(baseUrl);
    token = await login(baseUrl, user.email as string, password);
  });

  // ─── Path traversal ────────────────────────────────────────────────────────

  it('POST /documents - should sanitize path traversal filename (../../etc/passwd.png)', async () => {
    const formData = new FormData();
    formData.append('name', 'traversal-test');
    formData.append('description', 'Path traversal attempt');
    formData.append('fileDocument', new Blob([TINY_PNG], { type: 'image/png' }), '../../etc/passwd.png');

    const res = await fetch(`${baseUrl}/documents`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    expect(res.status).toBe(200);
    const doc = await res.json() as Record<string, unknown>;
    const filename = doc.filename as string;
    expect(filename).not.toContain('..');
    expect(filename).not.toContain('/');
    expect(filename).not.toContain('\\');
  });

  it('POST /documents - should sanitize absolute path in filename (/etc/passwd.png)', async () => {
    const formData = new FormData();
    formData.append('name', 'absolute-path-test');
    formData.append('description', 'Absolute path attempt');
    formData.append('fileDocument', new Blob([TINY_PNG], { type: 'image/png' }), '/etc/passwd.png');

    const res = await fetch(`${baseUrl}/documents`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    expect(res.status).toBe(200);
    const doc = await res.json() as Record<string, unknown>;
    const filename = doc.filename as string;
    expect(filename).not.toContain('/');
    expect(filename).not.toContain('..');
  });

  it('POST /documents - should sanitize special characters in filename', async () => {
    const formData = new FormData();
    formData.append('name', 'special-chars-test');
    formData.append('description', 'Special chars attempt');
    formData.append('fileDocument', new Blob([TINY_PNG], { type: 'image/png' }), 'my file; rm -rf *.png');

    const res = await fetch(`${baseUrl}/documents`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    expect(res.status).toBe(200);
    const doc = await res.json() as Record<string, unknown>;
    const filename = doc.filename as string;
    expect(filename).toMatch(/^[a-zA-Z0-9._-]+$/);
  });

  // ─── Security headers ──────────────────────────────────────────────────────

  it('should include X-Content-Type-Options: nosniff header', async () => {
    const res = await fetch(`${baseUrl}/users`);

    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
  });

  it('should include X-Frame-Options header', async () => {
    const res = await fetch(`${baseUrl}/users`);

    expect(res.headers.get('x-frame-options')).toBeTruthy();
  });

  it('should include Content-Security-Policy header', async () => {
    const res = await fetch(`${baseUrl}/users`);

    expect(res.headers.get('content-security-policy')).toBeTruthy();
  });

  it('should not expose X-Powered-By header', async () => {
    const res = await fetch(`${baseUrl}/users`);

    expect(res.headers.get('x-powered-by')).toBeNull();
  });

  // ─── JWT manipulation ──────────────────────────────────────────────────────

  it('should return 401 for a tampered JWT signature', async () => {
    const [header, payload] = token.split('.');
    const tamperedToken = `${header}.${payload}.invalidsignature`;

    const res = await fetch(`${baseUrl}/users`, {
      headers: { 'Authorization': `Bearer ${tamperedToken}` }
    });

    expect(res.status).toBe(401);
  });

  it('should return 401 for a JWT signed with a wrong secret', async () => {
    const fakeHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const fakePayload = Buffer.from(JSON.stringify({ id: 1, roles: ['admin'] })).toString('base64url');
    const fakeToken = `${fakeHeader}.${fakePayload}.fakesignature`;

    const res = await fetch(`${baseUrl}/users`, {
      headers: { 'Authorization': `Bearer ${fakeToken}` }
    });

    expect(res.status).toBe(401);
  });

  it('should return 401 for a malformed token', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      headers: { 'Authorization': 'Bearer not.a.valid.jwt.at.all' }
    });

    expect(res.status).toBe(401);
  });

  // ─── SQL injection ─────────────────────────────────────────────────────────

  it('should safely handle SQL injection in email field on login', async () => {
    const res = await fetch(`${baseUrl}/connexion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "'; DROP TABLE users; --",
        password: 'password123'
      })
    });

    expect(res.status).toBe(503);

    // Verify the table still exists and works
    const { user, password } = await createUser(baseUrl);
    const loginRes = await fetch(`${baseUrl}/connexion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password })
    });
    expect(loginRes.status).toBe(200);
  });

  // ─── Rate limiting ─────────────────────────────────────────────────────────

  it('POST /connexion - should return 429 after exceeding the rate limit', async () => {
    const statuses: number[] = [];

    for (let i = 0; i <= 50; i++) {
      const res = await fetch(`${baseUrl}/connexion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `ratelimit-${i}@test.com`, password: 'wrongpassword' })
      });
      statuses.push(res.status);

      if (res.status === 429) break;
    }

    expect(statuses).toContain(429);
  }, 60000);

  it('should safely store SQL injection attempts in user fields', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstname: "'; DROP TABLE users; --",
        lastname: "1' OR '1'='1",
        email: `injection-${Date.now()}@test.com`,
        password: 'password123',
        roles: 'admin'
      })
    });

    expect(res.status).toBe(200);
    const user = await res.json() as Record<string, unknown>;
    expect(user.firstname).toBe("'; DROP TABLE users; --");
    expect(user.lastname).toBe("1' OR '1'='1");
  });
});
