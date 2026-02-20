import { describe, it, expect } from 'vitest';
import { APP_MYSQL_URL, APP_POSTGRES_URL, createUser, login, TINY_PNG } from './helpers.js';

const databases = [
  ['MySQL', APP_MYSQL_URL],
  ['PostgreSQL', APP_POSTGRES_URL]
] as const;

describe.each(databases)('%s - Documents', (_dbName, baseUrl) => {
  let token: string;

  it('POST /documents - should upload a document (authenticated)', async () => {
    const { user, password } = await createUser(baseUrl);
    token = await login(baseUrl, user.email as string, password);

    const formData = new FormData();
    formData.append('name', 'test-document');
    formData.append('description', 'A test document');
    formData.append('fileDocument', new Blob([TINY_PNG], { type: 'image/png' }), 'test.png');

    const res = await fetch(`${baseUrl}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    expect(res.status).toBe(200);
    const doc = await res.json() as Record<string, unknown>;
    expect(doc).toHaveProperty('id');
    expect(doc).toHaveProperty('name', 'test-document');
    expect(doc).toHaveProperty('description', 'A test document');
    expect(doc).toHaveProperty('filename');
  });
});
