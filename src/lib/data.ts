import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/environment';
import { default as MarkdownIt } from 'markdown-it';
export const email = 'sasage.mayumi@gmail.com';
export const agencyName = 'Essie White Literary';
export const agencyEmail = 'essie@essiewhiteliterary.com';
export const agencyURL = 'https://www.essiewhiteliterary.com';

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
