const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const production = (process.env.NODE_ENV === 'production');

module.exports = {
    plugins: [
        tailwindcss(),
        autoprefixer(),
        production && cssnano(),
    ]
}
