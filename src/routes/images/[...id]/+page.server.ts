import { error } from '@sveltejs/kit';
import { findImage } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
    const { images } = await parent();
    const image = findImage(images ?? {}, params.id);
    if (!image) {
        throw error(404, 'Not found');
    }

    return { image };
};
