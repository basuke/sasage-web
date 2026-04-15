<script lang="ts">
    import ImageCell from '$lib/image-cell.svelte';
    import { findImage } from './data';
    import type { ImageSet } from './data';
    import { page } from '$app/state';

    let {
        images = [],
        columns: columnsProp = 0,
        gap = 4,
    }: {
        images?: string[];
        columns?: number;
        gap?: number;
    } = $props();

    function allWide(images: string[]): boolean {
        const allImages = (page.data.images ?? {}) as ImageSet;
        return images
            .map((id) => findImage(allImages, id))
            .filter((n) => n)
            .every((image) => !image || image.width > image?.height);
    }

    let columns = $derived(!columnsProp && allWide(images) ? 1 : columnsProp);
</script>

{#if columns > 0}
    <div class="grid grid-cols-{columns} grid-flow-row gap-{gap} items-center">
        {#each images as id}
            <ImageCell {id} link="/images/{id}" />
        {/each}
    </div>
{:else}
    <div class="grid sm:hidden grid-flow-row gap-{gap} items-center">
        {#each images as id}
            <ImageCell {id} link="/images/{id}" />
        {/each}
    </div>
    <div class="hidden sm:grid lg:hidden grid-cols-2 grid-flow-row gap-{gap} items-center">
        {#each images as id}
            <ImageCell columns={2} {id} link="/images/{id}" />
        {/each}
    </div>
    <div class="hidden lg:grid grid-cols-3 grid-flow-row gap-{gap} items-center">
        {#each images as id}
            <ImageCell columns={3} {id} link="/images/{id}" />
        {/each}
    </div>
{/if}
