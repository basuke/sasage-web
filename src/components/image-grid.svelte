<script>

import { Link } from "svelte-navigator";
import { imagePath } from "../app";

export let images = [];
export let category = "works";

</script>

<ul class="flex flex-wrap">
    {#each images as image}
        <li class="w-full">
            <Link to="/images/{image.name}">
                <img class="my-1 shadow-md" src={imagePath(image)} alt={category}>
            </Link>
        </li>
    {/each}
</ul>

<style>
</style>
