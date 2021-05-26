<script>

import { findImage, imagePath, translated } from '../app';

export let id = null;
export let image = null;
export let data = {};
export let lang = {};
export let className = '';

if (id) {
    image = findImage(data.images, id);
}

</script>

{#if image}
<img
    class={className}
    src={imagePath(image.id)}
    width={image.width}
    height={image.height}
    alt={translated(image, 'title', lang)}
>
{/if}
