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

<div id="Books">
    <h2 class="my-4 text-center text-3xl">Books</h2>
    <ul class="flex flex-wrap">
        {#each books as collection}
            <li class="w-full">
                <Link to="/collections/{collection.id}">
                    <img class="my-1 shadow-md" src={imagePath(collection.image)} alt={collection.title}>
                </Link>
            </li>
        {/each}
    </ul>
</div>

<div id="Illustrations">
    <h2 class="my-4 text-center text-3xl">Illustrations</h2>
    <ul class="flex flex-wrap">
        {#each illustrations.images as imageId}
            <li class="w-full">
                <ImageCell {data} {lang} id={imageId}/>
            </li>
        {/each}
    </ul>
</div>

<div id="About">
    <h2 class="my-4 text-center text-3xl">About</h2>
    <About {lang} />
</div>
