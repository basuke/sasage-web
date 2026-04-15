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

// --- Password Hash Retrieval ---

/**
 * Get the admin password hash from environment.
 * In dev mode, falls back to a default password "admin" if not configured.
 */
let devPasswordHash: string | undefined;

export async function getPasswordHash(platform?: App.Platform): Promise<string | undefined> {
    // Check platform env (Cloudflare Pages production)
    const platformHash = (platform?.env as Record<string, unknown> | undefined)
        ?.ADMIN_PASSWORD_HASH;
    if (typeof platformHash === 'string' && platformHash) return platformHash;

    // Check process.env (dev mode)
    const envHash = process.env.ADMIN_PASSWORD_HASH;
    if (envHash) return envHash;

    // In dev mode, use default password "admin"
    if (dev) {
        if (!devPasswordHash) {
            devPasswordHash = await createPasswordHash('admin');
            console.log('Auth: using default dev password "admin"');
        }
        return devPasswordHash;
    }

    return undefined;
}

// --- Session Management ---

export interface SessionStore {
    create(token: string, expiresAt: number): Promise<void>;
    validate(token: string): Promise<boolean>;
    delete(token: string): Promise<void>;
    cleanup(): Promise<void>;
}

/** In-memory session store for dev mode */
class MemorySessionStore implements SessionStore {
    private sessions = new Map<string, number>(); // token -> expiresAt timestamp (ms)

    async create(token: string, expiresAt: number): Promise<void> {
        this.sessions.set(token, expiresAt);
    }

    async validate(token: string): Promise<boolean> {
        const expiresAt = this.sessions.get(token);
        if (expiresAt === undefined) return false;
        if (Date.now() > expiresAt) {
            this.sessions.delete(token);
            return false;
        }
        return true;
    }

    async delete(token: string): Promise<void> {
        this.sessions.delete(token);
    }

    async cleanup(): Promise<void> {
        const now = Date.now();
        for (const [token, expiresAt] of this.sessions) {
            if (now > expiresAt) this.sessions.delete(token);
        }
    }
}

/** D1-backed session store for production */
class D1SessionStore implements SessionStore {
    constructor(private db: D1Database) {}

    async create(token: string, expiresAt: number): Promise<void> {
        await this.db
            .prepare('INSERT INTO sessions (token, expires_at) VALUES (?, ?)')
            .bind(token, expiresAt)
            .run();
    }

    async validate(token: string): Promise<boolean> {
        const row = await this.db
            .prepare('SELECT expires_at FROM sessions WHERE token = ?')
            .bind(token)
            .first<{ expires_at: number }>();

        if (!row) return false;
        if (Date.now() > row.expires_at) {
            await this.delete(token);
            return false;
        }
        return true;
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

    if (!memoryStore) memoryStore = new MemorySessionStore();
    return memoryStore;
}

// --- Session Token Generation ---

export function generateSessionToken(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return hexEncode(bytes);
}

// --- Exports for testing ---

export { MemorySessionStore };
