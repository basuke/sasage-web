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
        variant: string;
    };
    let sources: Source[] = [];
    let variant = '';

    if (asis) {
        // just list that original.
        variant = 'asis';
    } else if (square) {
        // list only squares
        sources = [
            {width: 480, height: 480, variant: 'square', media: genMedia(480)},
            {width: 960, height: 960, variant: 'square2x', media: genMedia(960)},
        ];
        const source = sources.pop();
        if (source) {
            width = source.width;
            height = source.height;
            variant = source.variant;
        }
    } else if (r4x3) {
        // list only 4:3
        sources = [480, 960, 1440, 1920].map((w) => {
            const h = (w / 4) * 3;
            return {
                media: genMedia(w),
                width: w,
                height: h,
                variant: `portrait${w}`,
            };
        });
        const source = sources.pop();
        if (source) {
            width = source.width;
            height = source.height;
            variant = source.variant;
        }
    } else if (wide) {
        // list only squares
        sources = [480, 960, 1440, 1920].map((w) => {
            const h = w / 2;
            return {
                media: genMedia(w),
                width: w,
                height: h,
                variant: `wide${w}`,
            };
        });
    } else {
        // list width constraint and original at the end

        sources = [480, 960, 1440, 1920].map((w) => ({
            media: genMedia(w),
            width: w,
            height: 0,
            variant: `mx${w}`,
        }));
    }
</script>

{#if image}
    <picture>
        {#each sources as source}
            {@const media = source.media}
            <source {media} srcset={imagePath(image.id, source.variant)} />
        {/each}
        <img
            class={className}
            src={imagePath(image.id, variant)}
            {width}
            {height}
            alt={translated(image, 'title', $lang)}
            loading="lazy"
        />
    </picture>
{/if}
