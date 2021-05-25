<script>

import { findImage, imagePath } from '../app';
import { Link } from 'svelte-navigator';

export let id = '';
export let data = {};

const image = findImage(data.images, id);
let cellClass = 'px-16';

if (image) {
    const {width, height} = image;
    
    if (width && height) {
        const ratio = width / height;

        if (ratio >= 1.5) cellClass = 'px-2';
        else if (ratio > 1.0) cellClass = 'px-8';
    }
}

</script>

{#if image}
    <div class={cellClass}>
        <Link to="/images/{image.id}">
            <img class="my-8 shadow-xl" src={imagePath(image.id)} alt={image.title}>
        </Link>
    </div>
{/if}
