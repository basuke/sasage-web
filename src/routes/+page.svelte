<script lang="ts">
    import type { Work } from '$lib/data';
    import WorkGrid from '$lib/work-grid.svelte';
    import ImageGrid from '$lib/image-grid.svelte';
    import Container from '$lib/container.svelte';

    let { data }: { data: { works: Work[]; illustrations: string[] } } = $props();

    let works = $derived(data.works);
    let illustrations = $derived(data.illustrations);
</script>

<svelte:head>
    <title>Mayumi Sasage : Illustrator &amp; Artist</title>
</svelte:head>

<Container>
    <div id="Works" class="pt-20">
        <h2 class="my-4 text-center text-2xl md:text-3xl">WORKS</h2>
        <WorkGrid {works} />
    </div>

    <div id="Illustrations" class="pt-20">
        <h2 class="my-4 text-center text-2xl md:text-3xl">ILLUSTRATIONS</h2>
        <ImageGrid images={illustrations} />
    </div>
</Container>
