<script>

import ExternalLinks from "./components/external-links.svelte";
import About from "./about.svelte";
import ImageGrid from "./components/image-grid.svelte";
import Preview from "./components/preview.svelte";
import Parallax from "./components/parallax.svelte";
import { onMount } from 'svelte';
import { fly } from 'svelte/transition';

import { flowers, foods, lillyAndCat, blackAndWhite } from './images.js';

let featured = null;

let navHeight = undefined;
let y = 0;
let navFixed = true;

function imageTapped(ev) {
    const image = ev.detail;
    featured = image;
    document.querySelector('body').classList.add('dontScroll');
}

function clearFeatured() {
    featured = null;
    document.querySelector('body').classList.remove('dontScroll');
}

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
            <h1>Mayumi Sasage</h1>
            <p class="subtitle">Illustrator &amp; Artist</p>
        </header>
        <div class="external-link">
            <ExternalLinks/>
        </div>
    </nav>

    <main>
        <section class="site-top">
            <Parallax/>
        </section>
        <section>
            <header>
                <h2>Flowers</h2>
            </header>
            <ImageGrid images={flowers} on:image={imageTapped}/>
        </section>
        <section>
            <header>
                <h2>Foods</h2>
            </header>
            <ImageGrid images={foods} on:image={imageTapped}/>
        </section>
        <section>
            <header>
                <h2>Lilly and Cat</h2>
            </header>
            <ImageGrid images={lillyAndCat} on:image={imageTapped}/>
        </section>
        <section>
            <header>
                <h2>Black and White</h2>
            </header>
            <ImageGrid images={blackAndWhite} on:image={imageTapped}/>
        </section>
        <section class="about">
            <header>
                <h2>About</h2>
            </header>
            <About/>
        </section>
    </main>

    <footer>
        <p>&copy; 2020-2021 Mayumi Sasage. All rights reserved.</p>
    </footer>
</div>

{#if navFixed}
    <nav transition:fly="{{ y:-50, opacity:0}}" class="nav-fixed">
        <h2>Mayumi Sasage</h2>
        <ExternalLinks/>
    </nav>
{/if}

{#if featured}
    <Preview image={featured} on:close={clearFeatured} />
{/if}

<style>

:global(body) {
    background-color: whitesmoke;
}

:global(body.dontScroll) {
    overflow: hidden;
}

/* ============== layout */

.container {
    margin: 0;
    padding: 0;
    min-height: 100vh;
}

header {
    text-align: center;
}

/* =============== nav */

nav {
    display: flex;
    flex-direction: column;
    align-items: center;
}

nav.nav-fixed {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1500;
    background-color: white;
    /* background-color: rgba(255, 255, 255, 0.5); */
    padding: 10px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

nav.nav-fixed h2 {
    margin: 0;
    padding-right: 1em;
    font-size: 38px;
}

/* =============== about */

.about {
    margin-top: 2em;
    padding: 0 2em;
}

@media only screen and (min-width: 840px) {
    .about {
        padding: 0;
    }

}

/* =============== footer */

footer {
    text-align: center;
}

</style>
