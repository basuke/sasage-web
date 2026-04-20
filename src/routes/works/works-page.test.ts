import { describe, it, expect } from 'vitest';
import type { Work } from '$lib/data';

// Test findWork utility used by the works page server load

import { findWork } from '$lib/data';

const mockWorks: Work[] = [
    {
        id: 'zine-2023',
        image: 'zine-2023/cover',
        title: 'Seven Classic Cat Antics',
        images: ['zine-2023/1', 'zine-2023/2'],
    },
    {
        id: 'lost-in-rain',
        image: 'lost/cover',
        title: { en: 'Lost in the Rain', ja: '雨に降られて' },
        images: ['lost/1', 'lost/2', 'lost/3'],
    },
];

describe('findWork', () => {
    it('should find work by ID', () => {
        const work = findWork(mockWorks, 'zine-2023');
        expect(work).toBeDefined();
        expect(work!.id).toBe('zine-2023');
        expect(work!.images).toEqual(['zine-2023/1', 'zine-2023/2']);
    });

    it('should return undefined for nonexistent work', () => {
        const work = findWork(mockWorks, 'nonexistent');
        expect(work).toBeUndefined();
    });

    it('should find work with translatable title', () => {
        const work = findWork(mockWorks, 'lost-in-rain');
        expect(work).toBeDefined();
        expect(work!.title).toEqual({ en: 'Lost in the Rain', ja: '雨に降られて' });
    });

    it('should return work images for the detail page', () => {
        const work = findWork(mockWorks, 'lost-in-rain');
        expect(work).toBeDefined();
        const workImages = work!.images ?? [];
        expect(workImages).toHaveLength(3);
    });

    it('should handle work with no images', () => {
        const worksWithEmpty: Work[] = [{ id: 'empty-work', title: 'Empty', images: [] }];
        const work = findWork(worksWithEmpty, 'empty-work');
        expect(work).toBeDefined();
        expect(work!.images).toEqual([]);
    });
});
