<script>

import { findImage, imagePath, translated } from '../app';

import NotFoundPage from './not-found-page.svelte';

export let id;
export let data = {};
export let lang = 'en';

const image = findImage(data.images, id);

$: description = translated(image, 'description', lang);
$: title = translated(image, 'title', lang);

</script>

{#if !image}
    <NotFoundPage/>
{:else}
    id = {id}
    <img src={imagePath(id)} alt={title}>

    {#if title}
        <h2 class="my-3 text-center text-2xl font-bold">{title}</h2>
    {/if}

    {#if description}
        <p class="leading-normal text-lg font-light">{description}</p>
    {/if}
{/if}
