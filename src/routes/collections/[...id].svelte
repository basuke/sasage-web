<script context="module" lang="ts">
    import { data, findCollection, findImage, type Collection, type Image } from '../../data';

    export async function load({ params }: { params: { id: string } }) {
        const collection = findCollection(data.collections, params.id);
        if (!collection) {
            return { status: 404 };
        }

        const images = collection.images ?? [];

        return {
            status: 200,
            props: { collection, images },
        };
    }
</script>

<script lang="ts">
    import { lang, translated } from '../../data';
    import Img from '$lib/img.svelte';
    import ImageGrid from '$lib/image-grid.svelte';
    import Container from '$lib/container.svelte';

    export let collection: Collection;
    export let images: string[];

    const title = translated(collection, 'title', $lang) ?? '';
    const subtitle = translated(collection, 'subtitle', $lang) ?? '';
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
