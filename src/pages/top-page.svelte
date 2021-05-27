<script>

import { Link } from "svelte-navigator";
import { imagePath } from "../app";

import About from '../components/about.svelte';
import ImageCell from '../components/image-cell.svelte';
import Img from '../components/img.svelte';

export let data = {};
export let lang = '';

const books = data.collections.filter(collection => collection.book);
const illustrations = data.collections.find(collection => collection.id === 'illustrations');

</script>

<div id="Books" class="pt-20">
    <h2 class="my-4 text-center text-2xl">BOOKS</h2>
    <ul class="px-4 grid sm:grid-cols-2 grid-flow-row-dense gap-4">
        {#each books as collection}
            <li class="w-full">
                <Link to="/collections/{collection.id}">
                    <Img className="my-1 shadow-md" variation="-w800-h800" id={collection.image} {data} />
                </Link>
            </li>
        {/each}
    </ul>
</div>

<div id="Illustrations" class="pt-20">
    <h2 class="my-4 text-center text-2xl">ILLUSTRATIONS</h2>
    <div class="grid sm:grid-cols-2 grid-flow-row-dense gap-4 items-center">
        {#each illustrations.images as imageId}
            <ImageCell {data} {lang} id={imageId} link="/images/{imageId}"/>
        {/each}
    </div>
</div>

<div id="About" class="pt-20">
    <h2 class="my-4 text-center text-3xl">ABOUT</h2>
    <About {lang} />
</div>
