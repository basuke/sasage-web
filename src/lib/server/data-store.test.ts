import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'fs';
import { JsonDataStore, toTranslatable, fromTranslatable } from './data-store';
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

describe('JsonDataStore', () => {
    const store = new JsonDataStore();

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('readImages should read and parse images.json', async () => {
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockImages));
        const result = await store.readImages();
        expect(result['test/image-1']?.id).toBe('test/image-1');
        expect(result['test/image-2']?.format).toBe('png');
    });

    it('writeImages should write images as formatted JSON', async () => {
        await store.writeImages(mockImages);
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
        const [, content] = vi.mocked(fs.writeFileSync).mock.calls[0]!;
        const parsed = JSON.parse(content as string);
        expect(parsed['test/image-1'].id).toBe('test/image-1');
    });

    it('readCollections should read and parse collections.json', async () => {
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockCollections));
        const result = await store.readCollections();
        expect(result.topImages).toEqual(['top/1', 'top/2']);
        expect(result.works).toHaveLength(1);
        expect(result.illustrations).toHaveLength(2);
    });

    it('writeCollections should write collections as formatted JSON', async () => {
        await store.writeCollections(mockCollections);
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
        const [, content] = vi.mocked(fs.writeFileSync).mock.calls[0]!;
        const parsed = JSON.parse(content as string);
        expect(parsed.topImages).toEqual(['top/1', 'top/2']);
        expect(parsed.works[0].id).toBe('work-1');
    });
});

describe('toTranslatable', () => {
    it('returns plain string when only text is provided', () => {
        expect(toTranslatable('Hello', null)).toBe('Hello');
    });

    it('returns bilingual object when text_ja is provided', () => {
        expect(toTranslatable('Hello', 'こんにちは')).toEqual({
            en: 'Hello',
            ja: 'こんにちは',
        });
    });

    it('returns empty string when both are null', () => {
        expect(toTranslatable(null, null)).toBe('');
    });

    it('handles null text with non-null text_ja', () => {
        const result = toTranslatable(null, '日本語');
        expect(result).toEqual({ ja: '日本語' });
        expect(result).not.toHaveProperty('en');
    });

    it('handles empty strings', () => {
        expect(toTranslatable('', null)).toBe('');
    });
});

describe('fromTranslatable', () => {
    it('converts plain string to text fields', () => {
        expect(fromTranslatable('Hello')).toEqual({ text: 'Hello', text_ja: null });
    });

    it('converts bilingual object to text fields', () => {
        expect(fromTranslatable({ en: 'Hello', ja: 'こんにちは' })).toEqual({
            text: 'Hello',
            text_ja: 'こんにちは',
        });
    });

    it('handles partial bilingual object (en only)', () => {
        expect(fromTranslatable({ en: 'English only' })).toEqual({
            text: 'English only',
            text_ja: null,
        });
    });

    it('handles partial bilingual object (ja only)', () => {
        expect(fromTranslatable({ ja: '日本語のみ' })).toEqual({
            text: null,
            text_ja: '日本語のみ',
        });
    });

    it('handles empty string', () => {
        expect(fromTranslatable('')).toEqual({ text: '', text_ja: null });
    });

    it('handles empty object', () => {
        expect(fromTranslatable({})).toEqual({ text: null, text_ja: null });
    });
});

describe('TranslatableString round-trip', () => {
    it('plain string survives round-trip', () => {
        const original = 'Hello World';
        const { text, text_ja } = fromTranslatable(original);
        const result = toTranslatable(text, text_ja);
        expect(result).toBe(original);
    });

    it('bilingual object survives round-trip', () => {
        const original = { en: 'Hello', ja: 'こんにちは' };
        const { text, text_ja } = fromTranslatable(original);
        const result = toTranslatable(text, text_ja);
        expect(result).toEqual(original);
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
