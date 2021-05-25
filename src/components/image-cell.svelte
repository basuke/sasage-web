<script>

import { findImage, imagePath } from '../app';
import { Link } from 'svelte-navigator';

export let id = '';
export let data = {};

const image = findImage(data.images, id);

</script>

{#if image}
    <li class="w-full px-16">
        <Link to="/images/{image.id}">
            <img class="my-8 shadow-lg" src={imagePath(image.id)} alt={image.title}>
        </Link>
    </li>
{/if}
