const debug = false;

export const imageDirectory = 'images';
export const storageBucket = 'sasage-website-71713.appspot.com';
export const baseUrl = `https://storage.googleapis.com/${storageBucket}/${imageDirectory}/`;

export const widths = [320, 480, 640, 960, 1280];
export const heights = [240, 480, 720, 960];

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
        'top-square-2',
        'top-square-3',
        'top-square-4',
        'top-square-5',
        'top-square-6',
        'top-square-7',
        'top-square-1',
    ],
    collections: [
        {
            id: 'lost-in-the-rain',
            book: true,
            image: 'Book-Lost-In-The-Rain-cover',
            title: 'LOST IN THE RAIN',
            subtitle: "Children’s book",
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
            subtitle: 'Oracle Cards',
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
            title: 'Farmers Market',
            subtitle: 'The page of the magazine',
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
            title: 'Lilly and The Black Cat',
            subtitle: "Children's Book",
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
            images: [
                'Spiced-tea-1',
                'Spiced-tea-2',
                'Spiced-tea-3',
                'Summer-a',
                'Summer-b',
                'Summer-c',
                'morning-routine--a',
                'morning-routine--b',
                'Illustration--1',
                'Drawings-1',
                'Drawings-2',
                'Drawings-3',
                'Drawings-4',
                'Drawings-5',
            ],
        },
    ],
    images: {
        "Book-Lost-In-The-Rain-cover": {
            "id": "Book-Lost-In-The-Rain-cover",
            "format": "png",
            "width": 1280,
            "height": 1280
        },
        "Book-Lost-In-The-Rain-page1": {
            "id": "Book-Lost-In-The-Rain-page1",
            "format": "jpeg",
            "width": 2362,
            "height": 1240
        },
        "Book-Lost-In-The-Rain-page2": {
            "id": "Book-Lost-In-The-Rain-page2",
            "format": "jpeg",
            "width": 4724,
            "height": 2480
        },
        "Book-Lost-In-The-Rain-page3": {
            "id": "Book-Lost-In-The-Rain-page3",
            "format": "jpeg",
            "width": 2362,
            "height": 1240
        },
        "Book-Lost-In-The-Rain-page4": {
            "id": "Book-Lost-In-The-Rain-page4",
            "format": "jpeg",
            "width": 2362,
            "height": 1240
        },
        "Book-Lost-In-The-Rain-page5": {
            "id": "Book-Lost-In-The-Rain-page5",
            "format": "jpeg",
            "width": 2362,
            "height": 1240
        },
        "Book-Farmers-Maket-cover": {
            "id": "Book-Farmers-Maket-cover",
            "format": "jpeg",
            "width": 4000,
            "height": 2700
        },
        "Book-Farmers-Maket-fm1": {
            "id": "Book-Farmers-Maket-fm1",
            "format": "jpeg",
            "width": 1280,
            "height": 829
        },
        "Book-Farmers-Maket-fm2": {
            "id": "Book-Farmers-Maket-fm2",
            "format": "jpeg",
            "width": 5000,
            "height": 1875
        },
        "Book-Farmers-Maket-fm3": {
            "id": "Book-Farmers-Maket-fm3",
            "format": "jpeg",
            "width": 2048,
            "height": 2048
        },
        "Book-Farmers-Maket-fm4": {
            "id": "Book-Farmers-Maket-fm4",
            "format": "jpeg",
            "width": 2048,
            "height": 2048
        },
        "Drawings-1": {
            "id": "Drawings-1",
            "format": "jpeg",
            "width": 1024,
            "height": 1366
        },
        "Drawings-2": {
            "id": "Drawings-2",
            "format": "jpeg",
            "width": 1366,
            "height": 1024
        },
        "Drawings-3": {
            "id": "Drawings-3",
            "format": "jpeg",
            "width": 2048,
            "height": 2732
        },
        "Drawings-4": {
            "id": "Drawings-4",
            "format": "jpeg",
            "width": 2048,
            "height": 2732
        },
        "Drawings-5": {
            "id": "Drawings-5",
            "format": "jpeg",
            "width": 2048,
            "height": 2732
        },
        "Book-Flower-1": {
            "id": "Book-Flower-1",
            "format": "jpeg",
            "width": 989,
            "height": 1280
        },
        "Book-Flower-10": {
            "id": "Book-Flower-10",
            "format": "jpeg",
            "width": 989,
            "height": 1280
        },
        "Book-Flower-11": {
            "id": "Book-Flower-11",
            "format": "jpeg",
            "width": 3400,
            "height": 4400
        },
        "Book-Flower-12": {
            "id": "Book-Flower-12",
            "format": "jpeg",
            "width": 3400,
            "height": 4400
        },
        "Book-Flower-13": {
            "id": "Book-Flower-13",
            "format": "jpeg",
            "width": 989,
            "height": 1280
        },
        "Book-Flower-14": {
            "id": "Book-Flower-14",
            "format": "jpeg",
            "width": 3400,
            "height": 4400
        },
        "Book-Flower-15": {
            "id": "Book-Flower-15",
            "format": "jpeg",
            "width": 3400,
            "height": 4400
        },
        "Book-Flower-16": {
            "id": "Book-Flower-16",
            "format": "jpeg",
            "width": 3400,
            "height": 4400
        },
        "Book-Flower-17": {
            "id": "Book-Flower-17",
            "format": "jpeg",
            "width": 3400,
            "height": 4400
        },
        "Book-Flower-2": {
            "id": "Book-Flower-2",
            "format": "jpeg",
            "width": 989,
            "height": 1280
        },
        "Book-Flower-3": {
            "id": "Book-Flower-3",
            "format": "jpeg",
            "width": 3400,
            "height": 4400
        },
        "Book-Flower-4": {
            "id": "Book-Flower-4",
            "format": "jpeg",
            "width": 989,
            "height": 1280
        },
        "Book-Flower-5": {
            "id": "Book-Flower-5",
            "format": "jpeg",
            "width": 3400,
            "height": 4400
        },
        "Book-Flower-6": {
            "id": "Book-Flower-6",
            "format": "jpeg",
            "width": 3400,
            "height": 4400
        },
        "Book-Flower-7": {
            "id": "Book-Flower-7",
            "format": "jpeg",
            "width": 3400,
            "height": 4400
        },
        "Book-Flower-8": {
            "id": "Book-Flower-8",
            "format": "jpeg",
            "width": 3400,
            "height": 4400
        },
        "Book-Flower-9": {
            "id": "Book-Flower-9",
            "format": "jpeg",
            "width": 989,
            "height": 1280
        },
        "Book-Flower-cover": {
            "id": "Book-Flower-cover",
            "format": "jpeg",
            "width": 5000,
            "height": 5000
        },
        "Summer-a": {
            "id": "Summer-a",
            "format": "jpeg",
            "width": 2048,
            "height": 2732
        },
        "Summer-b": {
            "id": "Summer-b",
            "format": "jpeg",
            "width": 2048,
            "height": 2048
        },
        "Summer-c": {
            "id": "Summer-c",
            "format": "jpeg",
            "width": 2800,
            "height": 2800
        },
        "Book-Lily-and-the-black-cat-1": {
            "id": "Book-Lily-and-the-black-cat-1",
            "format": "jpeg",
            "width": 2000,
            "height": 2000
        },
        "Book-Lily-and-the-black-cat-2": {
            "id": "Book-Lily-and-the-black-cat-2",
            "format": "jpeg",
            "width": 2000,
            "height": 2000
        },
        "Book-Lily-and-the-black-cat-3": {
            "id": "Book-Lily-and-the-black-cat-3",
            "format": "jpeg",
            "width": 2000,
            "height": 2000
        },
        "Book-Lily-and-the-black-cat-4": {
            "id": "Book-Lily-and-the-black-cat-4",
            "format": "jpeg",
            "width": 2000,
            "height": 2000
        },
        "Book-Lily-and-the-black-cat-5": {
            "id": "Book-Lily-and-the-black-cat-5",
            "format": "jpeg",
            "width": 1280,
            "height": 480
        },
        "Illustration--1": {
            "id": "Illustration--1",
            "format": "jpeg",
            "width": 1280,
            "height": 480
        },
        "Spiced-tea-1": {
            "id": "Spiced-tea-1",
            "format": "jpeg",
            "width": 5000,
            "height": 1875
        },
        "Spiced-tea-2": {
            "id": "Spiced-tea-2",
            "format": "jpeg",
            "width": 2048,
            "height": 2732
        },
        "Spiced-tea-3": {
            "id": "Spiced-tea-3",
            "format": "jpeg",
            "width": 2048,
            "height": 2732
        },
        "morning-routine--a": {
            "id": "morning-routine--a",
            "format": "jpeg",
            "width": 2048,
            "height": 2048
        },
        "morning-routine--b": {
            "id": "morning-routine--b",
            "format": "jpeg",
            "width": 2048,
            "height": 2048
        },
        "top-square-1": {
            "id": "top-square-1",
            "format": "png",
            "width": 1280,
            "height": 1280
        },
        "top-square-2": {
            "id": "top-square-2",
            "format": "png",
            "width": 1280,
            "height": 1280
        },
        "top-square-3": {
            "id": "top-square-3",
            "format": "png",
            "width": 1280,
            "height": 1280
        },
        "top-square-4": {
            "id": "top-square-4",
            "format": "png",
            "width": 1280,
            "height": 1280
        },
        "top-square-5": {
            "id": "top-square-5",
            "format": "png",
            "width": 1280,
            "height": 1280
        },
        "top-square-6": {
            "id": "top-square-6",
            "format": "png",
            "width": 1280,
            "height": 1280
        },
        "top-square-7": {
            "id": "top-square-7",
            "format": "png",
            "width": 1280,
            "height": 1280
        }
    }
};
