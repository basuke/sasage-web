<script>

import { createEventDispatcher } from "svelte";
import { fade } from 'svelte/transition';

export let image = null;

const dispatch = createEventDispatcher();

</script>

<div transition:fade="{{duration: 200}}" on:click={() => dispatch('close')}>
    <img src={image.src} alt={image.alt}>
</div>

<style>

div {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    padding: 4px;
}

img {
    display: flex;
    max-width: 100%;
    max-height: 100%;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

</style>
