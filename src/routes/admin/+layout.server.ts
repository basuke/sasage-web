import type { LayoutServerLoad } from './$types';

// Authentication is handled by hooks.server.ts.
// This load function passes the authenticated state to the client.
export const load: LayoutServerLoad = async ({ locals }) => {
    return { authenticated: locals.authenticated };
};
