<script>

import ImageCell from '../components/image-cell.svelte';

export let data = {};
export let lang = '';
export let images = [];

</script>

<div class="grid sm:grid-cols-2 grid-flow-row-dense gap-4 items-center">
    {#each images as id}
        <ImageCell {data} {lang} {id} link="/images/{id}"/>
    {/each}
</div>
