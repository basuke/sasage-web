import fs from 'node:fs';
import path from 'node:path';
import type { Image, ImageSet, TranslatableString, Work } from '../data';
import type { D1Database, D1PreparedStatement } from './d1-types';

export interface Collections {
    topImages: string[];
    topImagesWide: string[];
    works: Work[];
    illustrations: string[];
}

export interface DataStore {
    readImages(): Promise<ImageSet>;
    writeImages(images: ImageSet): Promise<void>;
    readCollections(): Promise<Collections>;
    writeCollections(collections: Collections): Promise<void>;
}

// --- TranslatableString conversion helpers ---

export function toTranslatable(text: string | null, text_ja: string | null): TranslatableString {
    if (text_ja != null) {
        const obj: { en?: string; ja?: string } = { ja: text_ja };
        if (text != null) obj.en = text;
        return obj;
    }
    return text ?? '';
}

export function fromTranslatable(ts: TranslatableString): {
    text: string | null;
    text_ja: string | null;
} {
    if (typeof ts === 'string') {
        return { text: ts, text_ja: null };
    }
    return { text: ts.en ?? null, text_ja: ts.ja ?? null };
}

// --- JsonDataStore ---

function projectRoot(): string {
    return process.cwd();
}

function imagesPath(): string {
    return path.join(projectRoot(), 'src', 'images.json');
}

function collectionsPath(): string {
    return path.join(projectRoot(), 'src', 'collections.json');
}

export class JsonDataStore implements DataStore {
    async readImages(): Promise<ImageSet> {
        const raw = fs.readFileSync(imagesPath(), 'utf-8');
        return JSON.parse(raw) as ImageSet;
    }

    async writeImages(images: ImageSet): Promise<void> {
        fs.writeFileSync(imagesPath(), JSON.stringify(images, null, '  ') + '\n');
    }

    async readCollections(): Promise<Collections> {
        const raw = fs.readFileSync(collectionsPath(), 'utf-8');
        return JSON.parse(raw) as Collections;
    }

    async writeCollections(collections: Collections): Promise<void> {
        fs.writeFileSync(collectionsPath(), JSON.stringify(collections, null, '    ') + '\n');
    }
}

// --- D1DataStore ---

interface ImageRow {
    id: string;
    format: string;
    width: number;
    height: number;
    title: string | null;
    title_ja: string | null;
    description: string | null;
    description_ja: string | null;
    sha1: string | null;
    created_at: string | null;
}

interface CollectionRow {
    name: string;
    image_id: string;
    position: number;
}

interface WorkRow {
    id: string;
    cover_image_id: string | null;
    title: string;
    title_ja: string | null;
    subtitle: string | null;
    subtitle_ja: string | null;
    position: number;
}

interface WorkImageRow {
    work_id: string;
    image_id: string;
    position: number;
}

function rowToImage(row: ImageRow): Image {
    const image: Image = {
        id: row.id,
        format: row.format as 'jpeg' | 'png',
        width: row.width,
        height: row.height,
        title: toTranslatable(row.title, row.title_ja),
    };
    const desc = toTranslatable(row.description, row.description_ja);
    if (desc !== '') {
        image.description = desc;
    }
    return image;
}

const D1_BATCH_LIMIT = 99;

async function batchAll(db: D1Database, stmts: D1PreparedStatement[]): Promise<void> {
    for (let i = 0; i < stmts.length; i += D1_BATCH_LIMIT) {
        await db.batch(stmts.slice(i, i + D1_BATCH_LIMIT));
    }
}

export class D1DataStore implements DataStore {
    constructor(private db: D1Database) {}

    async readImages(): Promise<ImageSet> {
        const { results } = await this.db.prepare('SELECT * FROM images').all<ImageRow>();

        const images: ImageSet = {};
        for (const row of results) {
            images[row.id] = rowToImage(row);
        }
        return images;
    }

    async writeImages(images: ImageSet): Promise<void> {
        const stmts: D1PreparedStatement[] = [this.db.prepare('DELETE FROM images')];

        for (const image of Object.values(images)) {
            const { text: title, text_ja: titleJa } = fromTranslatable(image.title);
            const { text: desc, text_ja: descJa } = image.description
                ? fromTranslatable(image.description)
                : { text: null, text_ja: null };

            stmts.push(
                this.db
                    .prepare(
                        `INSERT INTO images (id, format, width, height, title, title_ja, description, description_ja)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    )
                    .bind(
                        image.id,
                        image.format,
                        image.width,
                        image.height,
                        title,
                        titleJa,
                        desc,
                        descJa,
                    ),
            );
        }

        await batchAll(this.db, stmts);
    }

    async readCollections(): Promise<Collections> {
        const [collectionResult, worksResult, workImagesResult] = await this.db.batch<
            CollectionRow | WorkRow | WorkImageRow
        >([
            this.db.prepare('SELECT * FROM collections ORDER BY position'),
            this.db.prepare('SELECT * FROM works ORDER BY position'),
            this.db.prepare('SELECT * FROM work_images ORDER BY position'),
        ]);

        const collectionRows = (collectionResult?.results ?? []) as CollectionRow[];
        const workRows = (worksResult?.results ?? []) as WorkRow[];
        const workImageRows = (workImagesResult?.results ?? []) as WorkImageRow[];

        const topImages: string[] = [];
        const topImagesWide: string[] = [];
        const illustrations: string[] = [];

        for (const row of collectionRows) {
            switch (row.name) {
                case 'topImages':
                    topImages.push(row.image_id);
                    break;
                case 'topImagesWide':
                    topImagesWide.push(row.image_id);
                    break;
                case 'illustrations':
                    illustrations.push(row.image_id);
                    break;
            }
        }

        const workImagesMap = new Map<string, string[]>();
        for (const row of workImageRows) {
            const arr = workImagesMap.get(row.work_id);
            if (arr) {
                arr.push(row.image_id);
            } else {
                workImagesMap.set(row.work_id, [row.image_id]);
            }
        }

        const works: Work[] = workRows.map((row) => {
            const work: Work = {
                id: row.id,
                title: toTranslatable(row.title, row.title_ja),
                images: workImagesMap.get(row.id) ?? [],
            };
            if (row.cover_image_id != null) {
                work.image = row.cover_image_id;
            }
            const subtitle = toTranslatable(row.subtitle, row.subtitle_ja);
            if (subtitle !== '') {
                work.subtitle = subtitle;
            }
            return work;
        });

        return { topImages, topImagesWide, works, illustrations };
    }

    async writeCollections(collections: Collections): Promise<void> {
        const stmts: D1PreparedStatement[] = [
            this.db.prepare('DELETE FROM collections'),
            this.db.prepare('DELETE FROM work_images'),
            this.db.prepare('DELETE FROM works'),
        ];

        const collectionInsert = this.db.prepare(
            'INSERT INTO collections (name, image_id, position) VALUES (?, ?, ?)',
        );

        const addCollectionRows = (name: string, ids: string[]) => {
            for (let i = 0; i < ids.length; i++) {
                stmts.push(collectionInsert.bind(name, ids[i], i));
            }
        };

        addCollectionRows('topImages', collections.topImages);
        addCollectionRows('topImagesWide', collections.topImagesWide);
        addCollectionRows('illustrations', collections.illustrations);

        const workInsert = this.db.prepare(
            `INSERT INTO works (id, cover_image_id, title, title_ja, subtitle, subtitle_ja, position)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
        );
        const workImageInsert = this.db.prepare(
            'INSERT INTO work_images (work_id, image_id, position) VALUES (?, ?, ?)',
        );

        for (let wi = 0; wi < collections.works.length; wi++) {
            const work = collections.works[wi]!;
            const { text: title, text_ja: titleJa } = fromTranslatable(work.title);
            const { text: subtitle, text_ja: subtitleJa } = work.subtitle
                ? fromTranslatable(work.subtitle)
                : { text: null, text_ja: null };

            stmts.push(
                workInsert.bind(
                    work.id,
                    work.image ?? null,
                    title,
                    titleJa,
                    subtitle,
                    subtitleJa,
                    wi,
                ),
            );

            for (let ii = 0; ii < work.images.length; ii++) {
                stmts.push(workImageInsert.bind(work.id, work.images[ii], ii));
            }
        }

        await batchAll(this.db, stmts);
    }
}

// --- Factory ---

export function getDataStore(platform?: App.Platform): DataStore {
    const db = platform?.env?.DB;
    if (db) return new D1DataStore(db);
    return new JsonDataStore();
}
