import type { ImageSet, Work } from '../data';
import { getDataStore, type Collections } from './data-store';

export interface SiteData {
    images: ImageSet;
    topImages: string[];
    topImagesWide: string[];
    works: Work[];
    illustrations: string[];
}

/**
 * Load all site data (images + collections) from D1 or JSON fallback.
 */
export async function loadAllData(platform?: App.Platform): Promise<SiteData> {
    const store = getDataStore(platform);
    const [images, collections] = await Promise.all([store.readImages(), store.readCollections()]);

    return {
        images,
        topImages: collections.topImages,
        topImagesWide: collections.topImagesWide,
        works: collections.works,
        illustrations: collections.illustrations,
    };
}

/**
 * Load images only from D1 or JSON fallback.
 */
export async function loadImages(platform?: App.Platform): Promise<ImageSet> {
    const store = getDataStore(platform);
    return store.readImages();
}

/**
 * Load collections only from D1 or JSON fallback.
 */
export async function loadCollections(platform?: App.Platform): Promise<Collections> {
    const store = getDataStore(platform);
    return store.readCollections();
}
