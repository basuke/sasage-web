<style>
    /* ============== layout */

    .container {
        max-width: 1080px;
    }

    .white-bg {
        display: flex;
        justify-content: center;

        background-color: whitesmoke;
    }

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

    /* ============== about */

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

<script>

import ExternalLinks from "./components/external-links.svelte";
import Header from "./components/header.svelte";
import About from "./components/about.svelte";
import ImageGrid from "./components/image-grid.svelte";

const images = {
    flowers: [
        { path: "images/flowers/1.jpg" },
        { path: "images/flowers/2.jpg" },
        { path: "images/flowers/3.jpg" },
        { path: "images/flowers/4.jpg" },
        { path: "images/flowers/5.jpg" },
        { path: "images/flowers/6.jpg" },
        { path: "images/flowers/7.jpg" },
    ],
    foods: [
        { path: "images/foods/2.jpg", landscape: true },
        { path: "images/foods/3.jpg", landscape: true },
        { path: "images/foods/4.jpg", landscape: true },
        { path: "images/foods/5.jpg" },
        { path: "images/foods/6.jpg" },
    ],
    lillyAndCat: [
        { path: "images/lilliy-and-cat/lilly1.jpg" },
        { path: "images/lilliy-and-cat/lilly2.jpg" },
        { path: "images/lilliy-and-cat/lilly3.jpg" },
        { path: "images/lilliy-and-cat/lilly4.jpg" },
        { path: "images/lilliy-and-cat/lilly5.jpg" },
        { path: "images/lilliy-and-cat/lilly6.jpg" },
        { path: "images/lilliy-and-cat/lilly7.jpg", landscape: true },
    ],
    blackAndWhite: [
        { path: "images/black-and-white/bw1.jpg", landscape: true },
        { path: "images/black-and-white/bw2.jpg" },
        { path: "images/black-and-white/bw3.jpg" },
    ],
}

</script>

<div class="white-bg">
    <div class="container">
        <Header title="Mayumi Sasage" major subtitle="Illustrator &amp; Artist"/>
        <nav>
            <ExternalLinks/>
        </nav>

        <main>
            <section class="site-top">
                <picture>
                    <img src="images/foods/1.jpg" alt="Have a Picnic">
                </picture>
            </section>
            <section class="flowers">
                <Header title="Flowers" anime="images/anime-flowers.gif"/>
                <ImageGrid images={images.flowers}/>
            </section>
            <section class="foods">
                <Header title="Foods"/>
                <ImageGrid images={images.foods}/>
            </section>
            <section class="lilly-and-cat">
                <Header title="Lilly and Cat"/>
                <ImageGrid images={images.lillyAndCat}/>
            </section>
            <section class="black-and-white">
                <Header title="Black and White"/>
                <ImageGrid images={images.blackAndWhite}/>
            </section>
            <section class="about">
                <Header title="About"/>
                <About />
            </section>
        </main>
        <footer>
            <ExternalLinks/>
            <p>&copy; 2020 Mayumi Sasage. All rights reserved.</p>
        </footer>
    </div>
</div>
