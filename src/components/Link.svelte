<script>

import { Link as OriginalLink } from 'svelte-navigator';
import { scrollToTop } from '../utils';
import { tagPage } from '../app';
import { tick } from 'svelte';

export let to = '';

const click = (ev) => {
    if (to && to[0] === '/') {
        tick().then(scrollToTop);
    }
    tagPage(to);
};

</script>

{#if to}
    <OriginalLink {to} on:click={click}>
        <slot/>
    </OriginalLink>
{:else}
    <slot/>
{/if}
