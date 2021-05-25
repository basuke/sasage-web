const baseUrl = 'https://storage.googleapis.com/sasage-website-71713.appspot.com/images/';

export function imagePath(id, variation = '') {
    return baseUrl + id + variation + '.jpg';
}

export function findCollection(collections, id) {
    return collections.find(collection => collection.id === id);
}

export function findImage(images, id) {
    return images[id];
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
    images: {
        "images-cover-wide": {
            "id": "images-cover-wide",
            "format": "jpeg",
            "width": 2673,
            "height": 1485,
            "title": "images-cover-wide"
        },
        "images-cover": {
            "id": "images-cover",
            "format": "jpeg",
            "width": 1280,
            "height": 948,
            "title": "images-cover"
        },
        "renew-march-2021-picnic": {
            "id": "renew-march-2021-picnic",
            "format": "jpeg",
            "width": 1280,
            "height": 480,
            "title": "renew-march-2021-picnic"
        },
        "images-black-and-white-bw1": {
            "id": "images-black-and-white-bw1",
            "format": "jpeg",
            "width": 2700,
            "height": 2000,
            "title": "images-black-and-white-bw1"
        },
        "images-black-and-white-bw2": {
            "id": "images-black-and-white-bw2",
            "format": "jpeg",
            "width": 2000,
            "height": 2700,
            "title": "images-black-and-white-bw2"
        },
        "images-black-and-white-bw3": {
            "id": "images-black-and-white-bw3",
            "format": "jpeg",
            "width": 2000,
            "height": 2700,
            "title": "images-black-and-white-bw3"
        },
        "images-foods-1": {
            "id": "images-foods-1",
            "format": "jpeg",
            "width": 1280,
            "height": 480,
            "title": "images-foods-1"
        },
        "images-foods-2": {
            "id": "images-foods-2",
            "format": "jpeg",
            "width": 1280,
            "height": 480,
            "title": "images-foods-2"
        },
        "images-foods-3": {
            "id": "images-foods-3",
            "format": "jpeg",
            "width": 1280,
            "height": 480,
            "title": "images-foods-3"
        },
        "images-foods-4": {
            "id": "images-foods-4",
            "format": "jpeg",
            "width": 1280,
            "height": 829,
            "title": "images-foods-4"
        },
        "images-foods-5": {
            "id": "images-foods-5",
            "format": "jpeg",
            "width": 959,
            "height": 1280,
            "title": "images-foods-5"
        },
        "images-foods-6": {
            "id": "images-foods-6",
            "format": "jpeg",
            "width": 959,
            "height": 1280,
            "title": "images-foods-6"
        },
        "renew-march-2021-flower-1": {
            "id": "renew-march-2021-flower-1",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "renew-march-2021-flower-1"
        },
        "renew-march-2021-flower-2": {
            "id": "renew-march-2021-flower-2",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "renew-march-2021-flower-2"
        },
        "renew-march-2021-flower-3": {
            "id": "renew-march-2021-flower-3",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "renew-march-2021-flower-3"
        },
        "renew-march-2021-flower-4": {
            "id": "renew-march-2021-flower-4",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "renew-march-2021-flower-4"
        },
        "renew-march-2021-flower-5": {
            "id": "renew-march-2021-flower-5",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "renew-march-2021-flower-5"
        },
        "renew-march-2021-flower-6": {
            "id": "renew-march-2021-flower-6",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "renew-march-2021-flower-6"
        },
        "renew-march-2021-flower-7": {
            "id": "renew-march-2021-flower-7",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "renew-march-2021-flower-7"
        },
        "images-lilliy-and-cat-lilly1": {
            "id": "images-lilliy-and-cat-lilly1",
            "format": "jpeg",
            "width": 1280,
            "height": 1280,
            "title": "images-lilliy-and-cat-lilly1"
        },
        "images-lilliy-and-cat-lilly2": {
            "id": "images-lilliy-and-cat-lilly2",
            "format": "jpeg",
            "width": 1280,
            "height": 1280,
            "title": "images-lilliy-and-cat-lilly2"
        },
        "images-lilliy-and-cat-lilly3": {
            "id": "images-lilliy-and-cat-lilly3",
            "format": "jpeg",
            "width": 1280,
            "height": 1280,
            "title": "images-lilliy-and-cat-lilly3"
        },
        "images-lilliy-and-cat-lilly4": {
            "id": "images-lilliy-and-cat-lilly4",
            "format": "jpeg",
            "width": 1280,
            "height": 1280,
            "title": "images-lilliy-and-cat-lilly4"
        },
        "images-lilliy-and-cat-lilly5": {
            "id": "images-lilliy-and-cat-lilly5",
            "format": "jpeg",
            "width": 1280,
            "height": 1280,
            "title": "images-lilliy-and-cat-lilly5"
        },
        "images-lilliy-and-cat-lilly6": {
            "id": "images-lilliy-and-cat-lilly6",
            "format": "jpeg",
            "width": 1280,
            "height": 1280,
            "title": "images-lilliy-and-cat-lilly6"
        },
        "images-lilliy-and-cat-lilly7": {
            "id": "images-lilliy-and-cat-lilly7",
            "format": "jpeg",
            "width": 1280,
            "height": 480,
            "title": "images-lilliy-and-cat-lilly7"
        },
        "images-flowers-1": {
            "id": "images-flowers-1",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "images-flowers-1"
        },
        "images-flowers-2": {
            "id": "images-flowers-2",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "images-flowers-2"
        },
        "images-flowers-3": {
            "id": "images-flowers-3",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "images-flowers-3"
        },
        "images-flowers-4": {
            "id": "images-flowers-4",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "images-flowers-4"
        },
        "images-flowers-5": {
            "id": "images-flowers-5",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "images-flowers-5"
        },
        "images-flowers-6": {
            "id": "images-flowers-6",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "images-flowers-6"
        },
        "images-flowers-7": {
            "id": "images-flowers-7",
            "format": "jpeg",
            "width": 989,
            "height": 1280,
            "title": "images-flowers-7"
        },
        "renew-march-2021-foods-1": {
            "id": "renew-march-2021-foods-1",
            "format": "jpeg",
            "width": 1280,
            "height": 480,
            "title": "renew-march-2021-foods-1"
        },
        "renew-march-2021-foods-2": {
            "id": "renew-march-2021-foods-2",
            "format": "jpeg",
            "width": 1280,
            "height": 480,
            "title": "renew-march-2021-foods-2"
        },
        "renew-march-2021-foods-3": {
            "id": "renew-march-2021-foods-3",
            "format": "jpeg",
            "width": 1280,
            "height": 480,
            "title": "renew-march-2021-foods-3"
        },
        "renew-march-2021-foods-4": {
            "id": "renew-march-2021-foods-4",
            "format": "jpeg",
            "width": 1280,
            "height": 829,
            "title": "renew-march-2021-foods-4"
        },
        "renew-march-2021-foods-5": {
            "id": "renew-march-2021-foods-5",
            "format": "jpeg",
            "width": 959,
            "height": 1280,
            "title": "renew-march-2021-foods-5"
        },
        "renew-march-2021-foods-6": {
            "id": "renew-march-2021-foods-6",
            "format": "jpeg",
            "width": 959,
            "height": 1280,
            "title": "renew-march-2021-foods-6"
        },
        "renew-march-2021-picturebook-0": {
            "id": "renew-march-2021-picturebook-0",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "renew-march-2021-picturebook-0"
        },
        "renew-march-2021-picturebook-1": {
            "id": "renew-march-2021-picturebook-1",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "renew-march-2021-picturebook-1"
        },
        "renew-march-2021-picturebook-2": {
            "id": "renew-march-2021-picturebook-2",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "renew-march-2021-picturebook-2"
        },
        "renew-march-2021-picturebook-3": {
            "id": "renew-march-2021-picturebook-3",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "renew-march-2021-picturebook-3"
        },
        "renew-march-2021-picturebook-4": {
            "id": "renew-march-2021-picturebook-4",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "renew-march-2021-picturebook-4"
        },
        "renew-march-2021-picturebook-8": {
            "id": "renew-march-2021-picturebook-8",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "renew-march-2021-picturebook-8"
        },
        "renew-march-2021-thumbnails-1": {
            "id": "renew-march-2021-thumbnails-1",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "renew-march-2021-thumbnails-1"
        },
        "renew-march-2021-thumbnails-12": {
            "id": "renew-march-2021-thumbnails-12",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "renew-march-2021-thumbnails-12"
        },
        "renew-march-2021-thumbnails-5": {
            "id": "renew-march-2021-thumbnails-5",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "renew-march-2021-thumbnails-5"
        },
        "renew-march-2021-thumbnails-6": {
            "id": "renew-march-2021-thumbnails-6",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "renew-march-2021-thumbnails-6"
        },
        "renew-march-2021-thumbnails-7": {
            "id": "renew-march-2021-thumbnails-7",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "renew-march-2021-thumbnails-7"
        }
    }
};
