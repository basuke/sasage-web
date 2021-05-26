<script>

import { findImage, imagePath } from '../app';
import { Link } from 'svelte-navigator';
import Img from './img.svelte';

export let id = '';
export let data = {};
export let link = null;

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
        <Link to={link}>
            <Img className="my-8 shadow-xl" {image} />
        </Link>
    </div>
{/if}
