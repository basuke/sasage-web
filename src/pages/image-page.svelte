<script>
    import { findImage, translated } from '../data';

    import Img from '$lib/img.svelte';
    import NotFoundPage from './not-found-page.svelte';

    export let id;
    export let data = {};
    export let lang = 'en';

    const image = findImage(data.images, id);
    const title = translated(image, 'title', lang) ?? '';
    const description = translated(image, 'description', lang) ?? '';
</script>

{#if !image}
    <NotFoundPage {lang} />
{:else}
    <div class="h-full flex flex-col justify-between items-center">
        <!-- <h2 class="mt-3 text-center text-2xl font-bold">{title}</h2> -->
        <Img {image} asis />
        <!-- <p class="leading-normal text-lg font-light">{description}</p> -->
    </div>
{/if}
