<script>

import ImageCell from '../components/image-cell.svelte';

export let data = {};
export let lang = '';
export let images = [];

</script>

<div class="grid sm:hidden grid-flow-row-dense gap-4 items-center">
    {#each images as id}
        <ImageCell {data} {lang} {id} link="/images/{id}"/>
    {/each}
</div>
<div class="hidden sm:grid lg:hidden grid-cols-2 grid-flow-row-dense gap-4 items-center">
    {#each images as id}
        <ImageCell {data} {lang} columns=2 {id} link="/images/{id}"/>
    {/each}
</div>
<div class="hidden lg:grid grid-cols-3 grid-flow-row-dense gap-4 items-center">
    {#each images as id}
        <ImageCell {data} {lang} columns=3 {id} link="/images/{id}"/>
    {/each}
</div>
