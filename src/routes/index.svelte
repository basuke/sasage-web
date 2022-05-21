<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import { data } from '../data';

    import About from '../lib/about.svelte';
    import CollectionGrid from '$lib/collection-grid.svelte';
    import ImageGrid from '$lib/image-grid.svelte';
    import Container from '$lib/container.svelte';

    export let lang = '';

    const books = data.collections.filter((collection) => collection.book);
    const illustrations = data.collections.find((collection) => collection.id === 'illustrations');
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<Container>
    <div id="Books" class="pt-20">
        <h2 class="my-4 text-center text-2xl md:text-3xl">BOOKS</h2>
        <CollectionGrid {data} {lang} collections={books} />
    </div>

    <div id="Illustrations" class="pt-20">
        <h2 class="my-4 text-center text-2xl md:text-3xl">ILLUSTRATIONS</h2>
        <ImageGrid {data} {lang} images={illustrations.images} />
    </div>

    <div id="About" class="pt-20">
        <About bind:lang {data} />
    </div>
</Container>
