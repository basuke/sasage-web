const globby = require('globby');
const path = require('path');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminWebp = require('imagemin-webp');
// const imageminPngquant = require('imagemin-pngquant');

(async () => {
    const files = await globby(['public/**/*.{jpg,png}'], { });

    for (const sourcePath of files) {
        if (sourcePath.indexOf('/build/') >= 0) continue;

        const destination = path.dirname(sourcePath).replace('public/', 'public/build/');

        fs.mkdir(destination, { recursive: true }, err => {
            if (err) throw err;
            imagemin([sourcePath], {
                destination,
                plugins: [imageminJpegtran()],
            });
            imagemin([sourcePath], {
                destination,
                plugins: [imageminWebp({quality: 50})],
            });
        });
    }
})();
