import { error } from '@sveltejs/kit';
import { data, findWork } from '$lib/data';

export function load({ params }: { params: { id: string } }) {
    const work = findWork(data.works, params.id);
    if (!work) {
        throw error(404, 'Not found');
    }

    return {
        work,
        images: work.images ?? [],
    };
}
