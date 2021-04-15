<script>
import { createEventDispatcher } from "svelte";

export let images = [];

const dispatch = createEventDispatcher();

</script>

<ul on:scroll={(ev) => {
    const elem = ev.currentTarget;
    `${elem.clientWidth} / ${elem.scrollWidth}`;
}}>
    {#each images as image, index}
        <li class:landscape={image.landscape} style="z-index: {1000 - index}; transform: rotate(0deg);">
            <img src={image.src} alt={image.alt} on:click={() => dispatch('image', image)}>
        </li>
    {/each}
</ul>

<style>

/* ============== tiles */

ul {
    margin: 0;
    padding: 0;
    overflow-x: auto;
    white-space: nowrap;
    text-align: center;
}

li {
    position: relative; /* to work with z-index */
    display: inline-block;
    list-style: none;
    margin: 12px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
}

img {
    display: block;
    height: 240px;
    cursor: pointer;
}

@media only screen and (min-width: 720px) {
}

</style>