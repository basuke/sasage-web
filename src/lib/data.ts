const debug = process.env.NODE_ENV === 'development';

import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import images from '../images.json';
import { browser } from '$app/environment';
import { default as MarkdownIt } from 'markdown-it';
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
export type TranslatableString =
    | string
    | {
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
    return images[id] ?? null;
}

export const lang: Writable<Lang> = writable('en');

type Translatable = Record<string, any>;

export function translated(obj: Translatable | undefined, key: string, lang: string): string {
    if (!obj || !(key in obj)) return '';
    let value = obj[key];
    if (typeof value === 'object') value = value[lang] || value['en'];

    if (typeof value !== 'string') return '';

    const md = MarkdownIt();

    const lines = value.split('\n').map((line) => line.trim());
    const htmls = lines.map((line) => md.renderInline(line));
    return htmls.join('<br>');
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
            id: 'zine-2023',
            image: 'zine-2023/Seven-Classic-Cat-Antics',
            title: 'Seven Classic Cat Antics',
            subtitle: {
                en: `
                    Personal work (2023)
                    Zine for the SF Zine Fest

                    For the SF Zine Fest 2023, I made a zine about cats,
                    using some Japanese onomatopoeia
                    to show the behaviors I was interested in.
                `,
                ja: `
                    パーソナルワーク
                    SF Zine FestのためのZine（2023）

                    SF Zine Fest 2023に参加するにあたり、
                    猫によくある7つの行動についてのZineを
                    日本語のオノマトペを交えながら制作、販売しました。
                `,
            },
            images: [
                'zine-2023/Cover',
                'zine-2023/1',
                'zine-2023/2-3',
                'zine-2023/4-5',
                'zine-2023/6-7',
                'zine-2023/8-9',
                'zine-2023/10-11',
                'zine-2023/12-13',
                'zine-2023/14-15',
                'zine-2023/16p',
            ],
        },
        {
            id: 'gift-cards',
            image: 'gift-cards/cover',
            title: 'Gift Cards',
            subtitle: {
                en: `
                    Client work (2023)
                    [pamxy, Inc.](https://pamxy.co.jp/)

                    Illustrations for gift card of
                    Japanese e-commerce site called [giff letter](https://www.giff-letter.com/)
                `,
                ja: `
                    クライアントワーク (2023)
                    [株式会社 pamxy](https://pamxy.co.jp/) 様

                    e-コマース ([giff leter](https://www.giff-letter.com/)) 
                    ギフトカードのイラストレーション
                `,
            },
            images: [
                'gift-cards/card-1',
                'gift-cards/card-2',
                'gift-cards/card-3',
                'gift-cards/card-4',
                'gift-cards/card-5',
                'gift-cards/card-6',
                'gift-cards/card-7',
                'gift-cards/card-8',
                'gift-cards/card-9',
                'gift-cards/card-10',
                'gift-cards/card-11',
                'gift-cards/card-12',
                'gift-cards/card-13',
                'gift-cards/card-14',
                'gift-cards/card-15',
            ],
        },
        {
            id: 'halloween',
            image: 'works/halloween',
            title: 'Halloween Card',
            subtitle: {
                en: `
                    Client work (2022)
                    [Storm Literary Agency](https://www.stormliteraryagency.com/)

                    Halloween card for e-mail signature (2022)
                `,
                ja: `
                    クライアントワーク (2022)
                    [Storm Literary Agency](https://www.stormliteraryagency.com/) 様

                    e-mailで使われるハロウインカードのイラスト

                `,
            },
            images: ['works/halloween'],
        },
        {
            id: 'lost-in-the-rain',
            image: 'books/lost-in-the-rain/cover',
            title: 'LOST IN THE RAIN',
            subtitle: {
                en: `
                    Personal work.
                    Children’s book

                    This work was selected for
                    [The AOI World Illustration Awards longlist](https://theaoi.com/wia/mayumi-sasage-lost-in-the-rain/).`,
                ja: `
                    パーソナルワーク
                    絵本

                    この作品は
                    [The AOI World Illustration Awards longlist](https://theaoi.com/wia/mayumi-sasage-lost-in-the-rain/)
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
                    パーソナルワーク
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
                    パーソナルワーク
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
                    Personal work

                    This work was selected for
                    [3x3 Internationa Illustration Show No. 19, 2022](https://3x3mag.com/annuals/annual19/s/sasage-mayumi-91175)
                    Honotable Mention`,
                ja: `
                    パーソナルワーク

                    この作品は
                    [3x3 Internationa Illustration Show No. 19, 2022](https://3x3mag.com/annuals/annual19/s/sasage-mayumi-91175)
                    Honotable Mentionに選ばれました
                `,
            },
            images: ['illustration/ws2', 'illustration/ws3', 'illustration/ws4'],
        },
    ],

    illustrations: [
        'illustration/1',
        'illustration/ws1',

        'illustration/2023-5',
        'illustration/2023-6',
        'illustration/2023-8',
        'illustration/2023-7',
        'illustration/2023-3',
        'illustration/2023-1',
        'illustration/2023-2',
        'illustration/2023-4',

        'illustration/ws5',
        'illustration/ws6',
        'illustration/ws7',
        'illustration/ws8',
        'illustration/ws9',
        'illustration/ws10',
        'illustration/ws11',
        'illustration/ws12',
        'illustration/ws13',
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

        'illustration/ws14',

        'illustration/2023-9',
    ],

    images: images as ImageSet,
};
