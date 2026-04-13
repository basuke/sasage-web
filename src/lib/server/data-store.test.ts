import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import { readImages, writeImages, readCollections, writeCollections } from './data-store';
import type { Collections } from './data-store';
import type { ImageSet } from '../data';

vi.mock('fs');

const mockImages: ImageSet = {
    'test/image-1': {
        id: 'test/image-1',
        format: 'jpeg',
        width: 800,
        height: 600,
        title: 'Test Image',
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
    topImages: ['top/1', 'top/2'],
    topImagesWide: ['top/wide-1'],
    works: [
        {
            id: 'work-1',
            image: 'work-1/cover',
            title: 'Work 1',
            images: ['work-1/1', 'work-1/2'],
        },
    ],
    illustrations: ['illustration/1', 'illustration/2'],
};

describe('readImages', () => {
    beforeEach(() => {
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockImages));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should read and parse images.json', () => {
        const result = readImages();
        expect(result['test/image-1']?.id).toBe('test/image-1');
        expect(result['test/image-2']?.format).toBe('png');
    });
});

describe('writeImages', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should write images as formatted JSON', () => {
        writeImages(mockImages);
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
        const [, content] = vi.mocked(fs.writeFileSync).mock.calls[0]!;
        const parsed = JSON.parse(content as string);
        expect(parsed['test/image-1'].id).toBe('test/image-1');
    });
});

describe('readCollections', () => {
    beforeEach(() => {
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockCollections));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should read and parse collections.json', () => {
        const result = readCollections();
        expect(result.topImages).toEqual(['top/1', 'top/2']);
        expect(result.works).toHaveLength(1);
        expect(result.illustrations).toHaveLength(2);
    });
});

describe('writeCollections', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should write collections as formatted JSON', () => {
        writeCollections(mockCollections);
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
        const [, content] = vi.mocked(fs.writeFileSync).mock.calls[0]!;
        const parsed = JSON.parse(content as string);
        expect(parsed.topImages).toEqual(['top/1', 'top/2']);
        expect(parsed.works[0].id).toBe('work-1');
    });
});

describe('collections-images consistency', () => {
    it('should have all collection image IDs present in images', async () => {
        // Read the actual files from the project
        const imagesRaw = (await import('../../../src/images.json')).default;
        const collectionsRaw = (await import('../../../src/collections.json')).default;

        const imageIds = new Set(Object.keys(imagesRaw));

        // Check topImages
        for (const id of collectionsRaw.topImages) {
            expect(imageIds.has(id), `topImages: "${id}" not found in images.json`).toBe(true);
        }

        // Check topImagesWide
        for (const id of collectionsRaw.topImagesWide) {
            expect(imageIds.has(id), `topImagesWide: "${id}" not found in images.json`).toBe(true);
        }

        // Check illustrations
        for (const id of collectionsRaw.illustrations) {
            expect(imageIds.has(id), `illustrations: "${id}" not found in images.json`).toBe(true);
        }

        // Check works images
        for (const work of collectionsRaw.works) {
            if (work.image) {
                expect(
                    imageIds.has(work.image),
                    `work "${work.id}" cover: "${work.image}" not found in images.json`,
                ).toBe(true);
            }
            for (const imgId of work.images) {
                expect(
                    imageIds.has(imgId),
                    `work "${work.id}": "${imgId}" not found in images.json`,
                ).toBe(true);
            }
        }
    });
});
