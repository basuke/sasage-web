<script>

export let images = [];

</script>

<ul>
    {#each images as image}
        <li class:landscape={image.landscape}>
            <img src={image.src} alt={image.alt}>
        </li>
    {/each}
</ul>

<style>

/* ============== tiles */

ul {
    margin: 0;
    padding-left: 0;
    overflow-x: scroll;
    white-space: nowrap;
    width: 100%;
}

li {
    display: inline-block;
    list-style: none;
}

img {
    height: 200px;
    cursor: pointer;
}

@media only screen and (min-width: 720px) {
    ul.tile > li {
        max-width: 42%;
    }

    ul.tile > li.landscape {
        max-width: 80%;
    }
}

</style>