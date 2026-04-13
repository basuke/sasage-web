import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';
import type { ImageSet } from '$lib/data';
import type { Collections } from '$lib/server/data-store';

// Mock $app/environment
vi.mock('$app/environment', () => ({ dev: true }));

// Mock admin-guard — keep requireDev as a no-op, mock getCloudflareConfig
vi.mock('$lib/server/admin-guard', async (importOriginal) => {
    const orig = (await importOriginal()) as Record<string, unknown>;
    return {
        ...orig,
        requireDev: vi.fn(),
        getCloudflareConfig: vi.fn().mockReturnValue({
            accountId: 'test-account',
            apiToken: 'test-token',
        }),
    };
});

// Mock data-store
vi.mock('$lib/server/data-store', () => ({
    readImages: vi.fn(),
    writeImages: vi.fn(),
    readCollections: vi.fn(),
    writeCollections: vi.fn(),
}));

// Mock cloudflare-images
vi.mock('$lib/server/cloudflare-images', () => ({
    uploadImage: vi.fn(),
    deleteImage: vi.fn(),
    getImageInfo: vi.fn(),
    computeSha1: vi.fn(),
}));

import { readImages, writeImages, readCollections, writeCollections } from '$lib/server/data-store';
import {
    uploadImage,
    deleteImage as deleteCloudflareImage,
    getImageInfo,
    computeSha1,
} from '$lib/server/cloudflare-images';

// Import endpoint handlers
import {
    GET as imagesListGET,
    POST as imagesListPOST,
} from '../../routes/api/admin/images/+server';
import {
    GET as imageGET,
    PATCH as imagePATCH,
    DELETE as imageDELETE,
} from '../../routes/api/admin/images/[...id]/+server';
import {
    GET as collectionsGET,
    PATCH as collectionsPATCH,
} from '../../routes/api/admin/collections/+server';
import { GET as worksListGET, POST as worksListPOST } from '../../routes/api/admin/works/+server';
import {
    PATCH as workPATCH,
    DELETE as workDELETE,
} from '../../routes/api/admin/works/[id]/+server';

// --- Test data ---

const mockImages: ImageSet = {
    'test/image-1': {
        id: 'test/image-1',
        format: 'jpeg',
        width: 800,
        height: 600,
        title: 'Test Image 1',
    },
    'test/image-2': {
        id: 'test/image-2',
        format: 'png',
        width: 1200,
        height: 800,
        title: { en: 'Image 2', ja: '画像2' },
    },
};

const mockCollections: Collections = {
    topImages: ['test/image-1'],
    topImagesWide: [],
    works: [
        {
            id: 'work-1',
            image: 'test/image-1',
            title: 'Work 1',
            images: ['test/image-1', 'test/image-2'],
        },
    ],
    illustrations: ['test/image-2'],
};

// --- Helpers ---

function mockEvent(overrides: Partial<RequestEvent> = {}): RequestEvent {
    return {
        params: {},
        request: new Request('http://localhost'),
        url: new URL('http://localhost'),
        locals: { lang: 'en' },
        cookies: {} as RequestEvent['cookies'],
        fetch: globalThis.fetch,
        getClientAddress: () => '127.0.0.1',
        platform: {},
        route: { id: '' },
        setHeaders: vi.fn(),
        isDataRequest: false,
        isSubRequest: false,
        ...overrides,
    } as unknown as RequestEvent;
}

function jsonRequest(method: string, body: unknown): Request {
    return new Request('http://localhost', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

function testBlob(content = 'fake-image', type = 'image/jpeg'): Blob {
    const data = new TextEncoder().encode(content);
    const blob = new Blob([data], { type });
    if (typeof blob.arrayBuffer !== 'function') {
        Object.defineProperty(blob, 'arrayBuffer', {
            value: () => Promise.resolve(data.buffer),
        });
    }
    return blob;
}

function formDataRequest(fields: Record<string, string | Blob>): Request {
    const store = new Map<string, string | Blob>(Object.entries(fields));
    const fd = { get: (key: string) => store.get(key) ?? null } as unknown as FormData;
    const req = new Request('http://localhost', { method: 'POST' });
    vi.spyOn(req, 'formData').mockResolvedValue(fd);
    return req;
}

async function expectHttpError(fn: () => unknown, status: number): Promise<void> {
    try {
        await fn();
        expect.fail('Expected an error to be thrown');
    } catch (e) {
        expect(e).toHaveProperty('status', status);
    }
}

// --- Tests ---

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readImages).mockReturnValue(structuredClone(mockImages));
    vi.mocked(readCollections).mockReturnValue(structuredClone(mockCollections));
});

describe('Images API - list', () => {
    it('GET returns all images as array', async () => {
        const res = await imagesListGET(mockEvent());
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.images).toHaveLength(2);
        expect(data.images[0].id).toBe('test/image-1');
    });

    it('POST uploads a new image', async () => {
        vi.mocked(getImageInfo).mockResolvedValue({ format: 'jpeg', width: 640, height: 480 });
        vi.mocked(computeSha1).mockResolvedValue('abc123');
        vi.mocked(uploadImage).mockResolvedValue({ success: true, id: 'new/image' });

        const req = formDataRequest({
            file: testBlob('fake-image'),
            id: 'new/image',
            title: 'New Image',
        });

        const res = await imagesListPOST(mockEvent({ request: req }));
        const data = await res.json();

        expect(res.status).toBe(201);
        expect(data.image.id).toBe('new/image');
        expect(data.image.title).toBe('New Image');
        expect(data.image.format).toBe('jpeg');
        expect(writeImages).toHaveBeenCalledTimes(1);
    });

    it('POST returns 400 when file is missing', async () => {
        const req = formDataRequest({ id: 'test' });

        await expectHttpError(() => imagesListPOST(mockEvent({ request: req })), 400);
    });

    it('POST returns 413 when file is too large', async () => {
        const largeBlob = new Blob(['x'], { type: 'image/jpeg' });
        Object.defineProperty(largeBlob, 'size', { value: 11 * 1024 * 1024 });

        const req = formDataRequest({
            file: largeBlob,
            id: 'large/image',
        });

        await expectHttpError(() => imagesListPOST(mockEvent({ request: req })), 413);
    });
});

describe('Images API - single', () => {
    it('GET returns a single image', async () => {
        const res = await imageGET(mockEvent({ params: { id: 'test/image-1' } }));
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.image.id).toBe('test/image-1');
        expect(data.image.title).toBe('Test Image 1');
    });

    it('GET returns 404 for non-existent image', async () => {
        await expectHttpError(() => imageGET(mockEvent({ params: { id: 'nonexistent' } })), 404);
    });

    it('PATCH updates image metadata', async () => {
        const res = await imagePATCH(
            mockEvent({
                params: { id: 'test/image-1' },
                request: jsonRequest('PATCH', {
                    title: 'Updated Title',
                    description: 'A description',
                }),
            }),
        );
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.image.title).toBe('Updated Title');
        expect(data.image.description).toBe('A description');
        expect(writeImages).toHaveBeenCalledTimes(1);
    });

    it('PATCH returns 404 for non-existent image', async () => {
        await expectHttpError(
            () =>
                imagePATCH(
                    mockEvent({
                        params: { id: 'nonexistent' },
                        request: jsonRequest('PATCH', { title: 'X' }),
                    }),
                ),
            404,
        );
    });

    it('DELETE removes image from Cloudflare, images.json, and collections', async () => {
        vi.mocked(deleteCloudflareImage).mockResolvedValue(true);

        const res = await imageDELETE(mockEvent({ params: { id: 'test/image-1' } }));
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(deleteCloudflareImage).toHaveBeenCalledWith(
            { accountId: 'test-account', apiToken: 'test-token' },
            'test/image-1',
        );
        expect(writeImages).toHaveBeenCalledTimes(1);

        // Verify collections were cleaned up
        const writtenCollections = vi.mocked(writeCollections).mock.calls[0]![0];
        expect(writtenCollections.topImages).toEqual([]);
        expect(writtenCollections.works[0]!.images).toEqual(['test/image-2']);
        expect(writtenCollections.works[0]!.image).toBeUndefined();
    });

    it('DELETE returns 404 for non-existent image', async () => {
        await expectHttpError(() => imageDELETE(mockEvent({ params: { id: 'nonexistent' } })), 404);
    });
});

describe('Collections API', () => {
    it('GET returns all collections', async () => {
        const res = await collectionsGET(mockEvent());
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.collections.topImages).toEqual(['test/image-1']);
        expect(data.collections.works).toHaveLength(1);
        expect(data.collections.illustrations).toEqual(['test/image-2']);
    });

    it('PATCH updates collection image lists', async () => {
        const res = await collectionsPATCH(
            mockEvent({
                request: jsonRequest('PATCH', {
                    topImages: ['img-a', 'img-b'],
                    illustrations: ['img-c'],
                }),
            }),
        );
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.collections.topImages).toEqual(['img-a', 'img-b']);
        expect(data.collections.illustrations).toEqual(['img-c']);
        expect(writeCollections).toHaveBeenCalledTimes(1);
    });

    it('PATCH returns 400 for invalid field type', async () => {
        await expectHttpError(
            () =>
                collectionsPATCH(
                    mockEvent({
                        request: jsonRequest('PATCH', { topImages: 'not-an-array' }),
                    }),
                ),
            400,
        );
    });

    it('PATCH returns 400 for invalid JSON', async () => {
        await expectHttpError(
            () =>
                collectionsPATCH(
                    mockEvent({
                        request: new Request('http://localhost', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: 'not json',
                        }),
                    }),
                ),
            400,
        );
    });
});

describe('Works API - list', () => {
    it('GET returns all works', async () => {
        const res = await worksListGET(mockEvent());
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.works).toHaveLength(1);
        expect(data.works[0].id).toBe('work-1');
    });

    it('POST creates a new work', async () => {
        const res = await worksListPOST(
            mockEvent({
                request: jsonRequest('POST', {
                    id: 'new-work',
                    title: { en: 'New Work', ja: '新作品' },
                    images: ['img-1', 'img-2'],
                    image: 'img-1',
                }),
            }),
        );
        const data = await res.json();
        expect(res.status).toBe(201);
        expect(data.work.id).toBe('new-work');
        expect(data.work.title.en).toBe('New Work');
        expect(data.work.images).toEqual(['img-1', 'img-2']);
        expect(writeCollections).toHaveBeenCalledTimes(1);
    });

    it('POST returns 400 when id is missing', async () => {
        await expectHttpError(
            () => worksListPOST(mockEvent({ request: jsonRequest('POST', { title: 'No ID' }) })),
            400,
        );
    });

    it('POST returns 400 for duplicate id', async () => {
        await expectHttpError(
            () =>
                worksListPOST(
                    mockEvent({
                        request: jsonRequest('POST', { id: 'work-1', title: 'Dup' }),
                    }),
                ),
            400,
        );
    });
});

describe('Works API - single', () => {
    it('PATCH updates a work', async () => {
        const res = await workPATCH(
            mockEvent({
                params: { id: 'work-1' },
                request: jsonRequest('PATCH', {
                    title: 'Updated Work',
                    images: ['img-new'],
                }),
            }),
        );
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.work.title).toBe('Updated Work');
        expect(data.work.images).toEqual(['img-new']);
        expect(writeCollections).toHaveBeenCalledTimes(1);
    });

    it('PATCH returns 404 for non-existent work', async () => {
        await expectHttpError(
            () =>
                workPATCH(
                    mockEvent({
                        params: { id: 'nonexistent' },
                        request: jsonRequest('PATCH', { title: 'X' }),
                    }),
                ),
            404,
        );
    });

    it('DELETE removes a work', async () => {
        const res = await workDELETE(mockEvent({ params: { id: 'work-1' } }));
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.success).toBe(true);

        const writtenCollections = vi.mocked(writeCollections).mock.calls[0]![0];
        expect(writtenCollections.works).toHaveLength(0);
    });

    it('DELETE returns 404 for non-existent work', async () => {
        await expectHttpError(() => workDELETE(mockEvent({ params: { id: 'nonexistent' } })), 404);
    });
});
