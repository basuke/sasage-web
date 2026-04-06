import { parseAcceptLanguage } from 'intl-parse-accept-language';
import type { Handle } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
    event.locals.lang = preferredLanguage(event.request);

    const response = await resolve(event);

    return response;
};

const acceptableLanguages: Lang[] = ['en', 'ja'];

function preferredLanguage(request: Request): Lang {
    const acceptLanguage = request.headers.get('accept-language') ?? '';
    const languages = parseAcceptLanguage(acceptLanguage) as Lang[];
    return languages
        .filter((lang) => acceptableLanguages.includes(lang))
        .concat(acceptableLanguages)[0]!;
}
