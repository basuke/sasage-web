import fs from 'fs';
import path from 'path';
import type { ImageSet, Work } from '../data';

export interface Collections {
    topImages: string[];
    topImagesWide: string[];
    works: Work[];
    illustrations: string[];
}

function projectRoot(): string {
    return process.cwd();
}

function imagesPath(): string {
    return path.join(projectRoot(), 'src', 'images.json');
}

function collectionsPath(): string {
    return path.join(projectRoot(), 'src', 'collections.json');
}

export function readImages(): ImageSet {
    const raw = fs.readFileSync(imagesPath(), 'utf-8');
    return JSON.parse(raw) as ImageSet;
}

export function writeImages(images: ImageSet): void {
    fs.writeFileSync(imagesPath(), JSON.stringify(images, null, '  ') + '\n');
}

export function readCollections(): Collections {
    const raw = fs.readFileSync(collectionsPath(), 'utf-8');
    return JSON.parse(raw) as Collections;
}

export function writeCollections(collections: Collections): void {
    fs.writeFileSync(collectionsPath(), JSON.stringify(collections, null, '    ') + '\n');
}
