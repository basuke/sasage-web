import type { Image, Work } from '$lib/data';

export interface Collections {
    topImages: string[];
    topImagesWide: string[];
    works: Work[];
    illustrations: string[];
}

export interface ImageUsage {
    label: string;
    href: string;
}

export function filterImages(images: Image[], query: string): Image[] {
    if (!query) return images;
    const lower = query.toLowerCase();
    return images.filter((img) => img.id.toLowerCase().includes(lower));
}

export function extractPrefixes(images: Image[]): string[] {
    const prefixes = new Set<string>();
    for (const img of images) {
        const slash = img.id.indexOf('/');
        prefixes.add(slash >= 0 ? img.id.substring(0, slash) : '(root)');
    }
    return [...prefixes].sort();
}

export function buildImageUsageMap(collections: Collections): Map<string, ImageUsage[]> {
    const map = new Map<string, ImageUsage[]>();

    function add(imageId: string, usage: ImageUsage) {
        const existing = map.get(imageId);
        if (existing) {
            existing.push(usage);
        } else {
            map.set(imageId, [usage]);
        }
    }

    for (const id of collections.topImages) {
        add(id, { label: 'topImages', href: '/admin/collections' });
    }

    for (const id of collections.topImagesWide) {
        add(id, { label: 'topImagesWide', href: '/admin/collections' });
    }

    for (const id of collections.illustrations) {
        add(id, { label: 'illustrations', href: '/admin/collections' });
    }

    for (const work of collections.works) {
        if (work.image) {
            add(work.image, { label: work.id, href: '/admin/works' });
        }
        for (const id of work.images) {
            add(id, { label: work.id, href: '/admin/works' });
        }
    }

    return map;
}
