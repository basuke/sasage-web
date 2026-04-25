import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

// Mock $app/environment
vi.mock('$app/environment', () => ({ dev: true }));

// Mock auth module
const mockCreate = vi.fn();
const mockDelete = vi.fn();
const mockAuthenticateUser = vi.fn();
const mockGetUserStore = vi.fn().mockResolvedValue({ findByEmail: vi.fn() });
const mockGenerateSessionToken = vi.fn().mockReturnValue('mock-session-token');

vi.mock('$lib/server/auth', () => ({
    SESSION_COOKIE: 'admin_session',
    SESSION_MAX_AGE: 604800,
    authenticateUser: (...args: unknown[]) => mockAuthenticateUser(...args),
    getUserStore: (...args: unknown[]) => mockGetUserStore(...args),
    normalizeEmail: (email: string) => email.trim().toLowerCase(),
    generateSessionToken: () => mockGenerateSessionToken(),
    getSessionStore: () => ({
        create: mockCreate,
        delete: mockDelete,
        validate: vi.fn(),
        cleanup: vi.fn(),
    }),
}));

import { POST, DELETE } from './+server';

// --- Helpers ---

function mockEvent(overrides: Partial<RequestEvent> = {}): RequestEvent {
    const cookieStore = new Map<string, string>();
    return {
        params: {},
        request: new Request('http://localhost'),
        url: new URL('http://localhost'),
        locals: { lang: 'en' as Lang, authenticated: false, user: null },
        cookies: {
            get: (name: string) => cookieStore.get(name),
            set: vi.fn((name: string, value: string) => cookieStore.set(name, value)),
            delete: vi.fn(),
            serialize: vi.fn(),
            getAll: vi.fn().mockReturnValue([]),
        } as unknown as RequestEvent['cookies'],
        fetch: globalThis.fetch,
        getClientAddress: () => '127.0.0.1',
        platform: {},
        route: { id: '' },
        setHeaders: vi.fn(),
        isDataRequest: false,
        isSubRequest: false,
        ...overrides,
    } as unknown as RequestEvent;
}

function jsonRequest(method: string, body: unknown): Request {
    return new Request('http://localhost', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

async function expectHttpError(fn: () => unknown, status: number): Promise<void> {
    try {
        await fn();
        expect.fail('Expected an error to be thrown');
    } catch (e) {
        expect(e).toHaveProperty('status', status);
    }
}

// --- Tests ---

beforeEach(() => {
    vi.clearAllMocks();
});

describe('Auth API - POST (login)', () => {
    it('returns 200 and sets session cookie on valid email + password', async () => {
        mockAuthenticateUser.mockResolvedValue('user@example.com');

        const event = mockEvent({
            request: jsonRequest('POST', { email: 'user@example.com', password: 'correct' }),
        });
        const res = await POST(event);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockCreate).toHaveBeenCalledWith(
            'mock-session-token',
            'user@example.com',
            expect.any(Number),
        );
        expect(event.cookies.set).toHaveBeenCalledWith(
            'admin_session',
            'mock-session-token',
            expect.objectContaining({
                httpOnly: true,
                path: '/',
            }),
        );
    });

    it('stores the normalized email in the session on login', async () => {
        mockAuthenticateUser.mockResolvedValue('user@example.com');

        const event = mockEvent({
            request: jsonRequest('POST', {
                email: '  User@Example.COM ',
                password: 'correct',
            }),
        });
        await POST(event);

        expect(mockCreate).toHaveBeenCalledWith(
            'mock-session-token',
            'user@example.com',
            expect.any(Number),
        );
    });

    it('returns 401 on bad credentials', async () => {
        mockAuthenticateUser.mockResolvedValue(null);

        await expectHttpError(
            () =>
                POST(
                    mockEvent({
                        request: jsonRequest('POST', {
                            email: 'user@example.com',
                            password: 'wrong',
                        }),
                    }),
                ),
            401,
        );
    });

    it('returns 400 when email is missing', async () => {
        await expectHttpError(
            () => POST(mockEvent({ request: jsonRequest('POST', { password: 'pw' }) })),
            400,
        );
    });

    it('returns 400 when email is empty', async () => {
        await expectHttpError(
            () =>
                POST(mockEvent({ request: jsonRequest('POST', { email: '   ', password: 'pw' }) })),
            400,
        );
    });

    it('returns 400 when password is missing', async () => {
        await expectHttpError(
            () =>
                POST(
                    mockEvent({
                        request: jsonRequest('POST', { email: 'user@example.com' }),
                    }),
                ),
            400,
        );
    });

    it('returns 400 when password is empty', async () => {
        await expectHttpError(
            () =>
                POST(
                    mockEvent({
                        request: jsonRequest('POST', {
                            email: 'user@example.com',
                            password: '',
                        }),
                    }),
                ),
            400,
        );
    });

    it('returns 400 when body is not JSON', async () => {
        const req = new Request('http://localhost', {
            method: 'POST',
            body: 'not json',
        });
        await expectHttpError(() => POST(mockEvent({ request: req })), 400);
    });

    it('returns 503 when the user store is not configured', async () => {
        mockGetUserStore.mockRejectedValueOnce(new Error('missing DB binding'));

        await expectHttpError(
            () =>
                POST(
                    mockEvent({
                        request: jsonRequest('POST', {
                            email: 'user@example.com',
                            password: 'pw',
                        }),
                    }),
                ),
            503,
        );
    });
});

describe('Auth API - DELETE (logout)', () => {
    it('clears session and cookie', async () => {
        const cookieStore = new Map([['admin_session', 'existing-token']]);
        const event = mockEvent({
            cookies: {
                get: (name: string) => cookieStore.get(name),
                set: vi.fn(),
                delete: vi.fn(),
                serialize: vi.fn(),
                getAll: vi.fn().mockReturnValue([]),
            } as unknown as RequestEvent['cookies'],
        });

        const res = await DELETE(event);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockDelete).toHaveBeenCalledWith('existing-token');
        expect(event.cookies.delete).toHaveBeenCalledWith('admin_session', { path: '/' });
    });

    it('succeeds even with no active session', async () => {
        const event = mockEvent();
        const res = await DELETE(event);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(mockDelete).not.toHaveBeenCalled();
    });
});
