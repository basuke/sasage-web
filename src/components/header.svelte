<script>

import { onMount } from 'svelte';
import { fly } from 'svelte/transition';
import { useLocation } from "svelte-navigator";

import ExternalLinks from './external-links.svelte';

import { imagePath } from '../app';

export let data = {};

const sections = ["Books", "Illustrations", "About"];

// top page detection

const location = useLocation();
$: isTopPage = $location.pathname === '/';

// fixed header

let y = 0;
let topNav;
let topNavThreshold = undefined;
const margin = 20;

onMount(() => {
    if (topNav) {
        topNavThreshold = topNav.offsetTop + topNav.offsetHeight + margin;
    }
});

$: topNavFixed = topNav ? (y > topNavThreshold) : false;

</script>

<svelte:window bind:scrollY={y} />

<header class="text-center">

    {#if isTopPage}
        <nav bind:this={topNav}>
            <h1 class="my-3 text-4xl font-extrabold">Mayumi Sasage</h1>
            <p class="mb-3 text-2xl">Illustrator &amp; Artist</p>
            <div><ExternalLinks /></div>
        </nav>

        <img src={imagePath(data.topImages[0], '-w400')} alt="top image">
    {:else}
        <div class="h-20"><!-- Fixedなヘッダーのためのスペーサー --></div>
    {/if}

    {#if topNavFixed || !isTopPage}
        <div transition:fly={{y:-40}} class="fixed left-0 top-0 w-full p-2 text-left bg-white bg-opacity-90 border-b">
            <dic class="flex justify-between">
                <h1 class="text-2xl font-bold"><a href="/">Mayumi Sasage</a></h1>
            </dic>
        </div>
    {/if}

    <nav class="my-3">
        <ul class="flex justify-center text-2xl font-semibold space-x-4">
            {#each sections as title}
                <li><a class="hover:underline" href={'/#' + title}>{title}</a></li>
            {/each}
        </ul>
    </nav>

    <div class=" fixed right-0 top-0">
        <div class="sm:hidden inline-block">: &lt; 640px</div>
        <div class="md:hidden sm:inline-block hidden">sm: 640px</div>
        <div class="lg:hidden md:inline-block hidden">md: 768px</div>
        <div class="xl:hidden lg:inline-block hidden">lg: 1024px</div>
        <div class="2xl:hidden xl:inline-block hidden">xl: 1280px</div>
        <div class="2xl:inline-block hidden">2xl: 1536px</div>
    </div>
</header>

<style>
</style>
