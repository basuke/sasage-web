export function imagePath(id, variation = '') {
    return '/build/images/' + id + variation + '.jpg';
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
        'renew-march-2021-picnic',
    ],
    collections: [
        {
            id: 'book-1',
            book: true,
            image: 'images-black-and-white-bw1',
            title: 'Sample Book 1',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            'title-ja': 'サンプルの本',
            'description-ja': `最近はすっかり天気も寒くなってきましたね。いかがおすごしでしょうか。なんてね。
            `,
            images: [
                'images-black-and-white-bw1',
                'images-black-and-white-bw2',
                'images-black-and-white-bw3',
                'images-cover',
                'images-cover-wide',
            ],
        },
        {
            id: 'book-2',
            book: true,
            image: 'renew-march-2021-foods-1',
            title: 'Sample Book 2',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                'renew-march-2021-foods-1',
                'renew-march-2021-foods-2',
                'renew-march-2021-foods-3',
            ],
        },
        {
            id: 'book-3',
            book: true,
            image: 'renew-march-2021-foods-4',
            title: 'Sample Book 3',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                'renew-march-2021-foods-4',
                'renew-march-2021-foods-5',
                'renew-march-2021-foods-6',
                'renew-march-2021-picnic',
            ],
        },
        {
            id: 'book-4',
            book: true,
            image: 'renew-march-2021-flower-1',
            title: 'Sample Book 4',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                'renew-march-2021-flower-1',
                'renew-march-2021-flower-2',
                'renew-march-2021-flower-3',
                'renew-march-2021-flower-4',
                'renew-march-2021-flower-5',
                'renew-march-2021-flower-6',
                'renew-march-2021-flower-7',
            ],
        },
        {
            id: 'food',
            image: 'images-foods-1',
            title: 'Food',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                'images-foods-1',
                'images-foods-2',
                'images-foods-3',
                'images-foods-4',
                'images-foods-5',
                'images-foods-6',
            ],
        },
        {
            id: 'flower',
            image: 'images-flowers-1',
            title: 'Flower',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                'images-flowers-1',
                'images-flowers-2',
                'images-flowers-3',
                'images-flowers-4',
                'images-flowers-5',
                'images-flowers-6',
                'images-flowers-7',
            ],
        },
        {
            id: 'cat-and-lilly',
            image: 'images-lilliy-and-cat-lilly1',
            title: 'Cat and Lilly',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                'images-lilliy-and-cat-lilly1',
                'images-lilliy-and-cat-lilly2',
                'images-lilliy-and-cat-lilly3',
                'images-lilliy-and-cat-lilly4',
                'images-lilliy-and-cat-lilly5',
                'images-lilliy-and-cat-lilly6',
                'images-lilliy-and-cat-lilly7',
            ],
        },
    ],
    images: [
        {
            id: 'images-black-and-white-bw1',
            title: 'images-black-and-white-bw1',
        },
        {
            id: 'images-black-and-white-bw2',
            title: 'images-black-and-white-bw2',
        },
        {
            id: 'images-black-and-white-bw3',
            title: 'images-black-and-white-bw3',
        },
        {
            id: 'images-cover',
            title: 'images-cover',
        },
        {
            id: 'images-cover-wide',
            title: 'images-cover-wide',
        },
        {
            id: 'images-flowers-1',
            title: 'images-flowers-1',
        },
        {
            id: 'images-flowers-2',
            title: 'images-flowers-2',
        },
        {
            id: 'images-flowers-3',
            title: 'images-flowers-3',
        },
        {
            id: 'images-flowers-4',
            title: 'images-flowers-4',
        },
        {
            id: 'images-flowers-5',
            title: 'images-flowers-5',
        },
        {
            id: 'images-flowers-6',
            title: 'images-flowers-6',
        },
        {
            id: 'images-flowers-7',
            title: 'images-flowers-7',
        },
        {
            id: 'images-foods-1',
            title: 'images-foods-1',
        },
        {
            id: 'images-foods-2',
            title: 'images-foods-2',
        },
        {
            id: 'images-foods-3',
            title: 'images-foods-3',
        },
        {
            id: 'images-foods-4',
            title: 'images-foods-4',
        },
        {
            id: 'images-foods-5',
            title: 'images-foods-5',
        },
        {
            id: 'images-foods-6',
            title: 'images-foods-6',
        },
        {
            id: 'images-lilliy-and-cat-lilly1',
            title: 'images-lilliy-and-cat-lilly1',
        },
        {
            id: 'images-lilliy-and-cat-lilly2',
            title: 'images-lilliy-and-cat-lilly2',
        },
        {
            id: 'images-lilliy-and-cat-lilly3',
            title: 'images-lilliy-and-cat-lilly3',
        },
        {
            id: 'images-lilliy-and-cat-lilly4',
            title: 'images-lilliy-and-cat-lilly4',
        },
        {
            id: 'images-lilliy-and-cat-lilly5',
            title: 'images-lilliy-and-cat-lilly5',
        },
        {
            id: 'images-lilliy-and-cat-lilly6',
            title: 'images-lilliy-and-cat-lilly6',
        },
        {
            id: 'images-lilliy-and-cat-lilly7',
            title: 'images-lilliy-and-cat-lilly7',
        },
        {
            id: 'renew-march-2021-flower-1',
            title: 'renew-march-2021-flower-1',
        },
        {
            id: 'renew-march-2021-flower-2',
            title: 'renew-march-2021-flower-2',
        },
        {
            id: 'renew-march-2021-flower-3',
            title: 'renew-march-2021-flower-3',
        },
        {
            id: 'renew-march-2021-flower-4',
            title: 'renew-march-2021-flower-4',
        },
        {
            id: 'renew-march-2021-flower-5',
            title: 'renew-march-2021-flower-5',
        },
        {
            id: 'renew-march-2021-flower-6',
            title: 'renew-march-2021-flower-6',
        },
        {
            id: 'renew-march-2021-flower-7',
            title: 'renew-march-2021-flower-7',
        },
        {
            id: 'renew-march-2021-foods-1',
            title: 'renew-march-2021-foods-1',
        },
        {
            id: 'renew-march-2021-foods-2',
            title: 'renew-march-2021-foods-2',
        },
        {
            id: 'renew-march-2021-foods-3',
            title: 'renew-march-2021-foods-3',
        },
        {
            id: 'renew-march-2021-foods-4',
            title: 'renew-march-2021-foods-4',
        },
        {
            id: 'renew-march-2021-foods-5',
            title: 'renew-march-2021-foods-5',
        },
        {
            id: 'renew-march-2021-foods-6',
            title: 'renew-march-2021-foods-6',
        },
        {
            id: 'renew-march-2021-picnic',
            title: 'renew-march-2021-picnic',
        }
    ],
};
