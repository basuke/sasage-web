<script>

import { findCollection, imagePath, translated } from '../app';

import ImageGrid from '../components/image-grid.svelte';

export let id;
export let data = {};
export let lang = 'en';

const collection = findCollection(data.collections, id);

const description = translated(collection, 'description', lang) ?? '';
const title = translated(collection, 'title', lang) ?? '';

const images = collection && 'images' in collection ? collection.images : [];

</script>

{#if !collection}
    <h1>Collection not find</h1>
{:else}
    <img src={imagePath(collection.image, '-w512-h512')} alt={title}>

    {#if title}
        <h2 class="my-3 text-center text-2xl font-bold">{title}</h2>
    {/if}

    {#if description}
        <p class="leading-normal text-lg font-light">{description}</p>
    {/if}

    <ImageGrid {data} {lang} {images} />
{/if}
