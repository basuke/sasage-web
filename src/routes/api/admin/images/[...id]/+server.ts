import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { TranslatableString } from '$lib/data';
import { requireDev, getCloudflareConfig, parseJsonBody } from '$lib/server/admin-guard';
import { readImages, writeImages, readCollections, writeCollections } from '$lib/server/data-store';
import { deleteImage as deleteCloudflareImage } from '$lib/server/cloudflare-images';

export const GET: RequestHandler = async ({ params }) => {
    requireDev();
    const id = params.id;
    if (!id) throw error(400, 'Image ID is required');

    const images = readImages();
    const image = images[id];
    if (!image) throw error(404, 'Image not found');

    return json({ image });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
    requireDev();
    const id = params.id;
    if (!id) throw error(400, 'Image ID is required');

    const images = readImages();
    const image = images[id];
    if (!image) throw error(404, 'Image not found');

    const body = await parseJsonBody(request);

    if (body.title !== undefined) {
        if (body.title === null) throw error(400, 'title cannot be null');
        image.title = body.title as TranslatableString;
    }
    if (body.description !== undefined) {
        if (body.description === null) throw error(400, 'description cannot be null');
        image.description = body.description as TranslatableString;
    }

    images[id] = image;
    writeImages(images);

    return json({ image });
};

export const DELETE: RequestHandler = async ({ params }) => {
    requireDev();
    const id = params.id;
    if (!id) throw error(400, 'Image ID is required');

    const images = readImages();
    if (!images[id]) throw error(404, 'Image not found');

    const config = getCloudflareConfig();
    const deleted = await deleteCloudflareImage(config, id);
    if (!deleted) {
        throw error(502, 'Failed to delete image from Cloudflare');
    }

    delete images[id];
    writeImages(images);

    const collections = readCollections();
    collections.topImages = collections.topImages.filter((imgId) => imgId !== id);
    collections.topImagesWide = collections.topImagesWide.filter((imgId) => imgId !== id);
    collections.illustrations = collections.illustrations.filter((imgId) => imgId !== id);
    for (const work of collections.works) {
        work.images = work.images.filter((imgId) => imgId !== id);
        if (work.image === id) {
            delete work.image;
        }
    }
    writeCollections(collections);

    return json({ success: true });
};
