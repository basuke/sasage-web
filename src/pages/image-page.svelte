<script>

import { findImage, imagePath } from '../app';

export let imageId;
export let data = {};
export let lang = 'en';

const image = findImage(data.images, imageId);

function translated(key, lang) {
    if (!image) return '';
    let value = image[key];
    key = key + '-' + lang;
    if (key in image) value = image[key];
    return value;
}

$: description = translated('description', lang);
$: title = translated('title', lang);

</script>

{#if !image}
    <h1>Image not find</h1>
{:else}
    <img src={imagePath(image)} alt={image.title}>

    {#if title}
        <h2 class="my-3 text-center text-2xl font-bold">{title}</h2>
    {/if}

    {#if description}
        <p class="leading-normal text-lg font-light">{description}</p>
    {/if}
{/if}
