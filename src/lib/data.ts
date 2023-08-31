const debug = process.env.NODE_ENV === 'development';

import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import images from '../images.json';
import { browser } from '$app/environment';

export const email = 'sasage.mayumi@gmail.com';
export const agencyEmail = 'stormliteraryagency@gmail.com';

export const imageDirectory = 'images';
export const storageBucket = 'sasage-website-71713.appspot.com';
export const baseUrl = `https://storage.googleapis.com/${storageBucket}/${imageDirectory}/`;
export const gtagId = 'UA-164370440-1';

export const widths = [320, 480, 640, 960, 1280];
export const heights = [240, 480, 720, 960];

interface gtagFunction {
    (title: string, message: string, params: Record<string, any>): void;
}

declare const gtag: gtagFunction;

export type Lang = 'en' | 'ja';
export type TranslatableString = string | {
    [key in Lang]?: string;
};
      
export type Image = {
    id: string;
    format: 'jpeg' | 'png';
    width: number;
    height: number;
    title: TranslatableString;
    description?: TranslatableString;
};

export type ImageSet = Record<string, Image>;

export type Work = {
    id: string;
    image?: string;
    title: TranslatableString;
    subtitle?: TranslatableString;
    images: string[];
};

export function tagPage(page_path: string) {
    if (browser) {
        gtag('config', gtagId, { page_path });
    }
}

export function imagePath(id: string, variant = 'public') {
    const account_hash = '3Z234PNqO8eVcjKwgURmyQ';

    return `https://imagedelivery.net/${account_hash}/${id}/${variant}`;
}

// https://imagedelivery.net/books/lost-in-the-rain/cover/-w960-h960

export function findWork(works: Work[], id: string): Work | undefined {
    return works.find((work) => work.id === id);
}

export function findImage(images: ImageSet, id: string): Image | null {
    return images[id];
}

export const lang: Writable<Lang> = writable('en');

type Translatable = Record<string, any>;

export function translated(obj: Translatable | undefined, key: string, lang: string): string {
    if (!obj || !(key in obj)) return '';
    let value = obj[key];
    if (typeof value === 'object') value = value[lang] || value['en'];

    if (typeof value !== 'string') return '';

    const lines = value.split("\n").map(line => line.trim());
    return lines.join('<br>');
}

export const data: {
    debug: boolean;
    topImages: string[];
    topImagesWide: string[];
    works: Work[];
    illustrations: string[];
    images: ImageSet;
} = {
    debug,
    topImages: ['top/1', 'top/2', 'top/3', 'top/4', 'top/5', 'top/6', 'top/7'],
    topImagesWide: [
        'top/wide-1',
        'top/wide-2',
        'top/wide-3',
        'top/wide-4',
        'top/wide-5',
        'top/wide-6',
        'top/wide-7',
    ],
    works: [
        {
            id: 'lost-in-the-rain',
            image: 'books/lost-in-the-rain/cover',
            title: 'LOST IN THE RAIN',
            subtitle: {
                en: `
                    Personal work.
                    Children’s book

                    This work was selected for
                    <a class="underline text-red-700 hover:text-red-400" href="https://theaoi.com/wia/mayumi-sasage-lost-in-the-rain/">The AOI World Illustration Awards longlist</a>.`,
                ja: `
                    Personal work.
                    絵本

                    この作品は
                    <a class="underline text-red-700 hover:text-red-400" href="https://theaoi.com/wia/mayumi-sasage-lost-in-the-rain/">The AOI World Illustration Awards longlist</a>
                    に選ばれました.`,
            },
            images: [
                'books/lost-in-the-rain/page1',
                'books/lost-in-the-rain/page2',
                'books/lost-in-the-rain/page3',
                'books/lost-in-the-rain/page4',
                'books/lost-in-the-rain/page5',
            ],
        },
        {
            id: 'book-2',
            image: 'books/flowers/cover',
            title: 'Flowers',
            subtitle: {
                en: `
                    Personal work.
                    Oracle Cards (2019)
                `,
                ja: `
                    Personal work.
                    オラクルカード (2019)
                `,
            },
            images: [
                'books/flowers/1',
                'books/flowers/2',
                'books/flowers/3',
                'books/flowers/4',
                'books/flowers/5',
                'books/flowers/6',
                'books/flowers/7',
                'books/flowers/8',
                'books/flowers/9',
                'books/flowers/10',
                'books/flowers/11',
                'books/flowers/12',
                'books/flowers/13',
                'books/flowers/14',
                'books/flowers/15',
            ],
        },
        {
            id: 'book-3',
            image: 'books/farmersmaket/cover',
            title: 'Farmers Market',
            subtitle: {
                en: `
                    Personal work.
                    magazine (2020)
                `,
                ja: `
                    Personal work.
                    雑誌の特集ページ (2020)
                `,
            },
            images: [
                'books/farmersmaket/fm2',
                'books/farmersmaket/fm3',
                'books/farmersmaket/fm4',
                'books/farmersmaket/fm1',
            ],
        },
        {
            id: 'love-is-love',
            image: 'works/love-is-love',
            title: 'Love is Love',
            subtitle: {
                en: `
                    Love is Love (2022)
                    Personal work

                    This work was selected for
                    3x3 Internationa Illustration Show No. 19, 2022: Honotable Mention`,
                ja: `
                    Love is Love (2022)
                    Personal work

                    この作品は
                    3x3 Internationa Illustration Show No. 19, 2022: Honotable Mention
                    に選ばれました
                `,
            },
            images: [
                'illustration/ws2',
                'illustration/ws3',
                'illustration/ws4',
            ],
        },
    ],

    illustrations: [
        'illustration/1',
        'illustration/ws1',
        'illustration/ws5',
        'illustration/ws6',
        'illustration/ws7',
        'illustration/ws8',
        'illustration/ws9',
        'illustration/ws10',
        'illustration/ws11',
        'illustration/ws12',
        'illustration/ws13',
        'illustration/ws14',
        'illustration/ws15',
        'illustration/ws16',
        'illustration/ws17',

        'spiced-tea/1',
        'spiced-tea/2',
        'spiced-tea/3',

        'summer/a',
        'summer/b',
        'summer/c',

        'morning-routine/a',
        'morning-routine/b',

        'food/food-1',
        'food/food-2',
        'food/food-3',
        'food/food-5',
        'food/food-6',

        'drawings/1',
        'drawings/3',
        'drawings/4',
    ],

    images: images as ImageSet,
};
