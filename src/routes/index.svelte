<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import { data } from '../data';

    import CollectionGrid from '$lib/collection-grid.svelte';
    import ImageGrid from '$lib/image-grid.svelte';
    import Container from '$lib/container.svelte';

    const books = data.collections.filter((collection) => collection.book);
    const illustrations = data.collections.find((collection) => collection.id === 'illustrations');
</script>

<svelte:head>
    <title>Mayumi Sasage : Illustrator &amp; Artist</title>
</svelte:head>

<Container>
    <div id="Books" class="pt-20">
        <h2 class="my-4 text-center text-2xl md:text-3xl">BOOKS</h2>
        <CollectionGrid collections={books} />
    </div>

    {#if illustrations}
        <div id="Illustrations" class="pt-20">
            <h2 class="my-4 text-center text-2xl md:text-3xl">ILLUSTRATIONS</h2>
            <ImageGrid images={illustrations.images} />
        </div>
    {/if}
</Container>
