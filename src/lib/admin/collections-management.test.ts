import { describe, it, expect } from 'vitest';

// Integration tests for collection management logic

type CollectionKey = 'topImages' | 'topImagesWide' | 'illustrations';

interface CollectionsState {
    topImages: string[];
    topImagesWide: string[];
    illustrations: string[];
}

function getCollection(state: CollectionsState, key: CollectionKey): string[] {
    return state[key];
}

function addImage(state: CollectionsState, key: CollectionKey, id: string): CollectionsState {
    return { ...state, [key]: [...state[key], id] };
}

function removeImage(state: CollectionsState, key: CollectionKey, id: string): CollectionsState {
    return { ...state, [key]: state[key].filter((x) => x !== id) };
}

function reorderCollection(
    state: CollectionsState,
    key: CollectionKey,
    newOrder: string[],
): CollectionsState {
    return { ...state, [key]: newOrder };
}

function hasChanges(current: string[], original: string[]): boolean {
    return JSON.stringify(current) !== JSON.stringify(original);
}

describe('Collections management logic', () => {
    const initial: CollectionsState = {
        topImages: ['top/1', 'top/2', 'top/3'],
        topImagesWide: ['top/wide-1', 'top/wide-2'],
        illustrations: ['illustration/1', 'illustration/2', 'illustration/3'],
    };

    describe('addImage', () => {
        it('adds image to topImages collection', () => {
            const result = addImage(initial, 'topImages', 'top/4');
            expect(result.topImages).toEqual(['top/1', 'top/2', 'top/3', 'top/4']);
        });

        it('adds image to illustrations collection', () => {
            const result = addImage(initial, 'illustrations', 'illustration/4');
            expect(result.illustrations).toEqual([
                'illustration/1',
                'illustration/2',
                'illustration/3',
                'illustration/4',
            ]);
        });

        it('does not modify other collections', () => {
            const result = addImage(initial, 'topImages', 'top/4');
            expect(result.illustrations).toEqual(initial.illustrations);
            expect(result.topImagesWide).toEqual(initial.topImagesWide);
        });
    });

    describe('removeImage', () => {
        it('removes image from collection', () => {
            const result = removeImage(initial, 'topImages', 'top/2');
            expect(result.topImages).toEqual(['top/1', 'top/3']);
        });

        it('handles removing non-existent image', () => {
            const result = removeImage(initial, 'topImages', 'nonexistent');
            expect(result.topImages).toEqual(initial.topImages);
        });

        it('does not modify other collections', () => {
            const result = removeImage(initial, 'illustrations', 'illustration/1');
            expect(result.topImages).toEqual(initial.topImages);
        });
    });

    describe('reorderCollection', () => {
        it('applies new order to collection', () => {
            const newOrder = ['top/3', 'top/1', 'top/2'];
            const result = reorderCollection(initial, 'topImages', newOrder);
            expect(result.topImages).toEqual(newOrder);
        });

        it('does not modify other collections', () => {
            const newOrder = ['top/3', 'top/1', 'top/2'];
            const result = reorderCollection(initial, 'topImages', newOrder);
            expect(result.illustrations).toEqual(initial.illustrations);
        });
    });

    describe('hasChanges', () => {
        it('returns false for identical arrays', () => {
            expect(hasChanges(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(false);
        });

        it('returns true when order differs', () => {
            expect(hasChanges(['a', 'b', 'c'], ['c', 'b', 'a'])).toBe(true);
        });

        it('returns true when items added', () => {
            expect(hasChanges(['a', 'b', 'c', 'd'], ['a', 'b', 'c'])).toBe(true);
        });

        it('returns true when items removed', () => {
            expect(hasChanges(['a', 'b'], ['a', 'b', 'c'])).toBe(true);
        });

        it('returns false for empty arrays', () => {
            expect(hasChanges([], [])).toBe(false);
        });
    });
});
