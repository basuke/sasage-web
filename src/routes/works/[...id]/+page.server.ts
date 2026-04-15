import { error } from '@sveltejs/kit';
import { findWork } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
    const { works } = await parent();
    const work = findWork(works ?? [], params.id);
    if (!work) {
        throw error(404, 'Not found');
    }

    return {
        work,
        workImages: work.images ?? [],
    };
};
