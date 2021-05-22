<script>

import { onMount } from 'svelte';
import ExternalLinks from './components/external-links.svelte';
import { flowers, foods, lillyAndCat, blackAndWhite } from './images.js';

let navFixed = false;
let navHeight = undefined;
let y = 0;

onMount(() => {
    navHeight = document.querySelector('#topNav').scrollHeight;
    y = window.scrollY;
});

$: navFixed = (navHeight > 0 && y > navHeight);

</script>

<svelte:window bind:scrollY={y}/>

<div class="flex flex-col min-h-screen text-gray-700">
    <header class="text-center">
        <nav id=topNav class="py-16">
            <h1 class="text-4xl font-extrabold">Mayumi Sasage</h1>
            <p class="text-2xl font-extralight">Illustrator &amp; Artist</p>
            <div class="text-center"><ExternalLinks /></div>
        </nav>
    </header>

    <main class="flex-auto">
        {#if navFixed}
            <div class="text-yellow-600">Fixed navHeight={navHeight}px</div>
        {:else}
            <div class="text-green-600">Not fixed navHeight={navHeight}px</div>
        {/if}
        <img src="/renew-march-2021/foods/5.jpg">
    </main>

    <footer class="text-center">
        <p>&copy; 2020-2021 Mayumi Sasage. All rights reserved.</p>
    </footer>
</div>

<style>
</style>
