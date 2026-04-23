import { dev } from '$app/environment';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import {
    SESSION_COOKIE,
    SESSION_MAX_AGE,
    authenticateUser,
    generateSessionToken,
    getSessionStore,
    getUserStore,
} from '$lib/server/auth';

/** POST: Login — verify email + password, create session, set cookie */
export const POST: RequestHandler = async ({ request, cookies, platform }) => {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        throw error(400, 'Invalid JSON');
    }

    if (!body || typeof body !== 'object') {
        throw error(400, 'Email and password are required');
    }

    const { email, password } = body as { email?: unknown; password?: unknown };
    if (typeof email !== 'string' || !email.trim()) {
        throw error(400, 'Email is required');
    }
    if (typeof password !== 'string' || !password) {
        throw error(400, 'Password is required');
    }

    let userStore;
    try {
        userStore = await getUserStore(platform);
    } catch {
        throw error(503, 'Authentication is not configured (missing DB binding)');
    }

    const authenticatedEmail = await authenticateUser(userStore, email, password);
    if (!authenticatedEmail) {
        throw error(401, 'Invalid email or password');
    }

    // Create session
    const token = generateSessionToken();
    const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
    const sessionStore = getSessionStore(platform);
    await sessionStore.create(token, authenticatedEmail, expiresAt);

    // Set session cookie
    cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: !dev,
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE,
    });

    return json({ success: true });
};

/** DELETE: Logout — clear session and cookie */
export const DELETE: RequestHandler = async ({ cookies, platform }) => {
    const token = cookies.get(SESSION_COOKIE);
    if (token) {
        const sessionStore = getSessionStore(platform);
        await sessionStore.delete(token);
    }

    cookies.delete(SESSION_COOKIE, { path: '/' });

    return json({ success: true });
};
