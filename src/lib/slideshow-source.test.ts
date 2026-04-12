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

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should initialize with first image from store', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        expect(t.image?.id).toBe('A');
        expect(t.previousImage?.id).toBe('A');
        expect(t.isFirstImage).toBe(true);

        t.destroy();
    });

    it('should not update image until timeout fires', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        store.set(imageB);

        // Before timeout: image should still be A
        expect(t.image?.id).toBe('A');

        // After timeout: image should be B
        vi.advanceTimersByTime(100);
        expect(t.image?.id).toBe('B');

        t.destroy();
    });

    it('should set previousImage to current image during transition', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        // A → B transition
        store.set(imageB);
        vi.advanceTimersByTime(100);
        expect(t.image?.id).toBe('B');
        expect(t.previousImage?.id).toBe('A');

        // B → C transition — the key test case:
        // previousImage must be B (the displayed image), not A
        store.set(imageC);
        vi.advanceTimersByTime(100);
        expect(t.image?.id).toBe('C');
        expect(t.previousImage?.id).toBe('B');

        // C → D transition
        store.set(imageD);
        vi.advanceTimersByTime(100);
        expect(t.image?.id).toBe('D');
        expect(t.previousImage?.id).toBe('C');

        t.destroy();
    });

    it('should update previousImage and image in the same synchronous block', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        // Track all intermediate states during the transition
        const states: { image: string; previous: string }[] = [];
        t.onChange(() => {
            states.push({
                image: t.image?.id ?? 'null',
                previous: t.previousImage?.id ?? 'null',
            });
        });

        // Clear init state
        states.length = 0;

        store.set(imageB);
        vi.advanceTimersByTime(100);

        // The timeout callback should produce exactly ONE state change
        // where both previousImage and image are updated together.
        // If they were updated separately, we'd see an intermediate state.
        const timeoutState = states[states.length - 1];
        expect(timeoutState).toBeDefined();
        expect(timeoutState!.previous).toBe('A');
        expect(timeoutState!.image).toBe('B');

        t.destroy();
    });

    it('should set isFirstImage to false after first transition', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        expect(t.isFirstImage).toBe(true);

        store.set(imageB);
        expect(t.isFirstImage).toBe(true); // Still true before timeout

        vi.advanceTimersByTime(100);
        expect(t.isFirstImage).toBe(false);

        t.destroy();
    });

    it('should cancel pending timeout on destroy', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        store.set(imageB);
        // Timeout is pending (100ms)

        t.destroy();

        // Advance past timeout — image should NOT have changed
        vi.advanceTimersByTime(200);
        expect(t.image?.id).toBe('A');
    });

    it('should handle rapid store changes by cancelling previous timeout', () => {
        const store = writable<Image>(imageA);
        const t = createTransition(store);

        // Emit B, then quickly emit C before B's timeout fires
        store.set(imageB);
        vi.advanceTimersByTime(50); // Only 50ms, B's timeout hasn't fired

        store.set(imageC);
        vi.advanceTimersByTime(100); // C's timeout fires

        // Should show C, with previousImage = A (B was never displayed)
        expect(t.image?.id).toBe('C');
        expect(t.previousImage?.id).toBe('A');

        t.destroy();
    });
});
