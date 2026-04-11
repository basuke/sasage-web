<script lang="ts">
    import { untrack } from 'svelte';
    import { fade } from 'svelte/transition';
    import Img from './img.svelte';
    import { source } from './slideshow-source';
    import type { Image } from './data';

    let { images = [], wide = false }: { images?: string[]; wide?: boolean } = $props();

    const interval = 8000;
    let duration = 1000;

    const imageSource = source(images, interval);
    let image = $state<Image>($imageSource);
    let previousImage = $state<Image>($imageSource);
    let isFirstImage = $state(true);

    $effect(() => {
        const newImage = $imageSource;
        previousImage = untrack(() => image);
        const timeoutId = setTimeout(() => {
            image = newImage;
            isFirstImage = false;
        }, 100);
        return () => clearTimeout(timeoutId);
    });
</script>

<div class="relative">
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
</div>
