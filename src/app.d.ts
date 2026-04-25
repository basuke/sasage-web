/// <reference types="@sveltejs/kit" />

type Lang = 'en' | 'ja';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
    interface Locals {
        lang: Lang;
        /** True if the current request has a valid admin session */
        authenticated: boolean;
        /** The authenticated user (email), if any */
        user: { email: string } | null;
    }

    interface Platform {
        env?: {
            DB?: import('$lib/server/d1-types').D1Database;
        };
    }

    // interface Stuff {}
}
