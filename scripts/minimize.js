const globby = require('globby');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const sourceFiles = './public/**/*.jpg';
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
    sharp(source)
        .resize(option)
        .jpeg({mozjpeg: true})
        .toFile(filePath);
}

async function saveResizedWebp(source, option) {
    const hash = pathToHash(source);
    const filePath = path.join(destinationDirectory, `${hash}${suffix(option)}.webp`);
    sharp(source)
        .resize(option)
        .webp({quality: 60})
        .toFile(filePath);
}

async function saveJpegImage(source) {
    const hash = pathToHash(source);
    const {format, width, height} = await sharp(source).metadata();

    const tasks = [];
    const options = [
        {},
        {width: 512},
        {width: 1024},
        {height: 512},
        {height: 1024},
        {width: 512, height: 512},
        {width: 1024, height: 1024},
    ];

    for (const option of options) {
        tasks.push(saveResizedJpeg(source, option));
        tasks.push(saveResizedWebp(source, option));
    }

    await Promise.all(tasks);

    return {format, width, height, hash, source: pathToKey(source)};
}

(async () => {
    const files = await globby([sourceFiles], { });
    const map = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath)) : {};

    for (const source of files) {
        if (source.indexOf('/build/') >= 0) continue;

        const key = pathToKey(source);
        // if (key in map) continue;

        const info = await saveJpegImage(source);
        map[key] = info;
        map[source] = info;
        console.log(source);
    }

    fs.writeFileSync(indexPath, JSON.stringify(map, null, '  '));
    console.log("written images.json");
})();
