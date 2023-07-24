<script lang="ts">
    import { lang, translated, type Collection } from '$lib/data';
    import Img from '$lib/img.svelte';
    import ImageGrid from '$lib/image-grid.svelte';
    import Container from '$lib/container.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    const collection: Collection = data.collection;
    const images: string[] = data.images;

    $: title = translated(collection, 'title', $lang) ?? '';
    $: subtitle = translated(collection, 'subtitle', $lang) ?? '';
</script>

<Container className="px-16">
    <div class="grid sm:grid-cols-2 gap-4 mb-8">
        <Img id={collection.image} square />

        <div class="flex flex-col justify-center">
            <h2 class="my-3 text-center text-3xl font-bold">{title}</h2>
            <p class="text-center text-lg font-light">{@html subtitle}</p>
        </div>
    </div>

    <ImageGrid {images} />
</Container>
