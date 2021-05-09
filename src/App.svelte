<script>

import { onMount } from 'svelte';

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

<div class="container">
    <nav id=topNav>
        <header>
            <h1 class="text-xl font-extrabold bg-purple-400">Mayumi Sasage</h1>
            <p class="subtitle">Illustrator &amp; Artist</p>
        </header>
    </nav>

    <main>

    </main>

    <footer>
        <p>&copy; 2020-2021 Mayumi Sasage. All rights reserved.</p>
    </footer>
</div>

<style>
</style>
