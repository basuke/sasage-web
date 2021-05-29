<script>

import { Link as OriginalLink } from 'svelte-navigator';
export let to = '';

const click = (ev) => {
    if (to && to[0] === '/') {
        setTimeout(() => {
            window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        }, 50);
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
