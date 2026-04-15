console.log('[hooks.server] module loaded');

import { parseAcceptLanguage } from 'intl-parse-accept-language';
import { redirect, error, type Handle } from '@sveltejs/kit';
import { SESSION_COOKIE, getSessionStore } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
    // --- Language preference ---
    event.locals.lang = preferredLanguage(event.request);

    // --- Authentication ---
    const path = event.url.pathname;
    console.log('[hooks.server] path:', path);
    const isAdminPage = path.startsWith('/admin') && path !== '/admin/login';
    const isAdminApi = path.startsWith('/api/admin') && !path.startsWith('/api/admin/auth');

    if (isAdminPage || isAdminApi) {
        const token = event.cookies.get(SESSION_COOKIE);
        if (!token) {
            if (isAdminApi) throw error(401, 'Authentication required');
            throw redirect(303, '/admin/login');
        }

        const sessionStore = getSessionStore(event.platform);
        const valid = await sessionStore.validate(token);
        if (!valid) {
            // Clear invalid cookie
            event.cookies.delete(SESSION_COOKIE, { path: '/' });
            if (isAdminApi) throw error(401, 'Session expired');
            throw redirect(303, '/admin/login');
        }

        event.locals.authenticated = true;
    } else {
        event.locals.authenticated = false;
    }

    return resolve(event);
};

const acceptableLanguages: Lang[] = ['en', 'ja'];

function preferredLanguage(request: Request): Lang {
    const acceptLanguage = request.headers.get('accept-language') ?? '';
    const languages = parseAcceptLanguage(acceptLanguage) as Lang[];
    return languages
        .filter((lang) => acceptableLanguages.includes(lang))
        .concat(acceptableLanguages)[0]!;
}
