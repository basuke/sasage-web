import { dev } from '$app/environment';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import {
    SESSION_COOKIE,
    SESSION_MAX_AGE,
    getPasswordHash,
    verifyPassword,
    generateSessionToken,
    getSessionStore,
} from '$lib/server/auth';

/** POST: Login — verify password, create session, set cookie */
export const POST: RequestHandler = async ({ request, cookies, platform }) => {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        throw error(400, 'Invalid JSON');
    }

    if (!body || typeof body !== 'object' || !('password' in body)) {
        throw error(400, 'Password is required');
    }

    const password = (body as { password: unknown }).password;
    if (typeof password !== 'string' || !password) {
        throw error(400, 'Password must be a non-empty string');
    }

    const storedHash = await getPasswordHash(platform);
    if (!storedHash) {
        throw error(503, 'Authentication is not configured');
    }

    const valid = await verifyPassword(password, storedHash);
    if (!valid) {
        throw error(401, 'Invalid password');
    }

    // Create session
    const token = generateSessionToken();
    const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
    const sessionStore = getSessionStore(platform);
    await sessionStore.create(token, expiresAt);

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
