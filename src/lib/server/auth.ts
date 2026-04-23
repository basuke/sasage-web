import { dev } from '$app/environment';
import type { D1Database } from './d1-types';

export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds
const PBKDF2_ITERATIONS = 100_000;

// --- Hex encoding/decoding ---

function hexEncode(data: ArrayBuffer | Uint8Array): string {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexDecode(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}

// --- Password Hashing (PBKDF2) ---

async function pbkdf2Hash(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits'],
    );
    return crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: new Uint8Array(salt),
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256',
        },
        keyMaterial,
        256,
    );
}

/** Create a storable hash string from a password. Format: `salt_hex:hash_hex` */
export async function createPasswordHash(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await pbkdf2Hash(password, salt);
    return `${hexEncode(salt)}:${hexEncode(hash)}`;
}

/** Verify a password against a stored hash string. Uses constant-time comparison. */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;
    const [saltHex, hashHex] = parts as [string, string];
    if (!saltHex || !hashHex) return false;

    const salt = hexDecode(saltHex);
    const expectedHash = hexDecode(hashHex);
    const actualHash = new Uint8Array(await pbkdf2Hash(password, salt));

    if (expectedHash.length !== actualHash.length) return false;

    // Constant-time comparison to prevent timing attacks
    let diff = 0;
    for (let i = 0; i < expectedHash.length; i++) {
        diff |= expectedHash[i]! ^ actualHash[i]!;
    }
    return diff === 0;
}

/** Normalize an email for storage and lookup: trim + lowercase. */
export function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

// --- User Store ---

export interface User {
    email: string;
    passwordHash: string;
    createdAt: number;
}

export interface UserStore {
    findByEmail(email: string): Promise<User | null>;
}

/** In-memory user store for dev mode. Seeded with a default admin user. */
class MemoryUserStore implements UserStore {
    private users = new Map<string, User>();

    constructor(seed?: User) {
        if (seed) {
            const key = normalizeEmail(seed.email);
            this.users.set(key, { ...seed, email: key });
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.get(normalizeEmail(email)) ?? null;
    }
}

interface UserRow {
    email: string;
    password_hash: string;
    created_at: number;
}

/** D1-backed user store for production */
class D1UserStore implements UserStore {
    constructor(private db: D1Database) {}

    async findByEmail(email: string): Promise<User | null> {
        const row = await this.db
            .prepare('SELECT email, password_hash, created_at FROM users WHERE email = ?')
            .bind(normalizeEmail(email))
            .first<UserRow>();

        if (!row) return null;
        return {
            email: row.email,
            passwordHash: row.password_hash,
            createdAt: row.created_at,
        };
    }
}

// Dev-mode default user. Seeded lazily on first call to getUserStore().
const DEV_DEFAULT_EMAIL = 'admin@example.com';
const DEV_DEFAULT_PASSWORD = 'admin';
let memoryUserStore: MemoryUserStore | undefined;
let devUserLogged = false;

async function getMemoryUserStore(): Promise<MemoryUserStore> {
    if (!memoryUserStore) {
        const seed: User = {
            email: DEV_DEFAULT_EMAIL,
            passwordHash: await createPasswordHash(DEV_DEFAULT_PASSWORD),
            createdAt: Date.now(),
        };
        memoryUserStore = new MemoryUserStore(seed);
    }
    if (!devUserLogged) {
        console.log(
            `Auth: dev mode — default user ${DEV_DEFAULT_EMAIL} / password ${DEV_DEFAULT_PASSWORD}`,
        );
        devUserLogged = true;
    }
    return memoryUserStore;
}

export async function getUserStore(platform?: App.Platform): Promise<UserStore> {
    const db = platform?.env?.DB;
    if (db) return new D1UserStore(db);

    if (!dev) {
        throw new Error(
            'User store misconfiguration: missing required D1 binding `DB` in non-dev environment.',
        );
    }

    return getMemoryUserStore();
}

/**
 * Authenticate a user with email + password.
 * Returns the stored (normalized) user email on success, or null on failure.
 * `store.findByEmail()` normalizes its argument, so callers may pass a raw
 * user-supplied email. Runs a dummy hash verification on unknown emails to
 * keep the response time uniform.
 */
export async function authenticateUser(
    store: UserStore,
    email: string,
    password: string,
): Promise<string | null> {
    const user = await store.findByEmail(email);

    if (!user) {
        // Run a dummy hash verification so the response time does not leak
        // whether the email exists in the database.
        await verifyPassword(password, DUMMY_HASH);
        return null;
    }

    const ok = await verifyPassword(password, user.passwordHash);
    return ok ? user.email : null;
}

// Precomputed hash of an empty string; used only for timing parity in
// authenticateUser() when the email is unknown.
const DUMMY_HASH =
    '00000000000000000000000000000000:0000000000000000000000000000000000000000000000000000000000000000';

// --- Session Management ---

export interface SessionValidation {
    userEmail: string;
}

export interface SessionStore {
    create(token: string, userEmail: string, expiresAt: number): Promise<void>;
    validate(token: string): Promise<SessionValidation | null>;
    delete(token: string): Promise<void>;
    cleanup(): Promise<void>;
}

interface SessionRow {
    user_email: string;
    expires_at: number;
}

/** In-memory session store for dev mode */
class MemorySessionStore implements SessionStore {
    private sessions = new Map<string, { userEmail: string; expiresAt: number }>();

    async create(token: string, userEmail: string, expiresAt: number): Promise<void> {
        this.sessions.set(token, { userEmail, expiresAt });
    }

    async validate(token: string): Promise<SessionValidation | null> {
        const session = this.sessions.get(token);
        if (!session) return null;
        if (Date.now() > session.expiresAt) {
            this.sessions.delete(token);
            return null;
        }
        return { userEmail: session.userEmail };
    }

    async delete(token: string): Promise<void> {
        this.sessions.delete(token);
    }

    async cleanup(): Promise<void> {
        const now = Date.now();
        for (const [token, session] of this.sessions) {
            if (now > session.expiresAt) this.sessions.delete(token);
        }
    }
}

/** D1-backed session store for production */
class D1SessionStore implements SessionStore {
    constructor(private db: D1Database) {}

    async create(token: string, userEmail: string, expiresAt: number): Promise<void> {
        await this.db
            .prepare('INSERT INTO sessions (token, user_email, expires_at) VALUES (?, ?, ?)')
            .bind(token, userEmail, expiresAt)
            .run();
    }

    async validate(token: string): Promise<SessionValidation | null> {
        const row = await this.db
            .prepare('SELECT user_email, expires_at FROM sessions WHERE token = ?')
            .bind(token)
            .first<SessionRow>();

        if (!row) return null;
        if (Date.now() > row.expires_at) {
            await this.delete(token);
            return null;
        }
        return { userEmail: row.user_email };
    }

    async delete(token: string): Promise<void> {
        await this.db.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    }

    async cleanup(): Promise<void> {
        await this.db.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(Date.now()).run();
    }
}

// Singleton memory store (persists across requests in dev)
let memoryStore: MemorySessionStore | undefined;

export function getSessionStore(platform?: App.Platform): SessionStore {
    const db = platform?.env?.DB;
    if (db) return new D1SessionStore(db);

    if (!dev) {
        throw new Error(
            'Session store misconfiguration: missing required D1 binding `DB` in non-dev environment.',
        );
    }

    if (!memoryStore) memoryStore = new MemorySessionStore();
    return memoryStore;
}

// --- Session Token Generation ---

export function generateSessionToken(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return hexEncode(bytes);
}

// --- Exports for testing ---

export { MemorySessionStore, MemoryUserStore };
