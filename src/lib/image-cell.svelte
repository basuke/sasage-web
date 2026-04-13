<script lang="ts">
    import { findImage, data } from './data';
    import Img from './img.svelte';

    let {
        id = undefined,
        columns = 0,
        link = '',
        title = '',
        square = false,
        r4x3 = false,
    }: {
        id?: string | undefined;
        columns?: number;
        link?: string;
        title?: string;
        square?: boolean;
        r4x3?: boolean;
    } = $props();

    const image = id ? findImage(data.images, id) : null;
    let cellClass = 'px-16 sm:px-8';
    let span = 1;

    if (image) {
        const { width, height } = image;

        if (width && height) {
            const ratio = square ? 1.01 : r4x3 ? 4 / 3 : width / height;
            if (ratio >= 1.5) {
                cellClass = 'px-2';

                if (columns > 1) {
                    cellClass += ' col-span-2';
                    span = 2;
                }
            } else if (ratio > 1.0) cellClass = 'px-8 sm:px-2';
        }
    }
</script>

{#if image}
    <div class="{cellClass} my-8 sm:my-6" data-sveltekit-preload-data="hover">
        <a href={link}>
            <Img className="shadow-xl" {columns} {span} {square} {r4x3} {image} />
            {#if title}
                <p class="mt-3 text-center text-xl lg:text-2xl font-extralight">{title}</p>
            {/if}
        </a>
    </div>
{/if}
