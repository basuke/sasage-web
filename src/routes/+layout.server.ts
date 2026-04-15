import { D1DataStore } from '$lib/server/data-store';
import type { ImageSet } from '$lib/data';
import type { LayoutServerLoad } from './$types';

// Static imports as fallback — bundled at build time, works in all environments
// (including Cloudflare Workers where Node.js `fs` is not available)
import staticImages from '../images.json';
import staticCollections from '../collections.json';

export const load: LayoutServerLoad = async ({ platform, url }) => {
    // Skip data loading for admin routes — they have their own data layer
    if (url.pathname.startsWith('/admin')) {
        return {};
    }

    const db = platform?.env?.DB;
    if (db) {
        // Production: load from D1 for immediate data freshness
        const store = new D1DataStore(db);
        const [images, collections] = await Promise.all([
            store.readImages(),
            store.readCollections(),
        ]);

        return {
            images,
            topImages: collections.topImages,
            topImagesWide: collections.topImagesWide,
            works: collections.works,
            illustrations: collections.illustrations,
            debug: false,
        };
    }

    // Fallback: use static JSON data (bundled at build time)
    return {
        images: staticImages as ImageSet,
        topImages: staticCollections.topImages,
        topImagesWide: staticCollections.topImagesWide,
        works: staticCollections.works,
        illustrations: staticCollections.illustrations,
        debug: process.env.NODE_ENV === 'development',
    };
};
