export function imagePath(image) {
    return '/build/images/' + image.name + '.jpg';
}

export function findImage(name) {
    for (const kind in data) {
        for (const image of data[kind]) {
            if (image.name === name) {
                return image;
            }
        }
    }
    return null;
}

export const data = {
    topImages: [
        { name: 'renew-march-2021-picnic.jpg', },
    ],
    books: [
        {
            name: 'images-black-and-white-bw1.jpg',
            title: 'Sample Book 1',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
            ],
        },
        {
            name: 'images-black-and-white-bw2.jpg',
            title: 'Sample Book 1',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
            ],
        },
        {
            name: 'images-black-and-white-bw3.jpg',
            title: 'Sample Book 1',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
            ],
        },
        {
            name: 'images-black-and-white-bw1.jpg',
            title: 'Sample Book 1',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
                { name: 'images-black-and-white-bw1.jpg' },
            ],
        },
    ],
    illustrations: [
        {
            name: 'images-flowers-1.jpg',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            name: 'images-flowers-2.jpg',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            name: 'images-flowers-3.jpg',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            name: 'images-flowers-4.jpg',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            name: 'images-flowers-5.jpg',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            name: 'images-flowers-6.jpg',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            name: 'images-flowers-7.jpg',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            name: 'images-lilliy-and-cat-lilly1.jpg',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
    ],
};
