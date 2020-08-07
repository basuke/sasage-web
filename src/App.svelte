<script>

import Header from "./components/header.svelte";
import ExternalLinks from "./components/external-links.svelte";
import About from "./about.svelte";
import ImageGrid from "./components/image-grid.svelte";

import { flowers, lillyAndCat, blackAndWhite } from './images.js';

</script>

<div class="white-bg">
    <div class="container">
        <Header major title="Mayumi Sasage" subtitle="Illustrator & Artist" />
        <nav>
            <ExternalLinks/>
        </nav>

        <main>
            <section class="site-top">
                <picture>
                    <source media="(min-width: 640px)" srcset="images/cover-wide.jpg">
                    <img src="images/cover.jpg" alt="Lilly in Pansy">
                </picture>
            </section>
            <section>
                <Header title="Flowers" src="images/header-flowers.png" anime="images/anime-flowers.gif" />
                <ImageGrid images={flowers}/>
            </section>
            <section>
                <Header title="Lilly and Cat" src="images/header-lilly-and-cat.png" anime="images/anime-lilly-and-cat.gif" />
                <ImageGrid images={lillyAndCat}/>
            </section>
            <section>
                <Header title="Black and White" src="images/header-black-and-white.png" anime="images/anime-black-and-white.gif" style="height: 72px"/>
                <ImageGrid images={blackAndWhite}/>
            </section>
            <section class="about">
                <Header title="About" src="images/header-about.png" />
                <About/>
            </section>
        </main>

        <footer>
            <ExternalLinks/>
            <p>&copy; 2020 Mayumi Sasage. All rights reserved.</p>
        </footer>
    </div>
</div>




<style>

.container {
    max-width: 1080px;
}

.white-bg {
    display: flex;
    justify-content: center;

    background-color: whitesmoke;
}

/* ============== layout */

.container {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-height: 100vh;
}

.container > * {
    display: flex;
    flex-direction: column;
    align-items: center;
}


main {
    flex: 1;
}

/* ============== top image */

section.site-top img {
    margin: 2em 0 5em;
}

section.site-top img {
    display: block;
    width: 100%;
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

</style>
