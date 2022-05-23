<script lang="ts">
    import ImageCell from '$lib/image-cell.svelte';

    export let images: string[] = [];
    export let columns: number | string = '';
    export let gap = 4;
</script>

{#if columns}
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
