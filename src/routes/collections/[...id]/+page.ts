import { error } from '@sveltejs/kit';
import { data, findCollection } from '../../../data';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    const collection = findCollection(data.collections, params.id);
    if (!collection) {
        throw error(404, 'Not found');
    }

    return {
        collection,
        images: collection.images ?? [],
    };
}
