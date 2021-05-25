const globby = require('globby');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const admin = require('firebase-admin');
const tempy = require('tempy');
const minimist = require('minimist');

const destinationDirectory = 'images';
const indexPath = './public/build/images.json';
const storageBucket = 'sasage-website-71713.appspot.com';

const args = minimist(process.argv.slice(2));
const directory = args._.length ? args._[0] : './public';

function suffix(option) {
    let suffix = '';
    if ('width' in option) suffix += `-w${option.width}`;
    if ('height' in option) suffix += `-h${option.height}`;
    return suffix;
}

function pathToKey(source) {
    return source.replace(directory + '/', '').replace(directory, '');
}

function pathToHash(source) {
    return pathToKey(source)
        .replace(/\.[a-zA-Z0-9]+$/, '')    // remove extension
        .replace(/[^0-9A-Za-z._-]/g, '-'); // escape chars
}

async function upload(dataFile, destinationPath) {
    return bucket.upload(dataFile, { destination: destinationPath, pubic: true });
}

async function saveResizedFile({source, resize, extension, format, opt}) {
    const hash = pathToHash(source);
    const dataFile = tempy.file();
    const filePath = path.join(destinationDirectory, `${hash}${suffix(resize)}.${extension}`);

    return sharp(source)
        .resize(resize)
        .toFormat(format, opt)
        .toFile(dataFile)
        .then(() => upload(dataFile, filePath))
        .then(data => data[0].makePublic());
}


async function saveResizedJpeg(source, option) {
    return saveResizedFile({
        source,
        resize: option,
        extension: 'jpg',
        format: 'jpeg',
        option: { mozjpeg: true }
    });
}

async function saveResizedWebp(source, option) {
    return saveResizedFile({
        source,
        resize: option,
        extension: 'webp',
        format: 'webp',
        option: { quality: 60 }
    });
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

const serviceAccountKey = JSON.parse(fs.readFileSync('./serviceAccountKey.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    storageBucket
});

const bucket = admin.storage().bucket();

(async () => {
    const files = await globby([directory + '/**/*.{jpg,png}'], { });
    const map = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath)) : {};

    for (const source of files) {
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
