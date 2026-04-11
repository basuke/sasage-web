<script lang="ts">
    import { lang, translated, type Work } from '$lib/data';
    import Img from '$lib/img.svelte';
    import ImageGrid from '$lib/image-grid.svelte';
    import Container from '$lib/container.svelte';

    let { data }: { data: { work: Work; images: string[] } } = $props();

    let work = $derived(data.work);
    let images = $derived(data.images);

    let title = $derived(translated(work, 'title', $lang) ?? '');
    let subtitle = $derived(translated(work, 'subtitle', $lang) ?? '');
</script>

<Container className="px-16">
    <div class="grid sm:grid-cols-2 gap-4 mb-8">
        <Img id={work.image} square />

        <div class="flex flex-col justify-center">
            <h2 class="my-3 text-center text-3xl font-bold">{title}</h2>
            <p class="text-center text-lg font-light text">{@html subtitle}</p>
        </div>
    </div>

    <ImageGrid {images} />
</Container>
