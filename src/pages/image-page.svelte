<script>
    import { data, findImage, lang, translated } from '../data';

    import Img from '$lib/img.svelte';
    import NotFoundPage from './not-found-page.svelte';

    export let id;

    const image = findImage(data.images, id);
    const title = translated(image, 'title', $lang) ?? '';
    const description = translated(image, 'description', $lang) ?? '';
</script>

{#if !image}
    <NotFoundPage />
{:else}
    <div class="h-full flex flex-col justify-between items-center">
        <!-- <h2 class="mt-3 text-center text-2xl font-bold">{title}</h2> -->
        <Img {image} asis />
        <!-- <p class="leading-normal text-lg font-light">{description}</p> -->
    </div>
{/if}
