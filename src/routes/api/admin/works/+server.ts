import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { Work, TranslatableString } from '$lib/data';
import { requireDev, parseJsonBody } from '$lib/server/admin-guard';
import { getDataStore } from '$lib/server/data-store';

export const GET: RequestHandler = async ({ platform }) => {
    requireDev();
    const store = getDataStore(platform);
    const collections = await store.readCollections();
    return json({ works: collections.works });
};

export const POST: RequestHandler = async ({ request, platform }) => {
    requireDev();
    const body = await parseJsonBody(request);

    if (!body.id || typeof body.id !== 'string') {
        throw error(400, 'Work id is required');
    }
    if (body.title === undefined || body.title === null) {
        throw error(400, 'Work title is required');
    }

    const store = getDataStore(platform);
    const collections = await store.readCollections();

    if (collections.works.some((w) => w.id === body.id)) {
        throw error(400, 'Work with this id already exists');
    }

    let images: string[] = [];
    if (body.images !== undefined) {
        if (!Array.isArray(body.images) || !body.images.every((v) => typeof v === 'string')) {
            throw error(400, 'images must be an array of strings');
        }
        images = body.images;
    }

    const newWork: Work = {
        id: body.id as string,
        title: body.title as TranslatableString,
        images,
    };
    if (body.subtitle !== undefined) {
        if (body.subtitle === null) throw error(400, 'subtitle cannot be null');
        newWork.subtitle = body.subtitle as TranslatableString;
    }
    if (body.image !== undefined) {
        if (body.image === null) throw error(400, 'image cannot be null');
        newWork.image = body.image as string;
    }

    collections.works.push(newWork);
    await store.writeCollections(collections);

    return json({ work: newWork }, { status: 201 });
};
