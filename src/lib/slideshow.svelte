<script lang="ts">
    import { onDestroy } from 'svelte';
    import Img from './img.svelte';
    import { source, createTransition } from './slideshow-source';

    let { images = [], wide = false }: { images?: string[]; wide?: boolean } = $props();

    const interval = 8000;
    const duration = 1000;

    const imageSource = source(images, interval);
    const transition = createTransition(imageSource);

    let imageA = $state(transition.imageA);
    let imageB = $state(transition.imageB);
    let activeLayer = $state(transition.activeLayer);
    let isFirstImage = $state(transition.isFirstImage);

    transition.onChange(() => {
        imageA = transition.imageA;
        imageB = transition.imageB;
        activeLayer = transition.activeLayer;
        isFirstImage = transition.isFirstImage;
    });

    onDestroy(() => transition.destroy());
</script>

<div class="relative">
    {#if imageA && imageB}
        <div
            style:opacity={activeLayer === 'a' ? 1 : 0}
            style:transition="opacity {duration}ms ease"
        >
            {#key imageA}
                <Img image={imageA} square={!wide} {wide} priority={isFirstImage && activeLayer === 'a'} />
            {/key}
        </div>
        <div
            class="absolute top-0 left-0"
            style:opacity={activeLayer === 'b' ? 1 : 0}
            style:transition="opacity {duration}ms ease"
        >
            {#key imageB}
                <Img image={imageB} square={!wide} {wide} priority={isFirstImage && activeLayer === 'b'} />
            {/key}
        </div>
    {/if}
</div>
