import { describe, it, expect } from 'vitest';
import type { ImageSet } from '$lib/data';
import { findImage } from '$lib/data';

const mockImages: ImageSet = {
    'profile': { id: 'profile', format: 'jpeg', width: 800, height: 800, title: 'Profile' },
    'drawings/1': {
        id: 'drawings/1',
        format: 'jpeg',
        width: 1200,
        height: 900,
        title: { en: 'Drawing One', ja: 'ドローイング1' },
    },
    'food/food-1': {
        id: 'food/food-1',
        format: 'png',
        width: 640,
        height: 480,
        title: 'Food Illustration',
        description: { en: 'A food illustration', ja: '食べ物のイラスト' },
    },
};

describe('findImage', () => {
    it('should find image by simple ID', () => {
        const image = findImage(mockImages, 'profile');
        expect(image).not.toBeNull();
        expect(image!.id).toBe('profile');
    });

    it('should find image by nested ID (with slash)', () => {
        const image = findImage(mockImages, 'drawings/1');
        expect(image).not.toBeNull();
        expect(image!.id).toBe('drawings/1');
        expect(image!.width).toBe(1200);
    });

    it('should return null for nonexistent image', () => {
        const image = findImage(mockImages, 'nonexistent');
        expect(image).toBeNull();
    });

    it('should return image with translatable title', () => {
        const image = findImage(mockImages, 'drawings/1');
        expect(image).not.toBeNull();
        expect(image!.title).toEqual({ en: 'Drawing One', ja: 'ドローイング1' });
    });

    it('should return image with description', () => {
        const image = findImage(mockImages, 'food/food-1');
        expect(image).not.toBeNull();
        expect(image!.description).toBeDefined();
    });

    it('should return null for empty image set', () => {
        const image = findImage({}, 'anything');
        expect(image).toBeNull();
    });
});
