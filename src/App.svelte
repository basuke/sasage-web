<script>

import Header from "./components/header.svelte";
import ExternalLinks from "./components/external-links.svelte";
import About from "./about.svelte";
import ImageGrid from "./components/image-grid.svelte";

import { flowers, foods, lillyAndCat, blackAndWhite } from './images.js';
import Parallax from "./components/parallax.svelte";

</script>

<div class="white-bg">
    <div class="container">
        <Header major title="Mayumi Sasage" subtitle="Illustrator & Artist" />
        <nav>
            <ExternalLinks/>
        </nav>

        <main>
            <section class="site-top">
                <Parallax/>
            </section>
            <section>
                <Header title="Flowers"/>
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

.white-bg {
    justify-content: center;

    background-color: whitesmoke;
}

/* ============== layout */

.container {
    margin: 0;
    padding: 0;
    min-height: 100vh;
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
