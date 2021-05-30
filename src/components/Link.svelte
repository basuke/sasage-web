<script>

import { Link as OriginalLink } from 'svelte-navigator';
import { scrollToTop } from '../utils';

export let to = '';

const click = (ev) => {
    if (to && to[0] === '/') {
        scrollToTop();
    }
};

</script>

{#if to}
    <OriginalLink {to} on:click={click}>
        <slot/>
    </OriginalLink>
{:else}
    <slot/>
{/if}
