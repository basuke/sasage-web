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

export type Image = {
    id: string;
    format: 'jpeg' | 'png';
    width: number;
    height: number;
    title: string;
};

export type ImageSet = Record<string, Image>;

export type Collection = {
    id: string;
    book?: boolean;
    image?: string;
    title: string;
    subtitle?: string;
    images: string[];
};

export type Collections = Collection[];

export function tagPage(page_path: string) {
    if (browser) {
        gtag('config', gtagId, { page_path });
    }
}

export function imagePath(id: string, variation = '', ext = 'jpg') {
    return baseUrl + id + variation + '.' + ext;
}

export function findCollection(collections: Collections, id: string): Collection | undefined {
    return collections.find((collection) => collection.id === id);
}

export function findImage(images: ImageSet, id: string): Image | null {
    return images[id];
}

export const lang: Writable<Lang> = writable('en');

type Translatable = Record<string, any>;

export function translated(obj: Translatable | undefined, key: string, lang: string): string {
    if (!obj) return '';
    let value = obj[key];
    key = key + '-' + lang;
    if (key in obj) value = obj[key];
    return value;
}

export const data: {
    debug: boolean;
    topImages: string[];
    topImagesWide: string[];
    collections: Collections;
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
    collections: [
        {
            id: 'lost-in-the-rain',
            book: true,
            image: 'books/lost-in-the-rain/cover',
            title: 'LOST IN THE RAIN',
            subtitle: `Children’s book (2020)<br>
            <br>
            This work was selected for<br>
            <a class="underline text-red-700 hover:text-red-400" href="https://theaoi.com/wia/mayumi-sasage-lost-in-the-rain/">The AOI World Illustration Awards longlist</a>.`,
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
            book: true,
            image: 'books/flowers/cover',
            title: 'Flowers',
            subtitle: 'Oracle Cards (2019)',
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
            book: true,
            image: 'books/farmersmaket/cover',
            title: 'Farmers Market',
            subtitle: 'The page of the magazine (2020)',
            images: [
                'books/farmersmaket/fm2',
                'books/farmersmaket/fm3',
                'books/farmersmaket/fm4',
                'books/farmersmaket/fm1',
            ],
        },
        {
            id: 'book-4',
            book: true,
            image: 'books/lilly-and-the-black-cat/6',
            title: 'Lilly and The Black Cat',
            subtitle: "Children's Book (2019 - 20)",
            images: [
                'books/lilly-and-the-black-cat/1',
                'books/lilly-and-the-black-cat/2',
                'books/lilly-and-the-black-cat/3',
                'books/lilly-and-the-black-cat/4',
                'books/lilly-and-the-black-cat/5',
                'books/lilly-and-the-black-cat/cover',
            ],
        },
        {
            id: 'illustrations',
            title: 'Illustrations',
            images: [
                'illustration/1',
                'illustration/ws1',
                'illustration/ws2',
                'illustration/ws3',
                'illustration/ws4',
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
        },
    ],
    images: images as ImageSet,
};
