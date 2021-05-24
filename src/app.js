export function imagePath(image, variation = '') {
    return '/build/images/' + image.name + variation + '.jpg';
}

export function findImage(images, name) {
    for (const image of images) {
        if (image.name === name) {
            return image;
        }
    }
    return null;
}

export const data = {
    topImages: [
        { name: 'renew-march-2021-picnic', },
    ],
    images: [
        {
            category: 'books',
            name: 'images-black-and-white-bw1',
            title: 'Sample Book 1',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            'title-ja': 'サンプルの本',
            'description-ja': `最近はすっかり天気も寒くなってきましたね。いかがおすごしでしょうか。なんてね。
            `,
            images: [
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
            ],
        },
        {
            category: 'books',
            name: 'images-black-and-white-bw2',
            title: 'Sample Book 1',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
            ],
        },
        {
            category: 'books',
            name: 'images-black-and-white-bw3',
            title: 'Sample Book 1',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
            ],
        },
        {
            category: 'books',
            name: 'images-black-and-white-bw1',
            title: 'Sample Book 1',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
            images: [
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
                { name: 'images-black-and-white-bw1' },
            ],
        },
        {
            category: "illustrations",
            name: 'images-flowers-1',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            category: "illustrations",
            name: 'images-flowers-2',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            category: "illustrations",
            name: 'images-flowers-3',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            category: "illustrations",
            name: 'images-flowers-4',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            category: "illustrations",
            name: 'images-flowers-5',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            category: "illustrations",
            name: 'images-flowers-6',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            category: "illustrations",
            name: 'images-flowers-7',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
        {
            category: "illustrations",
            name: 'images-lilliy-and-cat-lilly1',
            description: `She opened up her third bottle of wine of the night.
            She did a happy dance because all of the socks from the dryer matched.
            There was coal in his stocking and he was thrilled.
            `,
        },
    ],
};
