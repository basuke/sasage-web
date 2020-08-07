<script>

import Header from "./components/header.svelte";
import ExternalLinks from "./components/external-links.svelte";
import About from "./about.svelte";
import ImageGrid from "./components/image-grid.svelte";

import { flowers, foods, lillyAndCat, blackAndWhite } from './images.js';

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
                    <img src="images/foods/1.jpg" alt="Have a Picnic">
                </picture>
            </section>
            <section>
                <Header title="Flowers" anime="images/anime-flowers.gif" />
                <ImageGrid images={flowers}/>
            </section>
            <section>
                <Header title="Foods" />
                <ImageGrid images={foods}/>
            </section>
            <section>
                <Header title="Lilly and Cat" />
                <ImageGrid images={lillyAndCat}/>
            </section>
            <section>
                <Header title="Black and White" />
                <ImageGrid images={blackAndWhite}/>
            </section>
            <section class="about">
                <Header title="About" />
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
