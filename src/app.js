const baseUrl = 'https://storage.googleapis.com/sasage-website-71713.appspot.com/images/';

export function imagePath(id, variation = '') {
    return baseUrl + id + variation + '.jpg';
}

export function findCollection(collections, id) {
    return collections.find(collection => collection.id === id);
}

export function findImage(images, id) {
    return images.find(image => image.id === id);
}

export function translated(obj, key, lang) {
    if (!obj) return '';
    let value = obj[key];
    key = key + '-' + lang;
    if (key in obj) value = obj[key];
    return value;
}

export const data = {
    topImages: [
        'top-square-1',
        'top-square-2',
        'top-square-3',
        'top-square-4',
        'top-square-5',
        'top-square-6',
        'top-square-7',
    ],
    collections: [
        {
            id: 'lost-in-the-rain',
            book: true,
            image: 'Book-Lost-In-The-Rain-cover',
            title: 'Lost in the Rain',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                'Book-Lost-In-The-Rain-page1',
                'Book-Lost-In-The-Rain-page2',
                'Book-Lost-In-The-Rain-page3',
                'Book-Lost-In-The-Rain-page4',
                'Book-Lost-In-The-Rain-page5',
            ],
        },
        {
            id: 'book-2',
            book: true,
            image: 'Book-Flower-cover',
            title: 'Flowers',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                'Book-Flower-1',
                'Book-Flower-2',
                'Book-Flower-3',
                'Book-Flower-4',
                'Book-Flower-5',
                'Book-Flower-6',
                'Book-Flower-7',
                'Book-Flower-8',
                'Book-Flower-9',
                'Book-Flower-10',
                'Book-Flower-11',
                'Book-Flower-12',
                'Book-Flower-13',
                'Book-Flower-14',
                'Book-Flower-15',
                'Book-Flower-16',
                'Book-Flower-17',
            ],
        },
        {
            id: 'book-3',
            book: true,
            image: 'Book-Farmers-Maket-cover',
            title: 'Farmers Maket',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            'title-ja': 'サンプルの本',
            'description-ja': `最近はすっかり天気も寒くなってきましたね。いかがおすごしでしょうか。なんてね。
            `,
            images: [
                'Book-Farmers-Maket-fm1',
                'Book-Farmers-Maket-fm2',
                'Book-Farmers-Maket-fm3',
                'Book-Farmers-Maket-fm4',
            ],
        },
        {
            id: 'book-4',
            book: true,
            image: 'Book-Lily-and-the-black-cat-4',
            title: 'Lily and the Black Cat',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                'Book-Lily-and-the-black-cat-1',
                'Book-Lily-and-the-black-cat-2',
                'Book-Lily-and-the-black-cat-3',
                'Book-Lily-and-the-black-cat-4',
                'Book-Lily-and-the-black-cat-5',
            ],
        },
        {
            id: 'illustrations',
            title: 'Illustrations',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                'Drawings-1',
                'Drawings-2',
                'Drawings-3',
                'Drawings-4',
                'Drawings-5',
                'Illustration--1',
                'Spiced-tea-1',
                'Spiced-tea-2',
                'Spiced-tea-3',
                'Summer-a',
                'Summer-b',
                'Summer-c',
                'morning-routine--a',
                'morning-routine--b',
            ],
        },
    ],
    images: [
        {
            id: 'Book-Farmers-Maket-cover',
            title: 'Book-Farmers-Maket-cover',
        },
        {
            id: 'Book-Farmers-Maket-fm1',
            title: 'Book-Farmers-Maket-fm1',
        },
        {
            id: 'Book-Farmers-Maket-fm2',
            title: 'Book-Farmers-Maket-fm2',
        },
        {
            id: 'Book-Farmers-Maket-fm3',
            title: 'Book-Farmers-Maket-fm3',
        },
        {
            id: 'Book-Farmers-Maket-fm4',
            title: 'Book-Farmers-Maket-fm4',
        },
        {
            id: 'Book-Flower-1',
            title: 'Book-Flower-1',
        },
        {
            id: 'Book-Flower-10',
            title: 'Book-Flower-10',
        },
        {
            id: 'Book-Flower-11',
            title: 'Book-Flower-11',
        },
        {
            id: 'Book-Flower-12',
            title: 'Book-Flower-12',
        },
        {
            id: 'Book-Flower-13',
            title: 'Book-Flower-13',
        },
        {
            id: 'Book-Flower-14',
            title: 'Book-Flower-14',
        },
        {
            id: 'Book-Flower-15',
            title: 'Book-Flower-15',
        },
        {
            id: 'Book-Flower-16',
            title: 'Book-Flower-16',
        },
        {
            id: 'Book-Flower-17',
            title: 'Book-Flower-17',
        },
        {
            id: 'Book-Flower-2',
            title: 'Book-Flower-2',
        },
        {
            id: 'Book-Flower-3',
            title: 'Book-Flower-3',
        },
        {
            id: 'Book-Flower-4',
            title: 'Book-Flower-4',
        },
        {
            id: 'Book-Flower-5',
            title: 'Book-Flower-5',
        },
        {
            id: 'Book-Flower-6',
            title: 'Book-Flower-6',
        },
        {
            id: 'Book-Flower-7',
            title: 'Book-Flower-7',
        },
        {
            id: 'Book-Flower-8',
            title: 'Book-Flower-8',
        },
        {
            id: 'Book-Flower-9',
            title: 'Book-Flower-9',
        },
        {
            id: 'Book-Flower-cover',
            title: 'Book-Flower-cover',
        },
        {
            id: 'Book-Lily-and-the-black-cat-1',
            title: 'Book-Lily-and-the',
        },
        {
            id: 'Book-Lily-and-the-black-cat-2',
            title: 'Book-Lily-and-the',
        },
        {
            id: 'Book-Lily-and-the-black-cat-3',
            title: 'Book-Lily-and-the',
        },
        {
            id: 'Book-Lily-and-the-black-cat-4',
            title: 'Book-Lily-and-the',
        },
        {
            id: 'Book-Lily-and-the-black-cat-5',
            title: 'Book-Lily-and-the',
        },
        {
            id: 'Book-Lost-In-The-Rain-cover',
            title: 'Book-Lost-In-The',
        },
        {
            id: 'Book-Lost-In-The-Rain-page1',
            title: 'Book-Lost-In-The',
        },
        {
            id: 'Book-Lost-In-The-Rain-page2',
            title: 'Book-Lost-In-The',
        },
        {
            id: 'Book-Lost-In-The-Rain-page3',
            title: 'Book-Lost-In-The',
        },
        {
            id: 'Book-Lost-In-The-Rain-page4',
            title: 'Book-Lost-In-The',
        },
        {
            id: 'Book-Lost-In-The-Rain-page5',
            title: 'Book-Lost-In-The',
        },
        {
            id: 'Drawings-1',
            title: 'Drawings-1',
        },
        {
            id: 'Drawings-2',
            title: 'Drawings-2',
        },
        {
            id: 'Drawings-3',
            title: 'Drawings-3',
        },
        {
            id: 'Drawings-4',
            title: 'Drawings-4',
        },
        {
            id: 'Drawings-5',
            title: 'Drawings-5',
        },
        {
            id: 'Illustration--1',
            title: 'Illustration--1',
        },
        {
            id: 'Spiced-tea-1',
            title: 'Spiced-tea-1',
        },
        {
            id: 'Spiced-tea-2',
            title: 'Spiced-tea-2',
        },
        {
            id: 'Spiced-tea-3',
            title: 'Spiced-tea-3',
        },
        {
            id: 'Summer-a',
            title: 'Summer-a',
        },
        {
            id: 'Summer-b',
            title: 'Summer-b',
        },
        {
            id: 'Summer-c',
            title: 'Summer-c',
        },
        {
            id: 'morning-routine--a',
            title: 'morning-routine--a',
        },
        {
            id: 'morning-routine--b',
            title: 'morning-routine--b',
        },
        {
            id: 'top-square-1',
            title: 'top-square-1',
        },
        {
            id: 'top-square-2',
            title: 'top-square-2',
        },
        {
            id: 'top-square-3',
            title: 'top-square-3',
        },
        {
            id: 'top-square-4',
            title: 'top-square-4',
        },
        {
            id: 'top-square-5',
            title: 'top-square-5',
        },
        {
            id: 'top-square-6',
            title: 'top-square-6',
        },
        {
            id: 'top-square-7',
            title: 'top-square-7',
        },
    ],
};
