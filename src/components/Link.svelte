<script>

import { Link as OriginalLink } from 'svelte-navigator';
import { scrollToTop, afterTick } from '../utils';
import { tagPage } from '../app';

export let to = '';

const click = (ev) => {
    if (to && to[0] === '/') {
        afterTick(scrollToTop);
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
