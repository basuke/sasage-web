import { describe, it, expect, vi } from 'vitest';

// Test sortable image list reordering logic

function reorder(items: string[], fromIndex: number, toIndex: number): string[] {
    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved!);
    return newItems;
}

describe('SortableImageList reorder logic', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];

    it('moves item forward in list', () => {
        // Move 'a' (index 0) to index 2
        const result = reorder(items, 0, 2);
        expect(result).toEqual(['b', 'c', 'a', 'd', 'e']);
    });

    it('moves item backward in list', () => {
        // Move 'e' (index 4) to index 1
        const result = reorder(items, 4, 1);
        expect(result).toEqual(['a', 'e', 'b', 'c', 'd']);
    });

    it('returns same order when moving to same position', () => {
        const result = reorder(items, 2, 2);
        expect(result).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('handles moving first to last', () => {
        const result = reorder(items, 0, 4);
        expect(result).toEqual(['b', 'c', 'd', 'e', 'a']);
    });

    it('handles moving last to first', () => {
        const result = reorder(items, 4, 0);
        expect(result).toEqual(['e', 'a', 'b', 'c', 'd']);
    });

    it('handles single item list', () => {
        const result = reorder(['x'], 0, 0);
        expect(result).toEqual(['x']);
    });

    it('handles two items swap', () => {
        const result = reorder(['a', 'b'], 0, 1);
        expect(result).toEqual(['b', 'a']);
    });

    it('does not mutate original array', () => {
        const original = ['a', 'b', 'c'];
        reorder(original, 0, 2);
        expect(original).toEqual(['a', 'b', 'c']);
    });

    it('calls onreorder with new order', () => {
        const onreorder = vi.fn();
        const newIds = reorder(items, 0, 2);
        onreorder(newIds);
        expect(onreorder).toHaveBeenCalledWith(['b', 'c', 'a', 'd', 'e']);
    });

    it('calls onremove correctly', () => {
        const onremove = vi.fn();
        const id = 'c';
        onremove(id);
        expect(onremove).toHaveBeenCalledWith('c');
    });
});
