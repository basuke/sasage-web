<script>

import { onDestroy } from "svelte";
import { findImage } from "../app";
import { fade } from 'svelte/transition';

import Img from './img.svelte';

export let data = {};
export let images = [];
export let wide = false;

const interval = 8000;
let duration = 0;
const regularDuration = 2000;

const imageQueue = images.map(id => findImage(data.images, id));
const pickImage = () => {
    const index = Math.floor(Math.random() * imageQueue.length);
    return imageQueue.splice(index, 1)[0];
}

let stack = [pickImage(), pickImage()];
const spaceHolderImage = stack[0];

const ticket = setInterval(() => {
    const prevImage = stack[0];

    duration = regularDuration;
    stack = [stack[1], pickImage()];

    imageQueue.push(prevImage);
}, interval);

onDestroy(() => clearInterval(ticket));

</script>

<div class="relative">
    <div class="opacity-0">
        <Img image={spaceHolderImage} square={!wide} {wide} />
    </div>
    {#each stack as image (image.id)}
        <div in:fade={{duration}} class="absolute top-0 left-0">
            <Img image={image} square={!wide} {wide} />
        </div>
    {/each}
</div>

<style>

</style>