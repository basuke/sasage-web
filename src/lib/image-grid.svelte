<script lang="ts">
    import ImageCell from '$lib/image-cell.svelte';
    import { data, findImage } from './data';

    export let images: string[] = [];
    export let columns: number = 0;
    export let gap = 4;

    if (!columns && allWide(images)) {
        columns = 1;
    }

    function allWide(images: string[]): boolean {
        return images
            .map((id) => findImage(data.images, id))
            .filter((n) => n)
            .every((image) => !image || image.width > image?.height);
    }
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
