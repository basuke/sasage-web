<script>

export let images = [];

</script>

<ul>
    {#each images as image}
        <li class:landscape={image.landscape}><div class="frame"><img src={image.path} alt=""></div></li>
    {/each}
</ul>

<style>

ul {
    margin: 0;
    padding-left: 0;
    display: flex;
    flex-wrap:wrap;
    justify-content: space-around;
    align-items: center;
    align-content: stretch;
}

ul > li {
    display: flex;
    list-style: none;
    max-width: 90%;
    margin-bottom: 8%;
}

ul > li div {
    max-width: 100%;
    background-color: white;
    padding: 3%;
    box-shadow: 0 4px 8px silver;
}

ul > li img {
    max-width: 100%;
    display: block;
}

@media only screen and (min-width: 720px) {
    ul > li {
        max-width: 42%;
    }

    ul > li.landscape {
        max-width: 80%;
    }
}

</style>
