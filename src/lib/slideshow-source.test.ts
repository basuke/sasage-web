import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get, writable } from 'svelte/store';
import { source, createTransition } from './slideshow-source';
import type { Image } from './data';

// Mock the data module
vi.mock('./data', () => ({
    data: {
        images: {
            image1: { id: 'image1', format: 'jpeg', width: 800, height: 600, title: 'Image 1' },
            image2: { id: 'image2', format: 'jpeg', width: 800, height: 600, title: 'Image 2' },
            image3: { id: 'image3', format: 'jpeg', width: 800, height: 600, title: 'Image 3' },
        },
    },
    findImage: vi.fn((images, id) => images[id] || null),
    imagePath: vi.fn((id, variant = 'public') => `https://imagedelivery.net/hash/${id}/${variant}`),
}));

describe('Slideshow Source', () => {
    beforeEach(() => {
        vi.useFakeTimers();

        // Mock document for preloading tests
        global.document = {
            createElement: vi.fn().mockReturnValue({
                rel: '',
                as: '',
                href: '',
            }),
            head: {
                appendChild: vi.fn(),
            },
        } as any;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should throw error for less than 2 images', () => {
        expect(() => source(['image1'], 1000)).toThrow(
            'More than two valid image ids are required',
        );
    });

    it('should throw error for empty array', () => {
        expect(() => source([], 1000)).toThrow('More than two valid image ids are required');
    });

    it('should start with first image', () => {
        const store = source(['image1', 'image2', 'image3'], 1000);
        const currentImage = get(store);

        expect(currentImage.id).toBe('image1');
    });

    it('should cycle through images on interval', () => {
        const store = source(['image1', 'image2', 'image3'], 1000);
        let currentImage: any;

        // Subscribe to activate the store
        const unsubscribe = store.subscribe((image) => {
            currentImage = image;
        });

        // Initial image
        expect(currentImage.id).toBe('image1');

        // After first interval
        vi.advanceTimersByTime(1000);
        expect(currentImage.id).toBe('image2');

        // After second interval
        vi.advanceTimersByTime(1000);
        expect(currentImage.id).toBe('image3');

        // Should cycle back to first
        vi.advanceTimersByTime(1000);
        expect(currentImage.id).toBe('image1');

        unsubscribe();
    });

    it('should preload next image on initialization', () => {
        const store = source(['image1', 'image2', 'image3'], 1000);
        const unsubscribe = store.subscribe(() => {}); // Activate the store

        // Should preload image2 (next after image1)
        expect(document.createElement).toHaveBeenCalledWith('link');
        expect(document.head.appendChild).toHaveBeenCalled();

        unsubscribe();
    });

    it('should preload next image on each cycle', () => {
        const store = source(['image1', 'image2', 'image3'], 1000);
        const unsubscribe = store.subscribe(() => {}); // Activate the store

        // Clear initial calls
        vi.clearAllMocks();

        // Advance to trigger next image
        vi.advanceTimersByTime(1000);

        // Should preload image3 (next after image2)
        expect(document.createElement).toHaveBeenCalledWith('link');
        expect(document.head.appendChild).toHaveBeenCalled();

        unsubscribe();
    });

    it('should filter out invalid images', async () => {
        // Mock findImage to return null for 'invalid'
        const { findImage } = vi.mocked(await import('./data'));
        findImage.mockImplementation((images, id) =>
            id === 'invalid' ? null : images[id] || null,
        );

        const store = source(['image1', 'invalid', 'image2'], 1000);
        let currentImage: any;

        const unsubscribe = store.subscribe((image) => {
            currentImage = image;
        });

        // Should start with image1
        expect(currentImage.id).toBe('image1');

        // Should skip invalid and go to image2
        vi.advanceTimersByTime(1000);
        expect(currentImage.id).toBe('image2');

        // Should cycle back to image1
        vi.advanceTimersByTime(1000);
        expect(currentImage.id).toBe('image1');

        unsubscribe();
    });

    it('should cleanup interval on unsubscribe', () => {
        const store = source(['image1', 'image2'], 1000);
        const unsubscribe = store.subscribe(() => {});

        // Verify timer is running
        vi.advanceTimersByTime(1000);
        expect(get(store).id).toBe('image2');

        // Unsubscribe should stop the timer
        unsubscribe();

        // Timer should not advance anymore
        vi.advanceTimersByTime(1000);
        expect(get(store).id).toBe('image2'); // Should stay the same
    });
});

describe('createTransition', () => {
    const imageA: Image = { id: 'A', format: 'jpeg', width: 800, height: 600, title: 'A' };
    const imageB: Image = { id: 'B', format: 'jpeg', width: 800, height: 600, title: 'B' };
    const imageC: Image = { id: 'C', format: 'jpeg', width: 800, height: 600, title: 'C' };
    const imageD: Image = { id: 'D', format: 'jpeg', width: 800, height: 600, title: 'D' };

    it('should initialize both layers with first image', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        expect(t.imageA?.id).toBe('A');
        expect(t.imageB?.id).toBe('A');
        expect(t.activeLayer).toBe('a');
        expect(t.isFirstImage).toBe(true);

        t.destroy();
    });

    it('should place new image in inactive layer and switch active', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        // A → B: layer B gets new image, becomes active
        store.set(imageB);
        expect(t.imageA?.id).toBe('A');
        expect(t.imageB?.id).toBe('B');
        expect(t.activeLayer).toBe('b');

        // B → C: layer A gets new image, becomes active
        store.set(imageC);
        expect(t.imageA?.id).toBe('C');
        expect(t.imageB?.id).toBe('B');
        expect(t.activeLayer).toBe('a');

        t.destroy();
    });

    it('should always show current image in active layer (current getter)', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        expect(t.current?.id).toBe('A');

        store.set(imageB);
        expect(t.current?.id).toBe('B');

        store.set(imageC);
        expect(t.current?.id).toBe('C');

        store.set(imageD);
        expect(t.current?.id).toBe('D');

        t.destroy();
    });

    it('should keep previous image in inactive layer for crossfade', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        // Initially both layers show A
        expect(t.previous?.id).toBe('A');

        // A → B: previous (inactive) still shows A while B fades in
        store.set(imageB);
        expect(t.previous?.id).toBe('A');

        // B → C: previous shows B while C fades in
        store.set(imageC);
        expect(t.previous?.id).toBe('B');

        // C → D: previous shows C while D fades in
        store.set(imageD);
        expect(t.previous?.id).toBe('C');

        t.destroy();
    });

    it('should update immediately with no setTimeout delay', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        store.set(imageB);

        // Should be updated immediately — no timer needed
        expect(t.current?.id).toBe('B');
        expect(t.activeLayer).toBe('b');

        t.destroy();
    });

    it('should set isFirstImage to false after first transition', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        expect(t.isFirstImage).toBe(true);

        store.set(imageB);
        expect(t.isFirstImage).toBe(false);

        t.destroy();
    });

    it('should notify listener on every state change', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        const calls: string[] = [];
        t.onChange(() => calls.push(t.current?.id ?? 'null'));

        // Clear the initial call
        calls.length = 0;

        store.set(imageB);
        store.set(imageC);

        expect(calls).toEqual(['B', 'C']);

        t.destroy();
    });
});
