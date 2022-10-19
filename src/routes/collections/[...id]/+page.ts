import { error } from '@sveltejs/kit';
import { data, findCollection } from '$lib/data';

export function load({ params }: { params: { id: string } }) {
    const collection = findCollection(data.collections, params.id);
    if (!collection) {
        throw error(404, 'Not found');
    }

    return {
        collection,
        images: collection.images ?? [],
    };
}
