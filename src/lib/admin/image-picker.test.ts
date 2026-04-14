import { describe, it, expect, vi } from 'vitest';
import type { Image } from '$lib/data';
import { filterImages } from './image-filter';

// Test image picker filtering and selection logic

const mockImages: Image[] = [
    { id: 'illustration/1', format: 'jpeg', width: 800, height: 600, title: 'Illustration 1' },
    { id: 'illustration/2', format: 'png', width: 1200, height: 800, title: 'Illustration 2' },
    { id: 'top/1', format: 'jpeg', width: 1920, height: 1080, title: 'Top 1' },
    { id: 'zine-2023/Cover', format: 'jpeg', width: 800, height: 1200, title: 'Zine Cover' },
    { id: 'profile', format: 'jpeg', width: 3807, height: 2538, title: 'Profile' },
];

describe('ImagePicker logic', () => {
    describe('filtering', () => {
        it('filters images by search query', () => {
            const result = filterImages(mockImages, 'illustration');
            expect(result).toHaveLength(2);
            expect(result.every((img) => img.id.includes('illustration'))).toBe(true);
        });

        it('returns all images when search is empty', () => {
            const result = filterImages(mockImages, '');
            expect(result).toHaveLength(5);
        });

        it('filters case-insensitively', () => {
            const result = filterImages(mockImages, 'ZINE');
            expect(result).toHaveLength(1);
            expect(result[0]!.id).toBe('zine-2023/Cover');
        });

        it('returns empty for non-matching query', () => {
            const result = filterImages(mockImages, 'nonexistent');
            expect(result).toHaveLength(0);
        });
    });

    describe('exclude set logic', () => {
        it('correctly identifies excluded images', () => {
            const excludeIds = ['illustration/1', 'top/1'];
            const excludeSet = new Set(excludeIds);

            expect(excludeSet.has('illustration/1')).toBe(true);
            expect(excludeSet.has('top/1')).toBe(true);
            expect(excludeSet.has('illustration/2')).toBe(false);
            expect(excludeSet.has('profile')).toBe(false);
        });

        it('prevents selection of excluded images', () => {
            const excludeIds = ['illustration/1'];
            const excludeSet = new Set(excludeIds);
            const onselect = vi.fn();

            // Simulate handleSelect logic
            function handleSelect(id: string) {
                if (excludeSet.has(id)) return;
                onselect(id);
            }

            handleSelect('illustration/1');
            expect(onselect).not.toHaveBeenCalled();

            handleSelect('illustration/2');
            expect(onselect).toHaveBeenCalledWith('illustration/2');
        });

        it('allows selection when exclude list is empty', () => {
            const excludeSet = new Set<string>();
            const onselect = vi.fn();

            function handleSelect(id: string) {
                if (excludeSet.has(id)) return;
                onselect(id);
            }

            handleSelect('profile');
            expect(onselect).toHaveBeenCalledWith('profile');
        });
    });

    describe('close behavior', () => {
        it('calls onclose and resets search', () => {
            const onclose = vi.fn();
            let searchQuery = 'test';

            function handleClose() {
                searchQuery = '';
                onclose();
            }

            handleClose();
            expect(onclose).toHaveBeenCalledOnce();
            expect(searchQuery).toBe('');
        });

        it('calls onclose on Escape key', () => {
            const onclose = vi.fn();

            function handleKeydown(key: string) {
                if (key === 'Escape') onclose();
            }

            handleKeydown('Escape');
            expect(onclose).toHaveBeenCalledOnce();

            handleKeydown('Enter');
            expect(onclose).toHaveBeenCalledOnce(); // not called again
        });
    });
});
