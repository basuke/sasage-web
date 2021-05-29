<script>

import { findImage, imagePath } from '../app';
import Link from './Link.svelte';
import Img from './img.svelte';

export let id = '';
export let data = {};
export let lang = {};
export let columns = undefined;
export let link = null;
export let title = null;
export let square = false;
export let r4x3 = false;

const image = findImage(data.images, id);
let cellClass = 'px-16 sm:px-8';
let span = 1;

if (image) {
    const {width, height} = image;
    
    if (width && height) {
        const ratio = square ? 1.01 : r4x3 ? (4 / 3) : width / height;
        if (ratio >= 1.5) {
            cellClass = 'px-2';

            if (columns > 1) {
                cellClass += ' col-span-2';
                span = 2;
            }
        }
        else if (ratio > 1.0) cellClass = 'px-8 sm:px-2';
    }
}

</script>

{#if image}
    <div class="{cellClass} my-8 sm:my-6">
        <Link to={link}>
            <Img className="shadow-xl" {columns} {span} {square} {r4x3} {image} {lang} />
            {#if title}
                <p class="mt-3 text-center text-xl lg:text-2xl font-extralight">{title}</p>
            {/if}
        </Link>
    </div>
{/if}
