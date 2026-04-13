import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    if (!dev) {
        throw redirect(303, '/');
    }
    return {};
};
