import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { requireDev, parseJsonBody } from '$lib/server/admin-guard';
import { getDataStore } from '$lib/server/data-store';

export const GET: RequestHandler = async ({ platform }) => {
    requireDev();
    const store = getDataStore(platform);
    const collections = await store.readCollections();
    return json({ collections });
};

export const PATCH: RequestHandler = async ({ request, platform }) => {
    requireDev();
    const body = await parseJsonBody(request);
    const store = getDataStore(platform);
    const collections = await store.readCollections();

    if (body.topImages !== undefined) {
        if (!Array.isArray(body.topImages)) throw error(400, 'topImages must be an array');
        collections.topImages = body.topImages as string[];
    }
    if (body.topImagesWide !== undefined) {
        if (!Array.isArray(body.topImagesWide)) throw error(400, 'topImagesWide must be an array');
        collections.topImagesWide = body.topImagesWide as string[];
    }
    if (body.illustrations !== undefined) {
        if (!Array.isArray(body.illustrations)) throw error(400, 'illustrations must be an array');
        collections.illustrations = body.illustrations as string[];
    }

    await store.writeCollections(collections);
    return json({ collections });
};
