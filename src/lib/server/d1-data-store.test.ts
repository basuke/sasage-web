import { describe, it, expect, beforeEach } from 'vitest';
import { D1DataStore, getDataStore, JsonDataStore } from './data-store';
import type { Collections } from './data-store';
import type { ImageSet } from '../data';
import type { D1Database, D1PreparedStatement, D1Result, D1ExecResult } from './d1-types';

// --- In-memory D1 mock ---
// Simulates D1Database with in-memory storage using simple SQL parsing

interface TableRow {
    [key: string]: string | number | null;
}

function createMockD1(): D1Database {
    const tables: Record<string, TableRow[]> = {
        images: [],
        collections: [],
        works: [],
        work_images: [],
    };

    function parseInsert(sql: string, bindings: unknown[]): void {
        const tableMatch = sql.match(/INSERT INTO (\w+)/i);
        if (!tableMatch) throw new Error(`Cannot parse INSERT: ${sql}`);
        const table = tableMatch[1]!;

        const colsMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
        if (!colsMatch) throw new Error(`Cannot parse columns: ${sql}`);
        const cols = colsMatch[1]!.split(',').map((c) => c.trim());

        const row: TableRow = {};
        for (let i = 0; i < cols.length; i++) {
            row[cols[i]!] = bindings[i] as string | number | null;
        }

        if (!tables[table]) tables[table] = [];
        tables[table]!.push(row);
    }

    function parseDelete(sql: string): void {
        const tableMatch = sql.match(/DELETE FROM (\w+)/i);
        if (!tableMatch) throw new Error(`Cannot parse DELETE: ${sql}`);
        const table = tableMatch[1]!;
        tables[table] = [];
    }

    function parseSelect(sql: string): TableRow[] {
        const tableMatch = sql.match(/FROM (\w+)/i);
        if (!tableMatch) throw new Error(`Cannot parse SELECT: ${sql}`);
        const table = tableMatch[1]!;

        const rows = [...(tables[table] ?? [])];

        const orderMatch = sql.match(/ORDER BY (\w+)/i);
        if (orderMatch) {
            const col = orderMatch[1]!;
            rows.sort((a, b) => {
                const va = a[col];
                const vb = b[col];
                if (typeof va === 'number' && typeof vb === 'number') return va - vb;
                return String(va ?? '').localeCompare(String(vb ?? ''));
            });
        }

        return rows;
    }

    function createStatement(sql: string, boundValues: unknown[] = []): D1PreparedStatement {
        const stmt: D1PreparedStatement = {
            bind(...values: unknown[]) {
                // D1's bind() returns a NEW statement with bindings applied
                return createStatement(sql, values);
            },
            async first<T>(): Promise<T | null> {
                const results = parseSelect(sql);
                return (results[0] as T) ?? null;
            },
            async all<T>(): Promise<D1Result<T>> {
                if (sql.trim().toUpperCase().startsWith('SELECT')) {
                    const results = parseSelect(sql);
                    return { results: results as T[], success: true, meta: {} as D1ExecResult };
                }
                if (sql.trim().toUpperCase().startsWith('INSERT')) {
                    parseInsert(sql, boundValues);
                    return { results: [], success: true, meta: {} as D1ExecResult };
                }
                if (sql.trim().toUpperCase().startsWith('DELETE')) {
                    parseDelete(sql);
                    return { results: [], success: true, meta: {} as D1ExecResult };
                }
                return { results: [], success: true, meta: {} as D1ExecResult };
            },
            async run(): Promise<D1ExecResult> {
                if (sql.trim().toUpperCase().startsWith('INSERT')) {
                    parseInsert(sql, boundValues);
                } else if (sql.trim().toUpperCase().startsWith('DELETE')) {
                    parseDelete(sql);
                }
                return {} as D1ExecResult;
            },
            async raw<T>(): Promise<T[]> {
                return [];
            },
        } as D1PreparedStatement;

        return stmt;
    }

    return {
        prepare(sql: string) {
            return createStatement(sql);
        },
        async batch<T>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
            const results: D1Result<T>[] = [];
            for (const stmt of statements) {
                const result = await stmt.all<T>();
                results.push(result);
            }
            return results;
        },
        async exec(sql: string): Promise<D1ExecResult> {
            const stmts = sql.split(';').filter((s) => s.trim());
            for (const s of stmts) {
                const trimmed = s.trim().toUpperCase();
                if (trimmed.startsWith('DELETE')) {
                    parseDelete(s);
                }
            }
            return {} as D1ExecResult;
        },
        async dump(): Promise<ArrayBuffer> {
            return new ArrayBuffer(0);
        },
    } as D1Database;
}

// --- Tests ---

describe('D1DataStore', () => {
    let db: D1Database;
    let store: D1DataStore;

    beforeEach(() => {
        db = createMockD1();
        store = new D1DataStore(db);
    });

    describe('readImages', () => {
        it('returns empty ImageSet when no images exist', async () => {
            const images = await store.readImages();
            expect(Object.keys(images)).toHaveLength(0);
        });

        it('returns images after writeImages', async () => {
            const input: ImageSet = {
                'test/1': {
                    id: 'test/1',
                    format: 'jpeg',
                    width: 800,
                    height: 600,
                    title: 'Test Image',
                },
            };

            await store.writeImages(input);
            const result = await store.readImages();

            expect(Object.keys(result)).toHaveLength(1);
            expect(result['test/1']?.id).toBe('test/1');
            expect(result['test/1']?.format).toBe('jpeg');
            expect(result['test/1']?.width).toBe(800);
            expect(result['test/1']?.height).toBe(600);
            expect(result['test/1']?.title).toBe('Test Image');
        });

        it('handles bilingual title', async () => {
            const input: ImageSet = {
                'test/bi': {
                    id: 'test/bi',
                    format: 'png',
                    width: 100,
                    height: 100,
                    title: { en: 'English', ja: '日本語' },
                },
            };

            await store.writeImages(input);
            const result = await store.readImages();

            expect(result['test/bi']?.title).toEqual({ en: 'English', ja: '日本語' });
        });

        it('handles image with description', async () => {
            const input: ImageSet = {
                'test/desc': {
                    id: 'test/desc',
                    format: 'jpeg',
                    width: 100,
                    height: 100,
                    title: 'Has Description',
                    description: { en: 'Desc EN', ja: 'Desc JA' },
                },
            };

            await store.writeImages(input);
            const result = await store.readImages();

            expect(result['test/desc']?.description).toEqual({ en: 'Desc EN', ja: 'Desc JA' });
        });

        it('omits description when not present', async () => {
            const input: ImageSet = {
                'test/nodesc': {
                    id: 'test/nodesc',
                    format: 'jpeg',
                    width: 100,
                    height: 100,
                    title: 'No Description',
                },
            };

            await store.writeImages(input);
            const result = await store.readImages();

            expect(result['test/nodesc']?.description).toBeUndefined();
        });
    });

    describe('writeImages', () => {
        it('replaces all images on write', async () => {
            const first: ImageSet = {
                a: { id: 'a', format: 'jpeg', width: 1, height: 1, title: 'A' },
                b: { id: 'b', format: 'png', width: 2, height: 2, title: 'B' },
            };
            await store.writeImages(first);

            const second: ImageSet = {
                c: { id: 'c', format: 'jpeg', width: 3, height: 3, title: 'C' },
            };
            await store.writeImages(second);

            const result = await store.readImages();
            expect(Object.keys(result)).toHaveLength(1);
            expect(result['c']?.id).toBe('c');
            expect(result['a']).toBeUndefined();
        });
    });

    describe('readCollections', () => {
        it('returns empty collections when no data exists', async () => {
            const collections = await store.readCollections();
            expect(collections.topImages).toEqual([]);
            expect(collections.topImagesWide).toEqual([]);
            expect(collections.works).toEqual([]);
            expect(collections.illustrations).toEqual([]);
        });

        it('returns collections after writeCollections', async () => {
            const input: Collections = {
                topImages: ['img-1', 'img-2'],
                topImagesWide: ['wide-1'],
                works: [
                    {
                        id: 'work-1',
                        image: 'cover-1',
                        title: 'Work Title',
                        images: ['img-a', 'img-b'],
                    },
                ],
                illustrations: ['ill-1', 'ill-2', 'ill-3'],
            };

            await store.writeCollections(input);
            const result = await store.readCollections();

            expect(result.topImages).toEqual(['img-1', 'img-2']);
            expect(result.topImagesWide).toEqual(['wide-1']);
            expect(result.illustrations).toEqual(['ill-1', 'ill-2', 'ill-3']);
            expect(result.works).toHaveLength(1);
            expect(result.works[0]!.id).toBe('work-1');
            expect(result.works[0]!.image).toBe('cover-1');
            expect(result.works[0]!.title).toBe('Work Title');
            expect(result.works[0]!.images).toEqual(['img-a', 'img-b']);
        });
    });

    describe('writeCollections', () => {
        it('preserves position ordering', async () => {
            const input: Collections = {
                topImages: ['third', 'first', 'second'],
                topImagesWide: [],
                works: [],
                illustrations: [],
            };

            await store.writeCollections(input);
            const result = await store.readCollections();

            expect(result.topImages).toEqual(['third', 'first', 'second']);
        });

        it('replaces all collections on write', async () => {
            const first: Collections = {
                topImages: ['a', 'b'],
                topImagesWide: ['c'],
                works: [],
                illustrations: ['d'],
            };
            await store.writeCollections(first);

            const second: Collections = {
                topImages: ['x'],
                topImagesWide: [],
                works: [],
                illustrations: [],
            };
            await store.writeCollections(second);

            const result = await store.readCollections();
            expect(result.topImages).toEqual(['x']);
            expect(result.topImagesWide).toEqual([]);
            expect(result.illustrations).toEqual([]);
        });

        it('handles work with bilingual title and subtitle', async () => {
            const input: Collections = {
                topImages: [],
                topImagesWide: [],
                works: [
                    {
                        id: 'bilingual-work',
                        title: { en: 'English Title', ja: '日本語タイトル' },
                        subtitle: { en: 'English Sub', ja: '日本語サブ' },
                        images: [],
                    },
                ],
                illustrations: [],
            };

            await store.writeCollections(input);
            const result = await store.readCollections();

            expect(result.works[0]!.title).toEqual({ en: 'English Title', ja: '日本語タイトル' });
            expect(result.works[0]!.subtitle).toEqual({ en: 'English Sub', ja: '日本語サブ' });
        });

        it('handles work without cover image', async () => {
            const input: Collections = {
                topImages: [],
                topImagesWide: [],
                works: [
                    {
                        id: 'no-cover',
                        title: 'No Cover Work',
                        images: ['img-1'],
                    },
                ],
                illustrations: [],
            };

            await store.writeCollections(input);
            const result = await store.readCollections();

            expect(result.works[0]!.image).toBeUndefined();
        });

        it('handles multiple works with correct ordering', async () => {
            const input: Collections = {
                topImages: [],
                topImagesWide: [],
                works: [
                    { id: 'first', title: 'First', images: [] },
                    { id: 'second', title: 'Second', images: ['a'] },
                    { id: 'third', title: 'Third', images: ['b', 'c'] },
                ],
                illustrations: [],
            };

            await store.writeCollections(input);
            const result = await store.readCollections();

            expect(result.works).toHaveLength(3);
            expect(result.works[0]!.id).toBe('first');
            expect(result.works[1]!.id).toBe('second');
            expect(result.works[2]!.id).toBe('third');
            expect(result.works[1]!.images).toEqual(['a']);
            expect(result.works[2]!.images).toEqual(['b', 'c']);
        });
    });

    describe('full round-trip', () => {
        it('images survive full write-read cycle', async () => {
            const input: ImageSet = {
                'img/1': {
                    id: 'img/1',
                    format: 'jpeg',
                    width: 1920,
                    height: 1080,
                    title: 'Landscape',
                },
                'img/2': {
                    id: 'img/2',
                    format: 'png',
                    width: 500,
                    height: 500,
                    title: { en: 'Square', ja: '正方形' },
                    description: 'A square image',
                },
            };

            await store.writeImages(input);
            const result = await store.readImages();

            expect(result['img/1']).toEqual(input['img/1']);
            expect(result['img/2']?.id).toBe('img/2');
            expect(result['img/2']?.title).toEqual({ en: 'Square', ja: '正方形' });
            expect(result['img/2']?.description).toBe('A square image');
        });

        it('collections survive full write-read cycle', async () => {
            const input: Collections = {
                topImages: ['top-1', 'top-2'],
                topImagesWide: ['wide-1'],
                works: [
                    {
                        id: 'my-work',
                        image: 'cover',
                        title: { en: 'My Work', ja: '私の作品' },
                        subtitle: { en: 'A description', ja: '説明' },
                        images: ['page-1', 'page-2', 'page-3'],
                    },
                ],
                illustrations: ['ill-1'],
            };

            await store.writeCollections(input);
            const result = await store.readCollections();

            expect(result.topImages).toEqual(input.topImages);
            expect(result.topImagesWide).toEqual(input.topImagesWide);
            expect(result.illustrations).toEqual(input.illustrations);
            expect(result.works).toHaveLength(1);
            expect(result.works[0]!.id).toBe('my-work');
            expect(result.works[0]!.image).toBe('cover');
            expect(result.works[0]!.title).toEqual({ en: 'My Work', ja: '私の作品' });
            expect(result.works[0]!.subtitle).toEqual({ en: 'A description', ja: '説明' });
            expect(result.works[0]!.images).toEqual(['page-1', 'page-2', 'page-3']);
        });
    });
});

describe('getDataStore', () => {
    it('returns JsonDataStore when platform has no DB', () => {
        const store = getDataStore({});
        expect(store).toBeInstanceOf(JsonDataStore);
    });

    it('returns JsonDataStore when platform is undefined', () => {
        const store = getDataStore(undefined);
        expect(store).toBeInstanceOf(JsonDataStore);
    });

    it('returns D1DataStore when platform.env.DB exists', () => {
        const mockDb = createMockD1();
        const store = getDataStore({ env: { DB: mockDb } });
        expect(store).toBeInstanceOf(D1DataStore);
    });
});
