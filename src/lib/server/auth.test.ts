import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock $app/environment
vi.mock('$app/environment', () => ({ dev: true }));

import {
    createPasswordHash,
    verifyPassword,
    generateSessionToken,
    getPasswordHash,
    MemorySessionStore,
    SESSION_MAX_AGE,
    SESSION_COOKIE,
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

    it('creates and validates a session', async () => {
        const token = 'test-token';
        const expiresAt = Date.now() + 60_000;
        await store.create(token, expiresAt);
        expect(await store.validate(token)).toBe(true);
    });

    it('rejects a non-existent session', async () => {
        expect(await store.validate('nonexistent')).toBe(false);
    });

    it('rejects an expired session', async () => {
        const token = 'expired-token';
        const expiresAt = Date.now() - 1000; // already expired
        await store.create(token, expiresAt);
        expect(await store.validate(token)).toBe(false);
    });

    it('deletes a session', async () => {
        const token = 'delete-me';
        await store.create(token, Date.now() + 60_000);
        expect(await store.validate(token)).toBe(true);

        await store.delete(token);
        expect(await store.validate(token)).toBe(false);
    });

    it('cleanup removes expired sessions', async () => {
        await store.create('valid', Date.now() + 60_000);
        await store.create('expired1', Date.now() - 1000);
        await store.create('expired2', Date.now() - 2000);

        await store.cleanup();

        expect(await store.validate('valid')).toBe(true);
        // expired ones were already cleaned up by validate or cleanup
        expect(await store.validate('expired1')).toBe(false);
        expect(await store.validate('expired2')).toBe(false);
    });
});

describe('getPasswordHash', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        delete process.env.ADMIN_PASSWORD_HASH;
    });

    it('returns env var when ADMIN_PASSWORD_HASH is set', async () => {
        process.env.ADMIN_PASSWORD_HASH = 'test-salt:test-hash';
        const hash = await getPasswordHash();
        expect(hash).toBe('test-salt:test-hash');
    });

    it('returns platform env when available', async () => {
        const platform = {
            env: { ADMIN_PASSWORD_HASH: 'platform-salt:platform-hash' },
        } as unknown as App.Platform;
        const hash = await getPasswordHash(platform);
        expect(hash).toBe('platform-salt:platform-hash');
    });

    it('returns a default hash in dev mode when not configured', async () => {
        const hash = await getPasswordHash();
        expect(hash).toBeDefined();
        // Should be verifiable with "admin"
        const valid = await verifyPassword('admin', hash!);
        expect(valid).toBe(true);
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
