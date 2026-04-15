import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadAllData, loadImages, loadCollections } from './data-loader';
import type { ImageSet } from '../data';
import type { Collections } from './data-store';

// Mock data-store module
vi.mock('./data-store', () => {
    const mockImages: ImageSet = {
        'img-1': { id: 'img-1', format: 'jpeg', width: 800, height: 600, title: 'Image 1' },
        'img-2': { id: 'img-2', format: 'png', width: 1200, height: 800, title: 'Image 2' },
        'img-3': { id: 'img-3', format: 'jpeg', width: 640, height: 480, title: 'Image 3' },
    };

    const mockCollections: Collections = {
        topImages: ['img-1', 'img-2'],
        topImagesWide: ['img-3'],
        works: [
            {
                id: 'work-1',
                image: 'img-1',
                title: 'Work One',
                images: ['img-1', 'img-2'],
            },
        ],
        illustrations: ['img-2', 'img-3'],
    };

    const mockStore = {
        readImages: vi.fn().mockResolvedValue(mockImages),
        writeImages: vi.fn(),
        readCollections: vi.fn().mockResolvedValue(mockCollections),
        writeCollections: vi.fn(),
    };

    return {
        getDataStore: vi.fn().mockReturnValue(mockStore),
        __mockStore: mockStore,
        __mockImages: mockImages,
        __mockCollections: mockCollections,
    };
});

// Access mock internals for assertions
async function getMocks() {
    const mod = await import('./data-store');
    return mod as typeof mod & {
        __mockStore: {
            readImages: ReturnType<typeof vi.fn>;
            readCollections: ReturnType<typeof vi.fn>;
        };
        __mockImages: ImageSet;
        __mockCollections: Collections;
    };
}

describe('data-loader', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('loadAllData', () => {
        it('should load images and collections together', async () => {
            const result = await loadAllData();
            const { __mockImages, __mockCollections } = await getMocks();

            expect(result.images).toEqual(__mockImages);
            expect(result.topImages).toEqual(__mockCollections.topImages);
            expect(result.topImagesWide).toEqual(__mockCollections.topImagesWide);
            expect(result.works).toEqual(__mockCollections.works);
            expect(result.illustrations).toEqual(__mockCollections.illustrations);
        });

        it('should return correct structure with all fields', async () => {
            const result = await loadAllData();

            expect(result).toHaveProperty('images');
            expect(result).toHaveProperty('topImages');
            expect(result).toHaveProperty('topImagesWide');
            expect(result).toHaveProperty('works');
            expect(result).toHaveProperty('illustrations');
        });

        it('should pass platform to getDataStore', async () => {
            const { getDataStore } = await getMocks();
            const mockPlatform = { env: { DB: {} } } as App.Platform;

            await loadAllData(mockPlatform);

            expect(getDataStore).toHaveBeenCalledWith(mockPlatform);
        });

        it('should call readImages and readCollections', async () => {
            const { __mockStore } = await getMocks();

            await loadAllData();

            expect(__mockStore.readImages).toHaveBeenCalledOnce();
            expect(__mockStore.readCollections).toHaveBeenCalledOnce();
        });

        it('should return works with correct image associations', async () => {
            const result = await loadAllData();

            expect(result.works).toHaveLength(1);
            const work = result.works[0]!;
            expect(work.id).toBe('work-1');
            expect(work.images).toEqual(['img-1', 'img-2']);
        });
    });

    describe('loadImages', () => {
        it('should return images from data store', async () => {
            const { __mockImages } = await getMocks();
            const result = await loadImages();

            expect(result).toEqual(__mockImages);
        });

        it('should pass platform to getDataStore', async () => {
            const { getDataStore } = await getMocks();
            const mockPlatform = { env: { DB: {} } } as App.Platform;

            await loadImages(mockPlatform);

            expect(getDataStore).toHaveBeenCalledWith(mockPlatform);
        });
    });

    describe('loadCollections', () => {
        it('should return collections from data store', async () => {
            const { __mockCollections } = await getMocks();
            const result = await loadCollections();

            expect(result).toEqual(__mockCollections);
        });

        it('should pass platform to getDataStore', async () => {
            const { getDataStore } = await getMocks();
            const mockPlatform = { env: { DB: {} } } as App.Platform;

            await loadCollections(mockPlatform);

            expect(getDataStore).toHaveBeenCalledWith(mockPlatform);
        });
    });

    describe('fallback behavior', () => {
        it('should use JsonDataStore when platform has no DB', async () => {
            const { getDataStore } = await getMocks();

            await loadAllData(undefined);

            expect(getDataStore).toHaveBeenCalledWith(undefined);
        });

        it('should use D1DataStore when platform has DB', async () => {
            const { getDataStore } = await getMocks();
            const mockPlatform = { env: { DB: {} } } as App.Platform;

            await loadAllData(mockPlatform);

            expect(getDataStore).toHaveBeenCalledWith(mockPlatform);
        });
    });
});
