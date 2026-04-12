<script lang="ts">
    import { fade } from 'svelte/transition';
    import Img from './img.svelte';
    import { source } from './slideshow-source';
    import type { Image } from './data';

    let { images = [], wide = false }: { images?: string[]; wide?: boolean } = $props();

    const interval = 8000;
    let duration = 1000;

    const imageSource = source(images, interval);
    let image = $state<Image | null>(null);
    let previousImage = $state<Image | null>(null);
    let isFirstImage = $state(true);

    $effect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const unsub = imageSource.subscribe(($img) => {
            if (image === null) {
                image = $img;
                previousImage = $img;
            } else {
                previousImage = image;
                timeoutId = setTimeout(() => {
                    image = $img;
                    isFirstImage = false;
                }, 100);
            }
        });

        return () => {
            unsub();
            clearTimeout(timeoutId);
        };
    });
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
