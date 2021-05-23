<script>

import ExternalLinks from './external-links.svelte';

import { imagePath } from '../app';

export let data = {};
export let lang = '';

const sections = ["Books", "Illustrations", "About"];

</script>

<header class="text-center">
    <nav id="topNav">
        <div class="fixed bg-white left-0 top-0">
            <button class="border rounded-lg px-2" on:click={() => lang = 'en'}>en</button>
            <button class="border rounded-lg px-2" on:click={() => lang = 'ja'}>ja</button>
            current lang = {lang}
        </div>
        <h1 class="my-3 text-4xl font-extrabold">Mayumi Sasage</h1>
        <p class="mb-3 text-2xl">Illustrator &amp; Artist</p>
        <div><ExternalLinks /></div>
    </nav>

    <img src={imagePath(data.topImages[0])} alt="top image">

    <nav class="my-3">
        <ul class="flex justify-center text-2xl font-semibold space-x-4">
            {#each sections as title}
                <li><a class="hover:underline" href={'/#' + title}>{title}</a></li>
            {/each}
        </ul>
    </nav>

    <div class=" fixed right-0 top-0">
        <div class="sm:hidden inline-block">-</div>
        <div class="md:hidden sm:inline-block hidden">sm: 640px</div>
        <div class="lg:hidden md:inline-block hidden">md: 768px</div>
        <div class="xl:hidden lg:inline-block hidden">lg: 1024px</div>
        <div class="2xl:hidden xl:inline-block hidden">xl: 1280px</div>
        <div class="2xl:inline-block hidden">2xl: 1536px</div>
    </div>
</header>

<style>
</style>
