<script>

import { Link } from "svelte-navigator";
import { imagePath } from "../app";

import About from '../components/about.svelte';
import ImageCell from '../components/image-cell.svelte';

export let data = {};
export let lang = '';

const books = data.collections.filter(collection => collection.book);
const illustrations = data.collections.find(collection => collection.id === 'illustrations');

</script>

<div id="Books" class="pt-20">
    <h2 class="my-4 text-center text-3xl">Books</h2>
    <ul class="grid grid-cols-1 sm:grid-cols-2  gap-4">
        {#each books as collection}
            <li class="w-full">
                <Link to="/collections/{collection.id}">
                    <img class="my-1 shadow-md" src={imagePath(collection.image, '-w400-h400')} alt={collection.title}>
                </Link>
            </li>
        {/each}
    </ul>
</div>

<div id="Illustrations" class="pt-20">
    <h2 class="my-4 text-center text-3xl">Illustrations</h2>
    <ul class="grid grid-cols-1 sm:grid-cols-2  gap-4">
        {#each illustrations.images as imageId}
            <li class="w-full">
                <ImageCell {data} {lang} id={imageId} link="/images/{imageId}"/>
            </li>
        {/each}
    </ul>
</div>

<div id="About" class="pt-20">
    <h2 class="my-4 text-center text-3xl">About</h2>
    <About {lang} />
</div>
