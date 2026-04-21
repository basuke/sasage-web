import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock $app/environment
vi.mock('$app/environment', () => ({ dev: true }));

import {
    createPasswordHash,
    verifyPassword,
    generateSessionToken,
    normalizeEmail,
    authenticateUser,
    getUserStore,
    MemorySessionStore,
    MemoryUserStore,
    SESSION_MAX_AGE,
    SESSION_COOKIE,
    type User,
    type UserStore,
} from './auth';

describe('Password hashing', () => {
    it('creates a hash in salt:hash format', async () => {
        const hash = await createPasswordHash('test-password');
        const parts = hash.split(':');
        expect(parts).toHaveLength(2);
        // salt is 16 bytes = 32 hex chars, hash is 32 bytes = 64 hex chars
        expect(parts[0]).toHaveLength(32);
        expect(parts[1]).toHaveLength(64);
    });

    it('generates different hashes for the same password (random salt)', async () => {
        const hash1 = await createPasswordHash('same-password');
        const hash2 = await createPasswordHash('same-password');
        expect(hash1).not.toBe(hash2);
    });

    it('verifies a correct password', async () => {
        const hash = await createPasswordHash('correct-password');
        const result = await verifyPassword('correct-password', hash);
        expect(result).toBe(true);
    });

    it('rejects an incorrect password', async () => {
        const hash = await createPasswordHash('correct-password');
        const result = await verifyPassword('wrong-password', hash);
        expect(result).toBe(false);
    });

    it('rejects empty password against a valid hash', async () => {
        const hash = await createPasswordHash('some-password');
        const result = await verifyPassword('', hash);
        expect(result).toBe(false);
    });

    it('rejects with invalid stored hash format', async () => {
        expect(await verifyPassword('password', 'invalid-hash')).toBe(false);
        expect(await verifyPassword('password', '')).toBe(false);
        expect(await verifyPassword('password', 'a:b:c')).toBe(false);
    });
});

describe('normalizeEmail', () => {
    it('lowercases and trims', () => {
        expect(normalizeEmail('  User@Example.COM ')).toBe('user@example.com');
    });

    it('leaves already-normalized emails unchanged', () => {
        expect(normalizeEmail('user@example.com')).toBe('user@example.com');
    });
});

describe('Session token generation', () => {
    it('generates a 64-char hex string (32 bytes)', () => {
        const token = generateSessionToken();
        expect(token).toHaveLength(64);
        expect(token).toMatch(/^[0-9a-f]+$/);
    });

    it('generates unique tokens', () => {
        const tokens = new Set(Array.from({ length: 10 }, () => generateSessionToken()));
        expect(tokens.size).toBe(10);
    });
});

describe('MemorySessionStore', () => {
    let store: MemorySessionStore;

    beforeEach(() => {
        store = new MemorySessionStore();
    });

    it('creates and validates a session, returning the user email', async () => {
        const token = 'test-token';
        const expiresAt = Date.now() + 60_000;
        await store.create(token, 'user@example.com', expiresAt);
        const session = await store.validate(token);
        expect(session).toEqual({ userEmail: 'user@example.com' });
    });

    it('rejects a non-existent session', async () => {
        expect(await store.validate('nonexistent')).toBeNull();
    });

    it('rejects an expired session', async () => {
        const token = 'expired-token';
        const expiresAt = Date.now() - 1000; // already expired
        await store.create(token, 'user@example.com', expiresAt);
        expect(await store.validate(token)).toBeNull();
    });

    it('deletes a session', async () => {
        const token = 'delete-me';
        await store.create(token, 'user@example.com', Date.now() + 60_000);
        expect(await store.validate(token)).not.toBeNull();

        await store.delete(token);
        expect(await store.validate(token)).toBeNull();
    });

    it('cleanup removes expired sessions', async () => {
        await store.create('valid', 'user@example.com', Date.now() + 60_000);
        await store.create('expired1', 'user@example.com', Date.now() - 1000);
        await store.create('expired2', 'user@example.com', Date.now() - 2000);

        await store.cleanup();

        expect(await store.validate('valid')).not.toBeNull();
        expect(await store.validate('expired1')).toBeNull();
        expect(await store.validate('expired2')).toBeNull();
    });
});

describe('MemoryUserStore', () => {
    it('returns null for unknown emails', async () => {
        const store = new MemoryUserStore();
        expect(await store.findByEmail('nobody@example.com')).toBeNull();
    });

    it('finds a seeded user', async () => {
        const hash = await createPasswordHash('pw');
        const user: User = {
            email: 'user@example.com',
            passwordHash: hash,
            createdAt: Date.now(),
        };
        const store = new MemoryUserStore(user);
        const found = await store.findByEmail('user@example.com');
        expect(found).toEqual(user);
    });

    it('lookup is case-insensitive', async () => {
        const hash = await createPasswordHash('pw');
        const user: User = {
            email: 'user@example.com',
            passwordHash: hash,
            createdAt: Date.now(),
        };
        const store = new MemoryUserStore(user);
        const found = await store.findByEmail('  USER@Example.com  ');
        expect(found?.email).toBe('user@example.com');
    });
});

describe('authenticateUser', () => {
    async function makeStoreWithUser(email: string, password: string): Promise<UserStore> {
        const hash = await createPasswordHash(password);
        return new MemoryUserStore({ email, passwordHash: hash, createdAt: Date.now() });
    }

    it('returns the normalized email on success', async () => {
        const store = await makeStoreWithUser('user@example.com', 'secret');
        const result = await authenticateUser(store, '  USER@Example.com ', 'secret');
        expect(result).toBe('user@example.com');
    });

    it('returns null on wrong password', async () => {
        const store = await makeStoreWithUser('user@example.com', 'secret');
        const result = await authenticateUser(store, 'user@example.com', 'wrong');
        expect(result).toBeNull();
    });

    it('returns null for unknown email', async () => {
        const store = await makeStoreWithUser('user@example.com', 'secret');
        const result = await authenticateUser(store, 'other@example.com', 'secret');
        expect(result).toBeNull();
    });
});

describe('getUserStore (dev mode)', () => {
    it('seeds a default dev user when no DB is bound', async () => {
        const store = await getUserStore();
        const user = await store.findByEmail('admin@example.com');
        expect(user).not.toBeNull();
        expect(await verifyPassword('admin', user!.passwordHash)).toBe(true);
    });
});

describe('Constants', () => {
    it('SESSION_MAX_AGE is 7 days in seconds', () => {
        expect(SESSION_MAX_AGE).toBe(7 * 24 * 60 * 60);
    });

    it('SESSION_COOKIE has a defined name', () => {
        expect(SESSION_COOKIE).toBe('admin_session');
    });
});
