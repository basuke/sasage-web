<script lang="ts">
    import { onDestroy } from 'svelte';
    import type { ImageSet } from './data';
    import { page } from '$app/state';
    import Img from './img.svelte';
    import { source, createTransition } from './slideshow-source';

    let { images = [], wide = false }: { images?: string[]; wide?: boolean } = $props();

    const interval = 8000;
    const duration = 1000;

    const imageSource = source((page.data.images ?? {}) as ImageSet, images, interval);
    const transition = createTransition(imageSource);

    let imageA = $state(transition.imageA);
    let imageB = $state(transition.imageB);
    let activeLayer = $state(transition.activeLayer);
    let isFirstImage = $state(transition.isFirstImage);

    // The layer we want to switch to once the image loads
    let pendingLayer = $state(transition.activeLayer);

    transition.onChange(() => {
        // Update images immediately (loads start in invisible layer)
        imageA = transition.imageA;
        imageB = transition.imageB;
        isFirstImage = transition.isFirstImage;
        // Don't switch activeLayer yet — wait for onload
        pendingLayer = transition.activeLayer;
    });

    function handleLoad(layer: 'a' | 'b') {
        if (pendingLayer === layer) {
            activeLayer = layer;
        }
    }

    onDestroy(() => transition.destroy());
</script>

<div class="relative">
    {#if imageA && imageB}
        <div
            style:opacity={activeLayer === 'a' ? 1 : 0}
            style:transition="opacity {duration}ms ease"
        >
            <Img image={imageA} square={!wide} {wide}
                 priority={isFirstImage && activeLayer === 'a'}
                 onload={() => handleLoad('a')} />
        </div>
        <div
            class="absolute top-0 left-0"
            style:opacity={activeLayer === 'b' ? 1 : 0}
            style:transition="opacity {duration}ms ease"
        >
            <Img image={imageB} square={!wide} {wide}
                 priority={isFirstImage && activeLayer === 'b'}
                 onload={() => handleLoad('b')} />
        </div>
    {/if}
</div>
