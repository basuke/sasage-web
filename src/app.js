const debug = false;

export const email = 'sasage.mayumi@gmail.com';

export const imageDirectory = 'images';
export const storageBucket = 'sasage-website-71713.appspot.com';
export const baseUrl = `https://storage.googleapis.com/${storageBucket}/${imageDirectory}/`;
export const gtagId = 'UA-164370440-1';

export const widths = [320, 480, 640, 960, 1280];
export const heights = [240, 480, 720, 960];

export function tagPage(page_path) {
    gtag('config', gtagId, { page_path });
}

export function tagEvent(action, event_category, event_label = '', value = '') {
    gtag('event', action, { event_category, event_label, value });
}

export function imagePath(id, variation = '', ext = 'jpg') {
    return baseUrl + id + variation + '.' + ext;
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
    debug,
    topImages: [
        'top/1',
        'top/2',
        'top/3',
        'top/4',
        'top/5',
        'top/6',
        'top/7',
    ],
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
            image: "books/lost-in-the-rain/cover",
            title: 'LOST IN THE RAIN',
            subtitle: `Children’s book (2020)<br>
            <br>
            This work was selected for<br>
            <a class="underline text-red-700 hover:text-red-400" href="https://theaoi.com/wia/mayumi-sasage-lost-in-the-rain/">The AOI World Illustration Awards longlist</a>.`,
            images: [

                "books/lost-in-the-rain/page1",
                "books/lost-in-the-rain/page2",
                "books/lost-in-the-rain/page3",
                "books/lost-in-the-rain/page4",
                "books/lost-in-the-rain/page5",
            ],
        },
        {
            id: 'book-2',
            book: true,
            image: "books/flowers/cover",
            title: 'Flowers',
            subtitle: 'Oracle Cards (2019)',
            images: [
                "books/flowers/1",
                "books/flowers/2",
                "books/flowers/3",
                "books/flowers/4",
                "books/flowers/5",
                "books/flowers/6",
                "books/flowers/7",
                "books/flowers/8",
                "books/flowers/9",
                "books/flowers/10",
                "books/flowers/11",
                "books/flowers/12",
                "books/flowers/13",
                "books/flowers/14",
                "books/flowers/15",
            ],
        },
        {
            id: 'book-3',
            book: true,
            image: "books/farmersmaket/cover",
            title: 'Farmers Market',
            subtitle: 'The page of the magazine (2020)',
            images: [
                "books/farmersmaket/fm2",
                "books/farmersmaket/fm3",
                "books/farmersmaket/fm4",
                "books/farmersmaket/fm1",
            ],
        },
        {
            id: 'book-4',
            book: true,
            image: "books/lilly-and-the-black-cat/6",
            title: 'Lilly and The Black Cat',
            subtitle: "Children's Book (2019 - 20)",
            images: [
                "books/lilly-and-the-black-cat/1",
                "books/lilly-and-the-black-cat/2",
                "books/lilly-and-the-black-cat/3",
                "books/lilly-and-the-black-cat/4",
                "books/lilly-and-the-black-cat/5",
                "books/lilly-and-the-black-cat/cover",
            ],
        },
        {
            id: 'illustrations',
            title: 'Illustrations',
            images: [
                "spiced-tea/1",
                "spiced-tea/2",
                "spiced-tea/3",

                "summer/a",
                "summer/b",
                "summer/c",

                "morning-routine/a",
                "morning-routine/b",

                "illustration/1",

                'food/food-1',
                'food/food-2',
                'food/food-3',
                'food/food-4',
                'food/food-5',
                'food/food-6',
                'food/food-7',
                'food/food-8',
                'food/food-9',

                "drawings/1",
                "drawings/2",
                "drawings/3",
                "drawings/4",
                "drawings/5",
            ],
        },
    ],
    images: {
        "drawings/1": {
            "id": "drawings/1",
            "format": "jpeg",
            "width": 1024,
            "height": 1366,
            "title": "drawings/1"
        },
        "drawings/2": {
            "id": "drawings/2",
            "format": "jpeg",
            "width": 1366,
            "height": 1024,
            "title": "drawings/2"
        },
        "drawings/3": {
            "id": "drawings/3",
            "format": "jpeg",
            "width": 2048,
            "height": 2732,
            "title": "drawings/3"
        },
        "drawings/4": {
            "id": "drawings/4",
            "format": "jpeg",
            "width": 2048,
            "height": 2732,
            "title": "drawings/4"
        },
        "drawings/5": {
            "id": "drawings/5",
            "format": "jpeg",
            "width": 2048,
            "height": 2732,
            "title": "drawings/5"
        },
        "illustration/1": {
            "id": "illustration/1",
            "format": "jpeg",
            "width": 5000,
            "height": 1875,
            "title": "illustration/1"
        },
        "spiced-tea/1": {
            "id": "spiced-tea/1",
            "format": "jpeg",
            "width": 5000,
            "height": 1875,
            "title": "spiced-tea/1"
        },
        "spiced-tea/2": {
            "id": "spiced-tea/2",
            "format": "jpeg",
            "width": 2048,
            "height": 2732,
            "title": "spiced-tea/2"
        },
        "spiced-tea/3": {
            "id": "spiced-tea/3",
            "format": "jpeg",
            "width": 2048,
            "height": 2732,
            "title": "spiced-tea/3"
        },
        "summer/a": {
            "id": "summer/a",
            "format": "jpeg",
            "width": 2048,
            "height": 2732,
            "title": "summer/a"
        },
        "summer/b": {
            "id": "summer/b",
            "format": "jpeg",
            "width": 2048,
            "height": 2048,
            "title": "summer/b"
        },
        "summer/c": {
            "id": "summer/c",
            "format": "jpeg",
            "width": 2800,
            "height": 2800,
            "title": "summer/c"
        },
        "food/food-1": {
            "id": "food/food-1",
            "format": "jpeg",
            "width": 1200,
            "height": 1200,
            "title": "food/food-1"
        },
        "food/food-2": {
            "id": "food/food-2",
            "format": "jpeg",
            "width": 1200,
            "height": 1200,
            "title": "food/food-2"
        },
        "food/food-3": {
            "id": "food/food-3",
            "format": "jpeg",
            "width": 1200,
            "height": 1200,
            "title": "food/food-3"
        },
        "food/food-4": {
            "id": "food/food-4",
            "format": "jpeg",
            "width": 1200,
            "height": 1200,
            "title": "food/food-4"
        },
        "food/food-5": {
            "id": "food/food-5",
            "format": "jpeg",
            "width": 1200,
            "height": 1200,
            "title": "food/food-5"
        },
        "food/food-6": {
            "id": "food/food-6",
            "format": "jpeg",
            "width": 1200,
            "height": 1200,
            "title": "food/food-6"
        },
        "food/food-7": {
            "id": "food/food-7",
            "format": "jpeg",
            "width": 1200,
            "height": 1200,
            "title": "food/food-7"
        },
        "food/food-8": {
            "id": "food/food-8",
            "format": "jpeg",
            "width": 1200,
            "height": 1200,
            "title": "food/food-8"
        },
        "food/food-9": {
            "id": "food/food-9",
            "format": "jpeg",
            "width": 1200,
            "height": 1200,
            "title": "food/food-9"
        },
        "morning-routine/a": {
            "id": "morning-routine/a",
            "format": "jpeg",
            "width": 2048,
            "height": 2048,
            "title": "morning-routine/a"
        },
        "morning-routine/b": {
            "id": "morning-routine/b",
            "format": "jpeg",
            "width": 2048,
            "height": 2048,
            "title": "morning-routine/b"
        },
        "top/1": {
            "id": "top/1",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "top/1"
        },
        "top/2": {
            "id": "top/2",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "top/2"
        },
        "top/3": {
            "id": "top/3",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "top/3"
        },
        "top/4": {
            "id": "top/4",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "top/4"
        },
        "top/5": {
            "id": "top/5",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "top/5"
        },
        "top/6": {
            "id": "top/6",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "top/6"
        },
        "top/7": {
            "id": "top/7",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "top/7"
        },
        "top/wide-1": {
            "id": "top/wide-1",
            "format": "jpeg",
            "width": 2362,
            "height": 1240,
            "title": "top/wide-1"
        },
        "top/wide-2": {
            "id": "top/wide-2",
            "format": "jpeg",
            "width": 4724,
            "height": 2480,
            "title": "top/wide-2"
        },
        "top/wide-3": {
            "id": "top/wide-3",
            "format": "jpeg",
            "width": 5000,
            "height": 1875,
            "title": "top/wide-3"
        },
        "top/wide-4": {
            "id": "top/wide-4",
            "format": "jpeg",
            "width": 5000,
            "height": 1875,
            "title": "top/wide-4"
        },
        "top/wide-5": {
            "id": "top/wide-5",
            "format": "jpeg",
            "width": 5000,
            "height": 1875,
            "title": "top/wide-5"
        },
        "top/wide-6": {
            "id": "top/wide-6",
            "format": "jpeg",
            "width": 5000,
            "height": 1875,
            "title": "top/wide-6"
        },
        "top/wide-7": {
            "id": "top/wide-7",
            "format": "jpeg",
            "width": 5197,
            "height": 3366,
            "title": "top/wide-7"
        },
        "books/farmersmaket/cover": {
            "id": "books/farmersmaket/cover",
            "format": "jpeg",
            "width": 4000,
            "height": 2700,
            "title": "books/farmersmaket/cover"
        },
        "books/farmersmaket/fm1": {
            "id": "books/farmersmaket/fm1",
            "format": "jpeg",
            "width": 5197,
            "height": 3366,
            "title": "books/farmersmaket/fm1"
        },
        "books/farmersmaket/fm2": {
            "id": "books/farmersmaket/fm2",
            "format": "jpeg",
            "width": 5000,
            "height": 1875,
            "title": "books/farmersmaket/fm2"
        },
        "books/farmersmaket/fm3": {
            "id": "books/farmersmaket/fm3",
            "format": "jpeg",
            "width": 2048,
            "height": 2048,
            "title": "books/farmersmaket/fm3"
        },
        "books/farmersmaket/fm4": {
            "id": "books/farmersmaket/fm4",
            "format": "jpeg",
            "width": 2048,
            "height": 2048,
            "title": "books/farmersmaket/fm4"
        },
        "books/flowers/1": {
            "id": "books/flowers/1",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/1"
        },
        "books/flowers/10": {
            "id": "books/flowers/10",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/10"
        },
        "books/flowers/11": {
            "id": "books/flowers/11",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/11"
        },
        "books/flowers/12": {
            "id": "books/flowers/12",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/12"
        },
        "books/flowers/13": {
            "id": "books/flowers/13",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/13"
        },
        "books/flowers/14": {
            "id": "books/flowers/14",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/14"
        },
        "books/flowers/15": {
            "id": "books/flowers/15",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/15"
        },
        "books/flowers/2": {
            "id": "books/flowers/2",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/2"
        },
        "books/flowers/3": {
            "id": "books/flowers/3",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/3"
        },
        "books/flowers/4": {
            "id": "books/flowers/4",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/4"
        },
        "books/flowers/5": {
            "id": "books/flowers/5",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/5"
        },
        "books/flowers/6": {
            "id": "books/flowers/6",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/6"
        },
        "books/flowers/7": {
            "id": "books/flowers/7",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/7"
        },
        "books/flowers/8": {
            "id": "books/flowers/8",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/8"
        },
        "books/flowers/9": {
            "id": "books/flowers/9",
            "format": "jpeg",
            "width": 3400,
            "height": 4400,
            "title": "books/flowers/9"
        },
        "books/flowers/cover": {
            "id": "books/flowers/cover",
            "format": "jpeg",
            "width": 5000,
            "height": 5000,
            "title": "books/flowers/cover"
        },
        "books/lilly-and-the-black-cat/1": {
            "id": "books/lilly-and-the-black-cat/1",
            "format": "jpeg",
            "width": 5000,
            "height": 1875,
            "title": "books/lilly-and-the-black-cat/1"
        },
        "books/lilly-and-the-black-cat/2": {
            "id": "books/lilly-and-the-black-cat/2",
            "format": "jpeg",
            "width": 2000,
            "height": 2000,
            "title": "books/lilly-and-the-black-cat/2"
        },
        "books/lilly-and-the-black-cat/3": {
            "id": "books/lilly-and-the-black-cat/3",
            "format": "jpeg",
            "width": 2000,
            "height": 2000,
            "title": "books/lilly-and-the-black-cat/3"
        },
        "books/lilly-and-the-black-cat/4": {
            "id": "books/lilly-and-the-black-cat/4",
            "format": "jpeg",
            "width": 2000,
            "height": 2000,
            "title": "books/lilly-and-the-black-cat/4"
        },
        "books/lilly-and-the-black-cat/5": {
            "id": "books/lilly-and-the-black-cat/5",
            "format": "jpeg",
            "width": 2000,
            "height": 2000,
            "title": "books/lilly-and-the-black-cat/5"
        },
        "books/lilly-and-the-black-cat/6": {
            "id": "books/lilly-and-the-black-cat/6",
            "format": "jpeg",
            "width": 2048,
            "height": 2048,
            "title": "books/lilly-and-the-black-cat/6"
        },
        "books/lilly-and-the-black-cat/cover": {
            "id": "books/lilly-and-the-black-cat/cover",
            "format": "jpeg",
            "width": 4000,
            "height": 2667,
            "title": "books/lilly-and-the-black-cat/cover"
        },
        "books/lost-in-the-rain/cover": {
            "id": "books/lost-in-the-rain/cover",
            "format": "png",
            "width": 1280,
            "height": 1280,
            "title": "books/lost-in-the-rain/cover"
        },
        "books/lost-in-the-rain/page1": {
            "id": "books/lost-in-the-rain/page1",
            "format": "jpeg",
            "width": 2362,
            "height": 1240,
            "title": "books/lost-in-the-rain/page1"
        },
        "books/lost-in-the-rain/page2": {
            "id": "books/lost-in-the-rain/page2",
            "format": "jpeg",
            "width": 4724,
            "height": 2480,
            "title": "books/lost-in-the-rain/page2"
        },
        "books/lost-in-the-rain/page3": {
            "id": "books/lost-in-the-rain/page3",
            "format": "jpeg",
            "width": 2362,
            "height": 1240,
            "title": "books/lost-in-the-rain/page3"
        },
        "books/lost-in-the-rain/page4": {
            "id": "books/lost-in-the-rain/page4",
            "format": "jpeg",
            "width": 2362,
            "height": 1240,
            "title": "books/lost-in-the-rain/page4"
        },
        "books/lost-in-the-rain/page5": {
            "id": "books/lost-in-the-rain/page5",
            "format": "jpeg",
            "width": 2362,
            "height": 1240,
            "title": "books/lost-in-the-rain/page5"
        }
    }
};
