const globby = require('globby');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const sourceDirectory = 'public/images';
const destinationDirectory = 'public/build/images';
const indexPath = './public/build/images.json';

function suffix(option) {
    let suffix = '';
    if ('width' in option) suffix += `-w${option.width}`;
    if ('height' in option) suffix += `-h${option.height}`;
    return suffix;
}

function pathToKey(source) {
    return source.replace('./public/', '');
}

function pathToHash(source) {
    return pathToKey(source)
        .replace(/\.[a-zA-Z0-9]+$/, '')    // remove extension
        .replace(/[^0-9A-Za-z._-]/g, '-'); // escape chars
}

async function saveResizedJpeg(source, option) {
    const hash = pathToHash(source);
    const filePath = path.join(destinationDirectory, `${hash}${suffix(option)}.jpg`);
    await sharp(source)
        .resize(option)
        .jpeg({mozjpeg: true})
        .toFile(filePath);
}

async function saveResizedWebp(source, option) {
    const hash = pathToHash(source);
    const filePath = path.join(destinationDirectory, `${hash}${suffix(option)}.webp`);
    await sharp(source)
        .resize(option)
        .webp({quality: 60})
        .toFile(filePath);
}

async function saveJpegImage(source) {
    const hash = pathToHash(source);
    const {format, width, height} = await sharp(source).metadata();

    try {
        await saveResizedJpeg(source, {});

        await saveResizedJpeg(source, {width: 256});
        await saveResizedJpeg(source, {width: 512});
        await saveResizedJpeg(source, {width: 1024});

        await saveResizedJpeg(source, {width: 256, height: 256});
        await saveResizedJpeg(source, {width: 512, height: 512});
        await saveResizedJpeg(source, {width: 1024, height: 1024});

        await saveResizedWebp(source, {});

        await saveResizedWebp(source, {width: 256});
        await saveResizedWebp(source, {width: 512});
        await saveResizedWebp(source, {width: 1024});

        await saveResizedWebp(source, {width: 256, height: 256});
        await saveResizedWebp(source, {width: 512, height: 512});
        await saveResizedWebp(source, {width: 1024, height: 1024});
    } catch (e) {
        console.error(e);
    }

    return {format, width, height, hash, source: pathToKey(source)};
}

(async () => {
    const files = await globby(['./public/**/*.jpg'], { });
    const map = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath)) : {};

    for (const source of files) {
        if (source.indexOf('/build/') >= 0) continue;

        const key = pathToKey(source);
        if (key in map) continue;

        const info = await saveJpegImage(source);
        map[key] = info;
        map[source] = info;
        console.log(source);
    }

    fs.writeFileSync(indexPath, JSON.stringify(map, null, '  '));
    console.log("written images.json");
})();
