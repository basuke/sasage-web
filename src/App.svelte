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

    /* ============== tiles */

    ul.tile {
        margin: 0;
        padding-left: 0;
        display: flex;
        flex-wrap:wrap;
        justify-content: space-around;
        align-items: center;
        align-content: stretch;
    }

    ul.tile > li {
        display: flex;
        list-style: none;
        max-width: 90%;
        margin-bottom: 8%;
    }

    ul.tile > li div {
        max-width: 100%;
        background-color: white;
        padding: 3%;
        box-shadow: 0 4px 8px silver;
    }

    ul.tile > li img {
        max-width: 100%;
        display: block;
    }

    @media only screen and (min-width: 720px) {
        ul.tile > li {
            max-width: 42%;
        }

        ul.tile > li.landscape {
            max-width: 80%;
        }
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
                <ul class="tile">
                    <li><div class="frame"><img src="images/flowers/1.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/flowers/2.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/flowers/3.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/flowers/4.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/flowers/5.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/flowers/6.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/flowers/7.jpg" alt=""></div></li>
                </ul>
            </section>
            <section class="foods">
                <Header title="Foods"/>
                <ul class="tile">
                    <li class="landscape"><div class="frame"><img src="images/foods/2.jpg" alt=""></div></li>
                    <li class="landscape"><div class="frame"><img src="images/foods/3.jpg" alt=""></div></li>
                    <li class="landscape"><div class="frame"><img src="images/foods/4.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/foods/5.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/foods/6.jpg" alt=""></div></li>
                </ul>
            </section>
            <section class="lilly-and-cat">
                <Header title="Lilly and Cat"/>
                <ul class="tile">
                    <li><div class="frame"><img src="images/lilliy-and-cat/lilly1.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/lilliy-and-cat/lilly2.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/lilliy-and-cat/lilly3.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/lilliy-and-cat/lilly4.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/lilliy-and-cat/lilly5.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/lilliy-and-cat/lilly6.jpg" alt=""></div></li>
                    <li class="landscape"><div class="frame"><img src="images/lilliy-and-cat/lilly7.jpg" alt=""></div></li>
                </ul>
            </section>
            <section class="black-and-white">
                <Header title="Black and White"/>
                <ul class="tile">
                    <li class="landscape"><div class="frame"><img src="images/black-and-white/bw1.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/black-and-white/bw2.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/black-and-white/bw3.jpg" alt=""></div></li>
                </ul>
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
