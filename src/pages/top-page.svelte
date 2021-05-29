<script>

import { Link } from "svelte-navigator";

import About from '../components/about.svelte';
import CollectionGrid from '../components/collection-grid.svelte';
import ImageGrid from '../components/image-grid.svelte';
import Img from '../components/img.svelte';

export let data = {};
export let lang = '';

const books = data.collections.filter(collection => collection.book);
const illustrations = data.collections.find(collection => collection.id === 'illustrations');

</script>

<div id="Books" class="pt-20">
    <h2 class="my-4 text-center text-2xl md:text-3xl">BOOKS</h2>
    <CollectionGrid {data} {lang} collections={books} />
</div>

<div id="Illustrations" class="pt-20">
    <h2 class="my-4 text-center text-2xl md:text-3xl">ILLUSTRATIONS</h2>
    <ImageGrid {data} {lang} images={illustrations.images} />
</div>

<div id="About" class="pt-20">
    <h2 class="my-4 text-center text-2xl md:text-3xl">ABOUT</h2>
    <About bind:lang />
</div>
