<script>

import { onDestroy } from "svelte";
import { findImage } from "../app";
import { fade } from 'svelte/transition';

import Img from './img.svelte';

export let data = {};
export let images = [];

const interval = 8000;

const imageQueue = images.map(id => findImage(data.images, id));
const pickImage = () => {
    const index = Math.floor(Math.random() * imageQueue.length);
    return imageQueue.splice(index, 1)[0];
}

let stack = [pickImage(), pickImage()];
const spaceHolderImage = stack[0];

const ticket = setInterval(() => {
    const prevImage = stack[0];
    stack = [stack[1], pickImage()];
    imageQueue.push(prevImage);
}, interval);

onDestroy(() => clearInterval(ticket));

</script>

<div class="relative">
    <div class="opacity-0">
        <Img image={spaceHolderImage} square/>
    </div>
    {#each stack as image, index (image.id)}
        <div in:fade={{duration: 2000}} class="absolute top-0 left-0">
            <Img image={image} square/>
        </div>
    {/each}
</div>

<style>

</style>