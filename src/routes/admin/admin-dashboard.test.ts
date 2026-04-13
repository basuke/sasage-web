import { describe, it, expect } from 'vitest';
import type { Image, Work } from '$lib/data';

function computeStats(images: Image[], works: Work[], illustrationCount: number) {
    return [
        { label: 'Total Images', value: images.length, href: '/admin/images' },
        { label: 'Works', value: works.length, href: '/admin/works' },
        { label: 'Illustrations', value: illustrationCount, href: '/admin/collections' },
    ];
}

describe('Dashboard stats computation', () => {
    const mockImages: Image[] = [
        { id: 'img-1', format: 'jpeg', width: 800, height: 600, title: 'Image 1' },
        { id: 'img-2', format: 'png', width: 1200, height: 800, title: 'Image 2' },
        { id: 'img-3', format: 'jpeg', width: 640, height: 480, title: 'Image 3' },
    ];

    const mockWorks: Work[] = [
        { id: 'work-1', title: 'Work 1', images: ['img-1'] },
        { id: 'work-2', title: 'Work 2', images: ['img-2', 'img-3'] },
    ];

    it('computes correct counts', () => {
        const stats = computeStats(mockImages, mockWorks, 5);

        expect(stats[0]!.label).toBe('Total Images');
        expect(stats[0]!.value).toBe(3);
        expect(stats[1]!.label).toBe('Works');
        expect(stats[1]!.value).toBe(2);
        expect(stats[2]!.label).toBe('Illustrations');
        expect(stats[2]!.value).toBe(5);
    });

    it('handles empty data', () => {
        const stats = computeStats([], [], 0);

        expect(stats[0]!.value).toBe(0);
        expect(stats[1]!.value).toBe(0);
        expect(stats[2]!.value).toBe(0);
    });

    it('includes correct navigation links', () => {
        const stats = computeStats(mockImages, mockWorks, 5);

        expect(stats[0]!.href).toBe('/admin/images');
        expect(stats[1]!.href).toBe('/admin/works');
        expect(stats[2]!.href).toBe('/admin/collections');
    });
});
