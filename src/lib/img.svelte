<script lang="ts">
    import { data, lang, findImage, imagePath, translated, widths, heights } from './data';
    import type { Image } from './data';

    export let id: string | null = null;
    export let image: Image | null = null;
    export let className = '';

    export let columns = 0;
    export let span = 1;

    export let square = false; // display square
    export let r4x3 = false; // display 4:3
    export let wide = false; // display 2:1
    export let asis = false; // display original

    let width: number, height: number;
    if (id) {
        image = findImage(data.images, id);
        if (image) {
            width = image.width;
            height = image.height;
        }
    }

    function genMedia(w: number) {
        if (columns && columns > 1 && span >= 1) {
            w = (w * columns) / span;
        }
        return `(max-width: ${w}px)`;
    }

    type Source = {
        media: string;
        width: number;
        height: number;
        variation: string;
    };
    let sources: Source[] = [];
    let variation = '';

    if (asis) {
        // just list that original.
        variation = 'asis';
    } else if (square) {
        // list only squares
        sources = [
            {width: 480, height: 480, variation: 'square', media: genMedia(480)},
            {width: 960, height: 960, variation: 'square2x', media: genMedia(960)},
        ];
        const source = sources.pop();
        if (source) {
            width = source.width;
            height = source.height;
            variation = source.variation;
        }
    } else if (r4x3) {
        // list only 4:3
        sources = [480, 960, 1440, 1920].map((w) => {
            const h = (w / 4) * 3;
            return {
                media: genMedia(w),
                width: w,
                height: h,
                variation: `portrait${w}`,
            };
        });
        const source = sources.pop();
        if (source) {
            width = source.width;
            height = source.height;
            variation = source.variation;
        }
    } else if (wide) {
        // list only squares
        sources = [480, 960, 1440, 1920].map((w) => {
            const h = w / 2;
            return {
                media: genMedia(w),
                width: w,
                height: h,
                variation: `wide${w}`,
            };
        });
    } else {
        // list width constraint and original at the end

        sources = [480, 960, 1440, 1920].map((w) => ({
            media: genMedia(w),
            width: w,
            height: 0,
            variation: `mx${w}`,
        }));
    }
</script>

{#if image}
    <picture>
        {#each sources as source}
            {@const media = source.media}
            <source {media} srcset={imagePath(image.id, source.variation)} />
        {/each}
        <img
            class={className}
            src={imagePath(image.id, variation)}
            {width}
            {height}
            alt={translated(image, 'title', $lang)}
            loading="lazy"
        />
    </picture>
{/if}
