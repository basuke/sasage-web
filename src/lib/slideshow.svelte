<script lang="ts">
    import { onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    import Img from './img.svelte';
    import { source, createTransition } from './slideshow-source';
    import type { Image } from './data';

    let { images = [], wide = false }: { images?: string[]; wide?: boolean } = $props();

    const interval = 8000;
    let duration = 1000;

    const imageSource = source(images, interval);
    const transition = createTransition(imageSource);

    let image = $state<Image | null>(transition.image);
    let previousImage = $state<Image | null>(transition.previousImage);
    let isFirstImage = $state(transition.isFirstImage);

    transition.onChange(() => {
        image = transition.image;
        previousImage = transition.previousImage;
        isFirstImage = transition.isFirstImage;
    });

    onDestroy(() => transition.destroy());
</script>

<div class="relative">
    {#if image && previousImage}
        <div>
            <Img image={previousImage} square={!wide} {wide} />
        </div>
        <div class="absolute top-0 left-0">
            {#key image}
                <div in:fade={{ duration }}>
                    <Img {image} square={!wide} {wide} priority={isFirstImage} />
                </div>
            {/key}
        </div>
    {/if}
</div>
