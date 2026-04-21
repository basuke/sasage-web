import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

// Mock $app/environment
vi.mock('$app/environment', () => ({ dev: true }));

// Mock auth module
const mockValidate = vi.fn();
vi.mock('$lib/server/auth', () => ({
    SESSION_COOKIE: 'admin_session',
    getSessionStore: () => ({
        validate: mockValidate,
        create: vi.fn(),
        delete: vi.fn(),
        cleanup: vi.fn(),
    }),
}));

// Mock intl-parse-accept-language
vi.mock('intl-parse-accept-language', () => ({
    parseAcceptLanguage: vi.fn().mockReturnValue(['en']),
}));

import { handle } from './hooks.server';

// --- Helpers ---

function mockResolve(event: RequestEvent): Promise<Response> {
    return Promise.resolve(new Response('OK', { status: 200 }));
}

function createMockEvent(pathname: string, options: { cookie?: string } = {}): RequestEvent {
    const cookieStore = new Map<string, string>();
    if (options.cookie) {
        cookieStore.set('admin_session', options.cookie);
    }

    return {
        url: new URL(`http://localhost${pathname}`),
        request: new Request(`http://localhost${pathname}`, {
            headers: { 'accept-language': 'en' },
        }),
        locals: { lang: 'en' as Lang, authenticated: false, user: null },
        cookies: {
            get: (name: string) => cookieStore.get(name),
            set: vi.fn(),
            delete: vi.fn(),
            serialize: vi.fn(),
            getAll: vi.fn().mockReturnValue([]),
        } as unknown as RequestEvent['cookies'],
        params: {},
        platform: {},
        route: { id: '' },
        setHeaders: vi.fn(),
        fetch: globalThis.fetch,
        getClientAddress: () => '127.0.0.1',
        isDataRequest: false,
        isSubRequest: false,
    } as unknown as RequestEvent;
}

async function expectRedirect(fn: () => unknown, status: number, location: string): Promise<void> {
    try {
        await fn();
        expect.fail('Expected a redirect to be thrown');
    } catch (e) {
        expect(e).toHaveProperty('status', status);
        expect(e).toHaveProperty('location', location);
    }
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

describe('hooks.server - public routes', () => {
    it('passes through public route /', async () => {
        const event = createMockEvent('/');
        const response = await handle({ event, resolve: mockResolve });
        expect(response.status).toBe(200);
        expect(event.locals.authenticated).toBe(false);
        expect(event.locals.user).toBeNull();
    });

    it('passes through /works/test', async () => {
        const event = createMockEvent('/works/test');
        const response = await handle({ event, resolve: mockResolve });
        expect(response.status).toBe(200);
    });

    it('passes through /images/test', async () => {
        const event = createMockEvent('/images/test');
        const response = await handle({ event, resolve: mockResolve });
        expect(response.status).toBe(200);
    });

    it('passes through /about', async () => {
        const event = createMockEvent('/about');
        const response = await handle({ event, resolve: mockResolve });
        expect(response.status).toBe(200);
    });
});

describe('hooks.server - admin login page', () => {
    it('allows access to /admin/login without authentication', async () => {
        const event = createMockEvent('/admin/login');
        const response = await handle({ event, resolve: mockResolve });
        expect(response.status).toBe(200);
    });
});

describe('hooks.server - admin pages (unauthenticated)', () => {
    it('redirects /admin to /admin/login when no cookie', async () => {
        const event = createMockEvent('/admin');
        await expectRedirect(() => handle({ event, resolve: mockResolve }), 303, '/admin/login');
    });

    it('redirects /admin/images to /admin/login when no cookie', async () => {
        const event = createMockEvent('/admin/images');
        await expectRedirect(() => handle({ event, resolve: mockResolve }), 303, '/admin/login');
    });

    it('redirects /admin/works to /admin/login when invalid session', async () => {
        mockValidate.mockResolvedValue(null);
        const event = createMockEvent('/admin/works', { cookie: 'invalid-token' });
        await expectRedirect(() => handle({ event, resolve: mockResolve }), 303, '/admin/login');
    });
});

describe('hooks.server - admin API (unauthenticated)', () => {
    it('returns 401 for /api/admin/images without cookie', async () => {
        const event = createMockEvent('/api/admin/images');
        await expectHttpError(() => handle({ event, resolve: mockResolve }), 401);
    });

    it('returns 401 for /api/admin/works with expired session', async () => {
        mockValidate.mockResolvedValue(null);
        const event = createMockEvent('/api/admin/works', { cookie: 'expired-token' });
        await expectHttpError(() => handle({ event, resolve: mockResolve }), 401);
    });

    it('allows access to /api/admin/auth without authentication', async () => {
        const event = createMockEvent('/api/admin/auth');
        const response = await handle({ event, resolve: mockResolve });
        expect(response.status).toBe(200);
    });
});

describe('hooks.server - authenticated access', () => {
    it('allows /admin with valid session and populates user email', async () => {
        mockValidate.mockResolvedValue({ userEmail: 'user@example.com' });
        const event = createMockEvent('/admin', { cookie: 'valid-token' });
        const response = await handle({ event, resolve: mockResolve });
        expect(response.status).toBe(200);
        expect(event.locals.authenticated).toBe(true);
        expect(event.locals.user).toEqual({ email: 'user@example.com' });
    });

    it('allows /admin/images with valid session', async () => {
        mockValidate.mockResolvedValue({ userEmail: 'user@example.com' });
        const event = createMockEvent('/admin/images', { cookie: 'valid-token' });
        const response = await handle({ event, resolve: mockResolve });
        expect(response.status).toBe(200);
        expect(event.locals.authenticated).toBe(true);
    });

    it('allows /api/admin/images with valid session', async () => {
        mockValidate.mockResolvedValue({ userEmail: 'user@example.com' });
        const event = createMockEvent('/api/admin/images', { cookie: 'valid-token' });
        const response = await handle({ event, resolve: mockResolve });
        expect(response.status).toBe(200);
        expect(event.locals.authenticated).toBe(true);
    });
});

describe('hooks.server - language preference', () => {
    it('sets lang in locals', async () => {
        const event = createMockEvent('/');
        await handle({ event, resolve: mockResolve });
        expect(event.locals.lang).toBeDefined();
    });
});
