import { globby } from 'globby';
import fs from 'fs';
import sharp from 'sharp';
import minimist from 'minimist';
import fetch, { FormData, fileFromSync } from 'node-fetch';
import { sha1File } from 'sha1-file';
import 'dotenv/config';

// Cloudflare
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN;
const apiEndpoint = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`;

// images root directory
const directory = './images';
const indexPath = './src/images.json';

const args = minimist(process.argv.slice(2), {
    alias: { n: 'dry-run', v: 'verbose' },
    boolean: ['dry-run'],
    boolean: ['verbose'],
});
const dryRun = args['dry-run'];
const verbose = args['verbose'];

function normalizeSource(source) {
    if (source[0] !== '.') {
        source = './' + source;
    }
    return source.replace(directory + '/', '');
}

function pathToHash(source) {
    return normalizeSource(source)
        .replace(/\.[a-zA-Z0-9]+$/, '') // remove extension
        .replace(/[^0-9A-Za-z._/-]/g, '-'); // escape chars
}

async function imageInfo(source) {
    const { format, width, height } = await sharp(source).metadata();
    return { format, width, height };
}

async function upload(source, id) {
    // curl -X POST \
    // "https://api.cloudflare.com/client/v4/accounts/055b10d55440049a7e1b5964646f7d2c/images/v1" \
    // -H "Authorization: Bearer ORAdI1AWxoqPSQvCudztoql-thhz-sSkZsyxpiFn" \
    // -F file=@./images/profile.jpg

    const form = new FormData();
    form.append('id', id);
    form.append('file', fileFromSync(source));

    if (verbose) {
        console.log(`uploading ${source}`);
    }

    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
        },
        body: form,
    });
    const { success, errors } = await response.json();
    if (success) {
        console.log(`uploaded ${source}`);
    } else {
        console.error(`failed to upload ${source}`, errors);
    }
}

async function deleteImage(id) {
    // curl -X DELETE \
    // https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1/{image_id} \
    // -H "Authorization: Bearer <API_TOKEN>"

    if (verbose) {
        console.log(`deleting ${id}`);
    }

    const response = await fetch(`${apiEndpoint}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
        },
    });
    const { success, errors } = await response.json();
    if (success) {
        console.log(`deleted ${id}`);
    } else {
        console.error(`failed to delete ${source}`, errors);
    }
}

function readImages() {
    try {
        return JSON.parse(fs.readFileSync(indexPath));
    } catch (e) {
        if (verbose) {
            console.log(`No ${indexPath} found, creating new one.`);
        }
        return {};
    }
}

(async () => {
    const files = await globby([directory + '/**/*.{jpg,png}'], {});
    const map = readImages();

    const added = [];
    const updated = [];
    const removed = [];
    const skipped = [];

    for (const source of files) {
        const key = pathToHash(source);

        const info = {
            source,
            id: key,
            title: key,
            sha1: await sha1File(source),
            ...(await imageInfo(source)),
        };

        let update = false;

        if (!map[key]) {
            added.push(source);
        } else if (map[key].sha1 !== info.sha1) {
            updated.push(source);
            update = true;
        } else {
            if (verbose) {
                console.log(`skipping ${source}`);
            }
            skipped.push(source);
            continue;
        }

        if (!dryRun) {
            if (update) {
                await deleteImage(key);
            }
            await upload(source, key);
        }

        map[key] = info;
    }

    if (dryRun) {
        console.log(JSON.stringify(map, null, '  '));
    } else {
        fs.writeFileSync(indexPath, JSON.stringify(map, null, '  '));
        console.log('written images.json');
    }
})();
