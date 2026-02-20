import { describe, it, expect } from 'vitest';
import { APP_MYSQL_URL, APP_POSTGRES_URL, createUser, login, authHeaders } from './helpers.js';

const databases = [
  ['MySQL', APP_MYSQL_URL],
  ['PostgreSQL', APP_POSTGRES_URL]
] as const;

describe.each(databases)('%s - Users & Connexion', (_dbName, baseUrl) => {
  let userId: number;
  let userEmail: string;
  let userPassword: string;
  let token: string;

  it('POST /users - should create a user', async () => {
    const { user, password } = await createUser(baseUrl);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstname', 'Test');
    expect(user).toHaveProperty('lastname', 'User');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('roles', 'admin');

    userId = user.id as number;
    userEmail = user.email as string;
    userPassword = password;
  });

  it('POST /connexion - should login and return a token', async () => {
    token = await login(baseUrl, userEmail, userPassword);
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
  });

  it('GET /users - should list users (authenticated)', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      headers: authHeaders(token)
    });

    expect(res.status).toBe(200);
    const users = await res.json() as Array<Record<string, unknown>>;
    expect(Array.isArray(users)).toBe(true);

    const found = users.find(u => u.id === userId);
    expect(found).toBeDefined();
    expect(found!.email).toBe(userEmail);
  });

  it('GET /users/:id - should get a user by ID (authenticated)', async () => {
    const res = await fetch(`${baseUrl}/users/${userId}`, {
      headers: authHeaders(token)
    });

    expect(res.status).toBe(200);
    const user = await res.json() as Record<string, unknown>;
    expect(user.id).toBe(userId);
    expect(user.email).toBe(userEmail);
  });

  it('PUT /users/update-info - should update user info (authenticated)', async () => {
    const res = await fetch(`${baseUrl}/users/update-info`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({
        id: userId,
        firstname: 'Updated',
        lastname: 'Name',
        email: userEmail
      })
    });

    expect(res.status).toBe(200);
    const user = await res.json() as Record<string, unknown>;
    expect(user.firstname).toBe('Updated');
    expect(user.lastname).toBe('Name');
  });

  it('PUT /users/update-pass - should update password (authenticated)', async () => {
    const newPassword = 'newpassword456';
    const res = await fetch(`${baseUrl}/users/update-pass`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({
        id: userId,
        oldPassword: userPassword,
        password: newPassword
      })
    });

    expect(res.status).toBe(200);

    // Verify new password works
    const newToken = await login(baseUrl, userEmail, newPassword);
    expect(newToken).toBeTruthy();
  });
});
