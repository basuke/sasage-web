import { globby } from 'globby';
import fs from 'fs';
import sharp from 'sharp';
import minimist from 'minimist';
import fetch, { FormData, fileFromSync } from 'node-fetch';
import { sha1File } from 'sha1-file';
import 'dotenv/config'

// Cloudflare
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN;
const uploadURL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`;

// images root directory
const defaultdirectory = './images';

const indexPath = './src/images.json';

// const widths = [320, 480, 640, 960, 1280];
// const heights = [240, 480, 720, 960];

// const resizeOptions = [
//     ...widths.map((width) => ({ width })),
//     ...heights.map((height) => ({ height })),
//     ...[480, 960].map((size) => ({ width: size, height: size })),
//     ...[960, 1280].map((size) => ({ width: size, height: size / 2 })),
//     ...heights.map((height) => ({ width: (height / 3) * 4, height })),
// ];

const args = minimist(process.argv.slice(2), {
    alias: { n: 'dry-run', },
    boolean: ['dry-run'],
});
const dryRun = args['dry-run'];
const directory = args._.length ? args._[0] : defaultdirectory;

function pathToKey(source) {
    if (source[0] !== '.') {
        source = './' + source
    }
    return source.replace(defaultdirectory + '/', '');
}

function pathToHash(source) {
    return pathToKey(source)
        .replace(/\.[a-zA-Z0-9]+$/, '') // remove extension
        .replace(/[^0-9A-Za-z._/-]/g, '-'); // escape chars
}

async function upload(source, id) {
    // curl -X POST \
    // "https://api.cloudflare.com/client/v4/accounts/055b10d55440049a7e1b5964646f7d2c/images/v1" \
    // -H "Authorization: Bearer ORAdI1AWxoqPSQvCudztoql-thhz-sSkZsyxpiFn" \
    // -F file=@./images/profile.jpg

    const form = new FormData();
    form.append('id', id);
    form.append('file', fileFromSync(source));

    console.log(uploadURL, API_TOKEN, form);
    const response = await fetch(uploadURL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: form
    });
    const data = await response.json();
    console.log(data);
}

async function saveJpegImage(hash, source) {
    const { format, width, height } = await sharp(source).metadata();

    if (!dryRun) {
        await upload(source, hash);
    }

    return { id: hash, format, width, height, title: hash, source };
}

function readImages() {
    try {
        return JSON.parse(fs.readFileSync(indexPath));
    } catch (e) {
        return {};
    }
}

(async () => {
    const savedImages = readImages();

    const files = await globby([directory + '/**/*.{jpg,png}'], {});
    const map = {};

    for (const source of files) {
        const key = pathToHash(source);

        const info = await saveJpegImage(key, source);
        info.sha1 = await sha1File(source);
        map[key] = info;
    }

    if (dryRun) {
        console.log(JSON.stringify(map, null, '  '));
    } else {
        fs.writeFileSync(indexPath, JSON.stringify(map, null, '  '));
        console.log('written images.json');
    }
})();
