<script context="module" lang="ts">
    import { data, findImage, type Image } from '../../data';

    export async function load({ params }: { params: { id: string } }) {
        const image = findImage(data.images, params.id);
        return image
            ? {
                  status: 200,
                  props: { image },
              }
            : {
                  status: 404,
              };
    }
</script>

<script lang="ts">
    import { lang, translated } from '../../data';
    import Img from '$lib/img.svelte';

    export let image: Image;

    const title = translated(image, 'title', $lang) ?? '';
    const description = translated(image, 'description', $lang) ?? '';
</script>

<div class="h-full flex flex-col justify-between items-center">
    {#if title && title != image.id}
        <h2 class="mt-3 text-center text-2xl font-bold">{title}</h2>
    {/if}

    <Img {image} asis />

    {#if description}
        <p class="leading-normal text-lg font-light">{description}</p>
    {/if}
</div>
