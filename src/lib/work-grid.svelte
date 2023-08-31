<script lang="ts">
    import { lang, translated } from './data';
    import type { Work } from './data';
    import ImageCell from '$lib/image-cell.svelte';

    export let works: Work[] = [];
</script>

<div class="grid sm:hidden grid-flow-row-dense gap-4 items-center bg-blue">
    {#each works as c}
        <ImageCell
            id={c.image}
            square
            link="/works/{c.id}"
            title={translated(c, 'title', $lang)}
        />
    {/each}
</div>
<div class="hidden sm:grid lg:hidden grid-cols-2 grid-flow-row-dense gap-4 items-center">
    {#each works as c}
        <ImageCell
            columns={2}
            id={c.image}
            square
            link="/works/{c.id}"
            title={translated(c, 'title', $lang)}
        />
    {/each}
</div>
<div class="hidden lg:grid grid-cols-2 grid-flow-row-dense gap-4 items-center">
    {#each works as c}
        <ImageCell
            columns={2}
            id={c.image}
            square
            link="/works/{c.id}"
            title={translated(c, 'title', $lang)}
        />
    {/each}
</div>
