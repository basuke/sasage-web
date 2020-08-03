<script>

export let images = [];

</script>

<ul class="tile">
    {#each images as image}
        <li class:landscape={image.landscape}><div class=frame><img src={image.src} alt={image.alt}></div></li>
    {/each}
</ul>

<style>

/* ============== tiles */

ul.tile {
    margin: 0;
    padding-left: 0;
    display: flex;
    flex-wrap:wrap;
    justify-content: space-around;
    align-items: center;
    align-content: stretch;
}

ul.tile > li {
    display: flex;
    list-style: none;
    max-width: 90%;
    margin-bottom: 8%;
}

ul.tile > li div {
    max-width: 100%;
    background-color: white;
    padding: 3%;
    box-shadow: 0 4px 8px silver;
}

ul.tile > li img {
    max-width: 100%;
    display: block;
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