import { error } from '@sveltejs/kit';
import { data, findImage } from '$lib/data';

/** @type {import('./$types').PageLoad} */
export async function load({ params }: { params: { id: string } }) {
    const image = findImage(data.images, params.id);
    if (!image) {
        throw error(404, 'Not found');
    }

    return { image };
}
