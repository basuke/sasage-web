<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { fade } from 'svelte/transition';
    import Img from './img.svelte';
    import { source } from './slideshow-source';

    export let images: string[] = [];
    export let wide = false;

    const interval = 8000;
    let duration = 1000;

    const imageSource = source(images, interval);
    let image = $imageSource;
    let previousImage = image;

    imageSource.subscribe(async ($image) => {
        previousImage = image;
        setTimeout(() => {
            image = $image;
        }, 100);
    });
</script>

<div class="relative">
    <div>
        <Img image={previousImage} square={!wide} {wide} />
    </div>
    <div class="absolute top-0 left-0">
        {#key image}
            <div in:fade={{ duration }}>
                <Img {image} square={!wide} {wide} />
            </div>
        {/key}
    </div>
</div>

<style>
</style>
