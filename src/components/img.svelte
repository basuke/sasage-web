<script>

import { findImage, imagePath, translated } from '../app';

export let id = null;
export let image = null;
export let data = {};
export let lang = {};
export let variation = '';
export let className = '';
export let square = false;  // display square
export let asis = false;    // display original

const breakpoints = [400, 800, 1200];
const maxWidth = breakpoints[breakpoints.length - 1];

if (id) {
    image = findImage(data.images, id);
}

function variationForWidth(w) {
    if (square) return `-w${w}-h${w}`;
    return `-w${w}`;
}

function widthChoices() {
    if (asis || variation) return [];
    if (square) return breakpoints.slice(0, -1);
    return breakpoints;
}

function generateSources() {
    return widthChoices().map(width => ({
        media: `(max-width: ${width}px)`,
        variation: variationForWidth(width),
    }));
}

const sources = generateSources();

if (!variation && square) variation = variationForWidth(maxWidth);

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
