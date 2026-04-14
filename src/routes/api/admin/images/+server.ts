import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { requireDev, getCloudflareConfig } from '$lib/server/admin-guard';
import { getDataStore } from '$lib/server/data-store';
import { uploadImage, getImageInfo } from '$lib/server/cloudflare-images';
import type { Image } from '$lib/data';

export const GET: RequestHandler = async ({ platform }) => {
    requireDev();
    const store = getDataStore(platform);
    const images = await store.readImages();
    return json({ images: Object.values(images) });
};

export const POST: RequestHandler = async ({ request, platform }) => {
    requireDev();

    const formData = await request.formData();
    const file = formData.get('file');
    const id = formData.get('id');
    const title = formData.get('title');

    if (!(file instanceof Blob) || !id || typeof id !== 'string') {
        throw error(400, 'Missing required fields: file and id');
    }

    if (file.size > 10 * 1024 * 1024) {
        throw error(413, 'File size exceeds 10MB limit');
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const imageInfo = await getImageInfo(buffer);

    const config = getCloudflareConfig();
    const result = await uploadImage(config, file, id);

    if (!result.success) {
        throw error(500, 'Failed to upload image to Cloudflare');
    }

    const format = imageInfo.format === 'png' ? ('png' as const) : ('jpeg' as const);

    const newImage: Image = {
        id,
        format,
        width: imageInfo.width,
        height: imageInfo.height,
        title: title ? String(title) : id,
    };

    const store = getDataStore(platform);
    const images = await store.readImages();
    images[id] = newImage;
    await store.writeImages(images);

    return json({ image: newImage }, { status: 201 });
};
