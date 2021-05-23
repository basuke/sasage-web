<script>

import { findImage, imagePath } from '../app';

export let imageId;

const image = findImage(imageId);

</script>

{#if image}
    image page: id = {image.id}
    <img src={imagePath(image)} alt={image.title}>
{:else}
    <h1>Image not find</h1>
{/if}
