import { describe, it, expect } from 'vitest';
import type { Work, TranslatableString } from '$lib/data';

// Integration tests for Work CRUD logic

function createWork(params: {
    id: string;
    title: TranslatableString;
    subtitle?: TranslatableString;
    image?: string;
    images?: string[];
}): Work {
    const work: Work = {
        id: params.id,
        title: params.title,
        images: params.images ?? [],
    };
    if (params.subtitle !== undefined) work.subtitle = params.subtitle;
    if (params.image !== undefined) work.image = params.image;
    return work;
}

function updateWork(
    work: Work,
    updates: {
        title?: TranslatableString;
        subtitle?: TranslatableString | null;
        image?: string | null;
        images?: string[];
    },
): Work {
    const updated = { ...work };
    if (updates.title !== undefined) updated.title = updates.title;
    if (updates.subtitle !== undefined) {
        if (updates.subtitle === null) {
            delete updated.subtitle;
        } else {
            updated.subtitle = updates.subtitle;
        }
    }
    if (updates.image !== undefined) {
        if (updates.image === null) {
            delete updated.image;
        } else {
            updated.image = updates.image;
        }
    }
    if (updates.images !== undefined) updated.images = updates.images;
    return updated;
}

function deleteWork(works: Work[], id: string): Work[] {
    return works.filter((w) => w.id !== id);
}

function findWork(works: Work[], id: string): Work | undefined {
    return works.find((w) => w.id === id);
}

function workExists(works: Work[], id: string): boolean {
    return works.some((w) => w.id === id);
}

describe('Work CRUD logic', () => {
    describe('createWork', () => {
        it('creates a work with minimal fields', () => {
            const work = createWork({ id: 'test-work', title: 'Test Work' });
            expect(work.id).toBe('test-work');
            expect(work.title).toBe('Test Work');
            expect(work.images).toEqual([]);
            expect(work.subtitle).toBeUndefined();
            expect(work.image).toBeUndefined();
        });

        it('creates a work with all fields', () => {
            const work = createWork({
                id: 'full-work',
                title: { en: 'Full Work', ja: '完全作品' },
                subtitle: { en: 'A subtitle', ja: 'サブタイトル' },
                image: 'cover/image',
                images: ['img/1', 'img/2'],
            });

            expect(work.id).toBe('full-work');
            expect(work.title).toEqual({ en: 'Full Work', ja: '完全作品' });
            expect(work.subtitle).toEqual({ en: 'A subtitle', ja: 'サブタイトル' });
            expect(work.image).toBe('cover/image');
            expect(work.images).toEqual(['img/1', 'img/2']);
        });

        it('creates work with bilingual title', () => {
            const work = createWork({
                id: 'bilingual',
                title: { en: 'English Title', ja: '日本語タイトル' },
            });
            expect(work.title).toEqual({ en: 'English Title', ja: '日本語タイトル' });
        });
    });

    describe('updateWork', () => {
        const base: Work = {
            id: 'my-work',
            title: 'Original Title',
            subtitle: 'Original Subtitle',
            image: 'original/cover',
            images: ['img/1', 'img/2'],
        };

        it('updates title', () => {
            const updated = updateWork(base, { title: 'New Title' });
            expect(updated.title).toBe('New Title');
            expect(updated.subtitle).toBe('Original Subtitle');
        });

        it('updates images list', () => {
            const updated = updateWork(base, { images: ['img/3', 'img/4'] });
            expect(updated.images).toEqual(['img/3', 'img/4']);
        });

        it('clears optional fields with null', () => {
            const updated = updateWork(base, { subtitle: null, image: null });
            expect(updated.subtitle).toBeUndefined();
            expect(updated.image).toBeUndefined();
        });

        it('updates cover image', () => {
            const updated = updateWork(base, { image: 'new/cover' });
            expect(updated.image).toBe('new/cover');
        });

        it('does not modify fields not in updates', () => {
            const updated = updateWork(base, { title: 'New' });
            expect(updated.subtitle).toBe('Original Subtitle');
            expect(updated.image).toBe('original/cover');
            expect(updated.images).toEqual(['img/1', 'img/2']);
        });
    });

    describe('deleteWork', () => {
        const works: Work[] = [
            { id: 'work-1', title: 'Work 1', images: [] },
            { id: 'work-2', title: 'Work 2', images: [] },
            { id: 'work-3', title: 'Work 3', images: [] },
        ];

        it('removes work from list', () => {
            const result = deleteWork(works, 'work-2');
            expect(result).toHaveLength(2);
            expect(result.map((w) => w.id)).toEqual(['work-1', 'work-3']);
        });

        it('returns unchanged list when work not found', () => {
            const result = deleteWork(works, 'nonexistent');
            expect(result).toHaveLength(3);
        });

        it('does not mutate original array', () => {
            deleteWork(works, 'work-1');
            expect(works).toHaveLength(3);
        });
    });

    describe('findWork', () => {
        const works: Work[] = [
            { id: 'work-1', title: 'Work 1', images: [] },
            { id: 'work-2', title: { en: 'Work 2', ja: '作品2' }, images: ['img/1'] },
        ];

        it('finds work by id', () => {
            const found = findWork(works, 'work-2');
            expect(found).toBeDefined();
            expect(found!.id).toBe('work-2');
        });

        it('returns undefined for non-existent id', () => {
            expect(findWork(works, 'nonexistent')).toBeUndefined();
        });
    });

    describe('workExists', () => {
        const works: Work[] = [{ id: 'work-1', title: 'Work 1', images: [] }];

        it('returns true for existing work', () => {
            expect(workExists(works, 'work-1')).toBe(true);
        });

        it('returns false for non-existing work', () => {
            expect(workExists(works, 'work-2')).toBe(false);
        });
    });

    describe('full CRUD flow', () => {
        it('create -> update -> delete lifecycle', () => {
            let works: Work[] = [];

            // Create
            const newWork = createWork({
                id: 'lifecycle-test',
                title: 'Lifecycle Test',
                images: ['img/1'],
            });
            works = [...works, newWork];
            expect(workExists(works, 'lifecycle-test')).toBe(true);

            // Update
            const found = findWork(works, 'lifecycle-test')!;
            const updated = updateWork(found, {
                title: { en: 'Updated', ja: '更新済み' },
                image: 'cover/new',
                images: ['img/1', 'img/2', 'img/3'],
            });
            works = works.map((w) => (w.id === updated.id ? updated : w));

            const afterUpdate = findWork(works, 'lifecycle-test')!;
            expect(afterUpdate.title).toEqual({ en: 'Updated', ja: '更新済み' });
            expect(afterUpdate.image).toBe('cover/new');
            expect(afterUpdate.images).toEqual(['img/1', 'img/2', 'img/3']);

            // Delete
            works = deleteWork(works, 'lifecycle-test');
            expect(workExists(works, 'lifecycle-test')).toBe(false);
            expect(works).toHaveLength(0);
        });
    });
});
