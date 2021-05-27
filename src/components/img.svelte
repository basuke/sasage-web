<script>

import { findImage, imagePath, translated } from '../app';

export let id = null;
export let image = null;
export let data = {};
export let lang = {};
export let variation = '';
export let className = '';

export let columns = 0;
export let span = 1;

export let square = false;  // display square
export let w4h3 = false;    // display 4:3
export let asis = false;    // display original

if (id) {
    image = findImage(data.images, id);
}

const widths = [320, 480, 640, 960, 1280];
const heights = [240, 480, 720, 960];

const breakpoints = [400, 800, 1200];
const maxWidth = breakpoints[breakpoints.length - 1];

function genVariation(w, h) {
    let variation = '';
    if (w) variation += '-w' + w;
    if (h) variation += '-h' + h;
    return variation;
}

function genMedia(w) {
    if (columns && columns > 1 && span >= 1) {
        w = w * columns / span;
    }
    return `(max-width: ${w}px)`;
}

// function widthChoices() {
//     if (asis || variation) return [];
//     if (square) return breakpoints.slice(0, -1);
//     return breakpoints;
// }

// function generateSources() {
//     return widthChoices().map(width => ({
//         media: `(max-width: ${width}px)`,
//         variation: variationForWidth(width),
//     }));
// }

// const sources = generateSources();

// if (!variation && square) variation = variationForWidth(maxWidth);

let sources = [];

if (variation || asis) {
    // just list that variation or original for webp and jpg.
} else if (square) {
    // list only squares
    sources = widths.filter(w => heights.indexOf(w) >= 0).map(w => ({
        media: genMedia(w),
        variation: genVariation(w, w),
    }));
    variation = sources.pop().variation;
} else if (w4h3) {
    // list only 4:3
    const w4h3s = heights.map(h => [h / 3 * 4, h]);
    sources = heights.map(h => {
        const w = h / 3 * 4;
        return {
            media: genMedia(w),
            variation: genVariation(w, h),
        };
    });
    variation = sources.pop().variation;
} else {
    // list width constraint and original at the end
    sources = widths.map(w => ({
        media: genMedia(w),
        variation: genVariation(w),
    }));
}

</script>

{#if image}
<picture>
    {#each sources as source}
        <source type="image/webp" media={source.media} srcset={imagePath(image.id, source.variation, 'webp')}>
        <source media={source.media} srcset={imagePath(image.id, source.variation)}>
    {/each}
    <source type="image/webp" srcset={imagePath(image.id, variation, 'webp')}>
    <img
        class={className}
        src={imagePath(image.id, variation)}
        width={image.width}
        height={image.height}
        alt={translated(image, 'title', lang)}
    >
</picture>
{/if}
