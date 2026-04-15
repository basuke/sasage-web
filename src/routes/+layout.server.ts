import { loadAllData } from '$lib/server/data-loader';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ platform, url }) => {
    // Skip data loading for admin routes — they have their own data layer
    if (url.pathname.startsWith('/admin')) {
        return {};
    }

    const siteData = await loadAllData(platform);

    return {
        images: siteData.images,
        topImages: siteData.topImages,
        topImagesWide: siteData.topImagesWide,
        works: siteData.works,
        illustrations: siteData.illustrations,
        debug: process.env.NODE_ENV === 'development',
    };
};
