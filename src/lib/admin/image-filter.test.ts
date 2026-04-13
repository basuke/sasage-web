import { describe, it, expect } from 'vitest';
import type { Image } from '$lib/data';
import {
    filterImages,
    extractPrefixes,
    buildImageUsageMap,
    type Collections,
} from './image-filter';

const mockImages: Image[] = [
    { id: 'illustration/1', format: 'jpeg', width: 800, height: 600, title: 'Illustration 1' },
    { id: 'illustration/2', format: 'png', width: 1200, height: 800, title: 'Illustration 2' },
    { id: 'top/1', format: 'jpeg', width: 1920, height: 1080, title: 'Top 1' },
    { id: 'top/wide-1', format: 'jpeg', width: 1920, height: 960, title: 'Top Wide 1' },
    { id: 'profile', format: 'jpeg', width: 3807, height: 2538, title: 'Profile' },
    {
        id: 'books/lost-in-the-rain/cover',
        format: 'jpeg',
        width: 800,
        height: 1200,
        title: 'Book Cover',
    },
];

describe('filterImages', () => {
    it('returns all images when query is empty', () => {
        expect(filterImages(mockImages, '')).toEqual(mockImages);
    });

    it('filters by ID substring', () => {
        const result = filterImages(mockImages, 'illustration');
        expect(result).toHaveLength(2);
        expect(result[0]!.id).toBe('illustration/1');
        expect(result[1]!.id).toBe('illustration/2');
    });

    it('filters case-insensitively', () => {
        const result = filterImages(mockImages, 'ILLUSTRATION');
        expect(result).toHaveLength(2);
    });

    it('filters by prefix with slash', () => {
        const result = filterImages(mockImages, 'top/');
        expect(result).toHaveLength(2);
    });

    it('returns empty array when nothing matches', () => {
        expect(filterImages(mockImages, 'nonexistent')).toEqual([]);
    });
});

describe('extractPrefixes', () => {
    it('extracts unique sorted prefixes', () => {
        const prefixes = extractPrefixes(mockImages);
        expect(prefixes).toEqual(['(root)', 'books', 'illustration', 'top']);
    });

    it('returns (root) for images without a slash', () => {
        const images: Image[] = [
            { id: 'profile', format: 'jpeg', width: 100, height: 100, title: 'Profile' },
        ];
        expect(extractPrefixes(images)).toEqual(['(root)']);
    });

    it('returns empty array for empty input', () => {
        expect(extractPrefixes([])).toEqual([]);
    });
});

describe('buildImageUsageMap', () => {
    const collections: Collections = {
        topImages: ['top/1'],
        topImagesWide: ['top/wide-1'],
        illustrations: ['illustration/1', 'illustration/2'],
        works: [
            {
                id: 'lost-in-the-rain',
                image: 'books/lost-in-the-rain/cover',
                title: 'LOST IN THE RAIN',
                images: ['books/lost-in-the-rain/cover', 'books/lost-in-the-rain/page1'],
            },
        ],
    };

    it('maps images to their collection usages', () => {
        const map = buildImageUsageMap(collections);

        expect(map.get('top/1')).toEqual([{ label: 'topImages', href: '/admin/collections' }]);

        expect(map.get('top/wide-1')).toEqual([
            { label: 'topImagesWide', href: '/admin/collections' },
        ]);

        expect(map.get('illustration/1')).toEqual([
            { label: 'illustrations', href: '/admin/collections' },
        ]);
    });

    it('maps images used in works with correct links', () => {
        const map = buildImageUsageMap(collections);
        const coverUsages = map.get('books/lost-in-the-rain/cover');

        expect(coverUsages).toBeDefined();
        expect(coverUsages).toContainEqual({ label: 'lost-in-the-rain', href: '/admin/works' });
    });

    it('returns undefined for unused images', () => {
        const map = buildImageUsageMap(collections);
        expect(map.get('profile')).toBeUndefined();
    });

    it('accumulates multiple usages for the same image', () => {
        const map = buildImageUsageMap(collections);
        const coverUsages = map.get('books/lost-in-the-rain/cover');

        // Used as work.image AND in work.images
        expect(coverUsages!.length).toBeGreaterThanOrEqual(2);
    });
});
