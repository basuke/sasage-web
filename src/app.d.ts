/// <reference types="@sveltejs/kit" />

type Lang = 'en' | 'ja';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
    interface Locals {
        lang: Lang;
    }

    interface Platform {
        env?: {
            DB?: import('$lib/server/d1-types').D1Database;
        };
    }

    // interface Stuff {}
}
