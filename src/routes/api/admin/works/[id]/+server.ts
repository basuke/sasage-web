import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { TranslatableString } from '$lib/data';
import { requireDev, parseJsonBody } from '$lib/server/admin-guard';
import { readCollections, writeCollections } from '$lib/server/data-store';

export const PATCH: RequestHandler = async ({ params, request }) => {
    requireDev();
    const id = params.id;
    if (!id) throw error(400, 'Work ID is required');

    const collections = readCollections();
    const work = collections.works.find((w) => w.id === id);
    if (!work) throw error(404, 'Work not found');

    const body = await parseJsonBody(request);

    if (body.title !== undefined) {
        if (body.title === null) throw error(400, 'title cannot be null');
        work.title = body.title as TranslatableString;
    }
    if (body.subtitle !== undefined) {
        if (body.subtitle === null) throw error(400, 'subtitle cannot be null');
        work.subtitle = body.subtitle as TranslatableString;
    }
    if (body.image !== undefined) {
        if (body.image === null) {
            delete work.image;
        } else {
            work.image = body.image as string;
        }
    }
    if (body.images !== undefined) {
        if (!Array.isArray(body.images) || !body.images.every((v) => typeof v === 'string')) {
            throw error(400, 'images must be an array of strings');
        }
        work.images = body.images;
    }

    writeCollections(collections);
    return json({ work });
};

export const DELETE: RequestHandler = async ({ params }) => {
    requireDev();
    const id = params.id;
    if (!id) throw error(400, 'Work ID is required');

    const collections = readCollections();
    const index = collections.works.findIndex((w) => w.id === id);
    if (index === -1) throw error(404, 'Work not found');

    collections.works.splice(index, 1);
    writeCollections(collections);

    return json({ success: true });
};
