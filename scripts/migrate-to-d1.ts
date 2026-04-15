/**
 * Migration script: JSON files → D1 SQL
 *
 * Reads src/images.json and src/collections.json, outputs SQL INSERT statements
 * that can be applied to a D1 database.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-d1.ts > migrations/0002_seed_data.sql
 *   wrangler d1 execute sasage-web-db --local --file=migrations/0002_seed_data.sql
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface TranslatableString {
    en?: string;
    ja?: string;
}

interface ImageEntry {
    id: string;
    format: string;
    width: number;
    height: number;
    title: string | TranslatableString;
    description?: string | TranslatableString;
    sha1?: string;
}

interface Work {
    id: string;
    image?: string;
    title: string | TranslatableString;
    subtitle?: string | TranslatableString;
    images: string[];
}

interface CollectionsData {
    topImages: string[];
    topImagesWide: string[];
    works: Work[];
    illustrations: string[];
}

function escapeSQL(value: string): string {
    return value.replace(/'/g, "''");
}

function sqlString(value: string | null | undefined): string {
    if (value == null) return 'NULL';
    return `'${escapeSQL(value)}'`;
}

function extractText(ts: string | TranslatableString | undefined): {
    text: string | null;
    text_ja: string | null;
} {
    if (ts === undefined) return { text: null, text_ja: null };
    if (typeof ts === 'string') return { text: ts, text_ja: null };
    return { text: ts.en ?? null, text_ja: ts.ja ?? null };
}

const scriptDir = import.meta.dirname ?? new URL('.', import.meta.url).pathname;
const root = join(scriptDir, '..');
const imagesRaw = readFileSync(join(root, 'src', 'images.json'), 'utf-8');
const collectionsRaw = readFileSync(join(root, 'src', 'collections.json'), 'utf-8');

const images: Record<string, ImageEntry> = JSON.parse(imagesRaw);
const collections: CollectionsData = JSON.parse(collectionsRaw);

const lines: string[] = [];

lines.push('-- Auto-generated migration: JSON → D1');
lines.push('-- Source: src/images.json + src/collections.json');
lines.push('');

// --- Images ---
lines.push('-- Images');
for (const img of Object.values(images)) {
    const { text: title, text_ja: titleJa } = extractText(img.title);
    const { text: desc, text_ja: descJa } = extractText(img.description);
    lines.push(
        `INSERT INTO images (id, format, width, height, title, title_ja, description, description_ja, sha1) VALUES (${sqlString(img.id)}, ${sqlString(img.format)}, ${img.width}, ${img.height}, ${sqlString(title)}, ${sqlString(titleJa)}, ${sqlString(desc)}, ${sqlString(descJa)}, ${sqlString(img.sha1)});`,
    );
}

lines.push('');

// --- Collections ---
lines.push('-- Collections');
function addCollection(name: string, ids: string[]) {
    for (let i = 0; i < ids.length; i++) {
        lines.push(
            `INSERT INTO collections (name, image_id, position) VALUES (${sqlString(name)}, ${sqlString(ids[i])}, ${i});`,
        );
    }
}

addCollection('topImages', collections.topImages);
addCollection('topImagesWide', collections.topImagesWide);
addCollection('illustrations', collections.illustrations);

lines.push('');

// --- Works ---
lines.push('-- Works');
for (let wi = 0; wi < collections.works.length; wi++) {
    const work = collections.works[wi]!;
    const { text: title, text_ja: titleJa } = extractText(work.title);
    const { text: subtitle, text_ja: subtitleJa } = extractText(work.subtitle);
    lines.push(
        `INSERT INTO works (id, cover_image_id, title, title_ja, subtitle, subtitle_ja, position) VALUES (${sqlString(work.id)}, ${sqlString(work.image)}, ${sqlString(title)}, ${sqlString(titleJa)}, ${sqlString(subtitle)}, ${sqlString(subtitleJa)}, ${wi});`,
    );
}

lines.push('');

// --- Work Images ---
lines.push('-- Work Images');
for (const work of collections.works) {
    for (let ii = 0; ii < work.images.length; ii++) {
        lines.push(
            `INSERT INTO work_images (work_id, image_id, position) VALUES (${sqlString(work.id)}, ${sqlString(work.images[ii])}, ${ii});`,
        );
    }
}

lines.push('');

console.log(lines.join('\n'));
