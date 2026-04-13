<script lang="ts">
    import { data, lang, findImage, imagePath, translated } from './data';
    import type { Image } from './data';

    let {
        id = null,
        image: imageProp = null,
        className = '',
        columns = 0,
        span = 1,
        square = false,
        r4x3 = false,
        wide = false,
        asis = false,
        priority = false,
    }: {
        id?: string | null | undefined;
        image?: Image | null;
        className?: string;
        columns?: number;
        span?: number;
        square?: boolean;
        r4x3?: boolean;
        wide?: boolean;
        asis?: boolean;
        priority?: boolean;
    } = $props();

    let image = $derived(id ? findImage(data.images, id) : imageProp);

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

    let layout = $derived.by(() => {
        let w = image?.width ?? 0;
        let h = image?.height ?? 0;
        let sources: Source[] = [];
        let variant = '';

        if (asis) {
            variant = 'asis';
        } else if (square) {
            sources = [
                {width: 480, height: 480, variant: 'square', media: genMedia(480)},
                {width: 960, height: 960, variant: 'square2x', media: genMedia(960)},
            ];
            const source = sources.pop();
            if (source) {
                w = source.width;
                h = source.height;
                variant = source.variant;
            }
        } else if (r4x3) {
            sources = [480, 960, 1440, 1920].map((mw) => {
                const mh = (mw / 4) * 3;
                return {
                    media: genMedia(mw),
                    width: mw,
                    height: mh,
                    variant: `portrait${mw}`,
                };
            });
            const source = sources.pop();
            if (source) {
                w = source.width;
                h = source.height;
                variant = source.variant;
            }
        } else if (wide) {
            sources = [480, 960, 1440, 1920].map((mw) => {
                const mh = mw / 2;
                return {
                    media: genMedia(mw),
                    width: mw,
                    height: mh,
                    variant: `wide${mw}`,
                };
            });
        } else {
            sources = [480, 960, 1440, 1920].map((mw) => ({
                media: genMedia(mw),
                width: mw,
                height: 0,
                variant: `mx${mw}`,
            }));
        }

        return { width: w, height: h, sources, variant };
    });
</script>

{#if image}
    <picture>
        {#each layout.sources as source}
            {@const media = source.media}
            <source {media} srcset={imagePath(image.id, source.variant)} />
        {/each}
        <img
            class={className}
            src={imagePath(image.id, layout.variant)}
            width={layout.width}
            height={layout.height}
            alt={translated(image, 'title', $lang)}
            loading={priority ? "eager" : "lazy"}
            fetchpriority={priority ? "high" : "auto"}
        />
    </picture>
{/if}
