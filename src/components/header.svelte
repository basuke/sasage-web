<script>

import { onMount } from 'svelte';
import { fly } from 'svelte/transition';
import { useLocation } from "svelte-navigator";

import ExternalLinks from './external-links.svelte';

import { data, imagePath } from '../app';

const location = useLocation();

let navFixed = false;
let navHeight = undefined;
let y = 0;
const margin = 20;

onMount(() => {
    navHeight = document.querySelector('#topNav').scrollHeight + margin;
    y = window.scrollY;
});

$: navFixed = (navHeight > 0 && y > navHeight);

const sections = ["Books", "Illustrations", "About"];

</script>

<svelte:window bind:scrollY={y}/>

<header class="text-center">
    <nav id="topNav">
        <h1 class="my-3 text-4xl font-extrabold">Mayumi Sasage</h1>
        <p class="mb-3 text-2xl">Illustrator &amp; Artist</p>
        <div><ExternalLinks /></div>
    </nav>
    {#if navFixed}
        <nav transition:fly={{y:-40}} class="fixed top-0 left-0 w-full bg-white border-b">
            <h1 class="my-3 text-2xl font-extrabold">Mayumi Sasage</h1>
            Fixed navHeight={navHeight}px
        </nav>
    {/if}
    <div>pathname: {$location.pathname} hash: {$location.hash} search: {$location.search}</div>
    {#if $location.pathname === '/'}
        <img src={imagePath(data.topImages[0])} alt="top image">
    {/if}

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
