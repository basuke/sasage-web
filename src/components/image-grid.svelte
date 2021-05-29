<script>

import ImageCell from '../components/image-cell.svelte';

export let data = {};
export let lang = '';
export let images = [];
export let columns = undefined;
export let gap = 4;

</script>

{#if columns}
    <div class="grid grid-cols-{columns} grid-flow-row-dense gap-{gap} items-center">
        {#each images as id}
            <ImageCell {data} {lang} {id} link="/images/{id}"/>
        {/each}
    </div>
{:else}
    <div class="grid sm:hidden grid-flow-row-dense gap-{gap} items-center">
        {#each images as id}
            <ImageCell {data} {lang} {id} link="/images/{id}"/>
        {/each}
    </div>
    <div class="hidden sm:grid lg:hidden grid-cols-2 grid-flow-row-dense gap-{gap} items-center">
        {#each images as id}
            <ImageCell {data} {lang} columns=2 {id} link="/images/{id}"/>
        {/each}
    </div>
    <div class="hidden lg:grid grid-cols-3 grid-flow-row-dense gap-{gap} items-center">
        {#each images as id}
            <ImageCell {data} {lang} columns=3 {id} link="/images/{id}"/>
        {/each}
    </div>
{/if}
