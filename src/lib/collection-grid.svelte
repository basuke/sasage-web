<script>
    import { translated } from '../data';
    import ImageCell from '$lib/image-cell.svelte';

    export let data = {};
    export let lang = '';
    export let collections = [];
</script>

<div class="grid sm:hidden grid-flow-row-dense gap-4 items-center">
    {#each collections as c}
        <ImageCell
            {data}
            {lang}
            id={c.image}
            square
            link="/collections/{c.id}"
            title={translated(c, 'title', lang)}
        />
    {/each}
</div>
<div class="hidden sm:grid lg:hidden grid-cols-2 grid-flow-row-dense gap-4 items-center">
    {#each collections as c}
        <ImageCell
            {data}
            {lang}
            columns="2"
            id={c.image}
            square
            link="/collections/{c.id}"
            title={translated(c, 'title', lang)}
        />
    {/each}
</div>
<div class="hidden lg:grid grid-cols-2 grid-flow-row-dense gap-4 items-center">
    {#each collections as c}
        <ImageCell
            {data}
            {lang}
            columns="2"
            id={c.image}
            r4x3
            link="/collections/{c.id}"
            title={translated(c, 'title', lang)}
        />
    {/each}
</div>
