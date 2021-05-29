<script>

import { findImage, imagePath, translated, widths, heights } from '../app';

export let id = null;
export let image = null;
export let data = {};
export let lang = {};
export let variation = '';
export let className = '';

export let columns = 0;
export let span = 1;

export let square = false;  // display square
export let r4x3 = false;    // display 4:3
export let asis = false;    // display original

if (id) {
    image = findImage(data.images, id);
}

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
} else if (r4x3) {
    // list only 4:3
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
<span class="hidden">square: {square} r4x3: {r4x3} asis: {asis} columns: {columns} span: {span}</span>
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
        loading="lazy"
    >
</picture>
{/if}
