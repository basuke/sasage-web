<script>

import { findCollection, findImage, imagePath, translated } from '../app';
import { Link } from "svelte-navigator";

export let id;
export let data = {};
export let lang = 'en';

const collection = findCollection(data.collections, id);

$: description = translated(collection, 'description', lang);
$: title = translated(collection, 'title', lang);

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
    <ul class="flex flex-wrap">
        {#each images as imageId}
            <li class="w-full">
                <Link to="/images/{imageId}">
                    <img class="my-1 shadow-md" src={imagePath(imageId)} alt={imageId}>
                </Link>
            </li>
        {/each}
    </ul>
{/if}
