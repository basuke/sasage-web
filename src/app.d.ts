/// <reference types="@sveltejs/kit" />

type Lang = 'en' | 'ja';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
    interface Locals {
        lang: Lang;
        /** True if the current request has a valid admin session */
        authenticated: boolean;
    }

    interface Platform {
        env?: {
            DB?: import('$lib/server/d1-types').D1Database;
            ADMIN_PASSWORD_HASH?: string;
        };
    }

    // interface Stuff {}
}
