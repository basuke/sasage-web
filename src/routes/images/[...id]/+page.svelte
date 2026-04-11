<script lang="ts">
    import { lang, translated, type Image } from '$lib/data';
    import Img from '$lib/img.svelte';

    let { data }: { data: { image: Image } } = $props();
    let image = $derived(data.image);
    let title = $derived(translated(image, 'title', $lang) ?? '');
    let description = $derived(translated(image, 'description', $lang) ?? '');
</script>

<div class="h-full flex flex-col justify-between items-center">
    {#if title && title != image.id}
        <h2 class="mt-3 text-center text-2xl font-bold">{title}</h2>
    {/if}

    <Img {image} asis />

    {#if description}
        <p class="leading-normal text-lg font-light">{description}</p>
    {/if}
</div>
