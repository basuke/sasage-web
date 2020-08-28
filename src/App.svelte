<style>
    h1 {
        font-size: 48px;
        text-transform: uppercase;
    
        margin-top: 0.8em;
        margin-bottom: 0;
    }
    
    h2 {
        font-size: 38px;
        margin: 0 0 1em;
    }
    
    p.subtitle {
        font-size: 23px;
        text-transform: uppercase;
        font-family: HelveticaNeue-Light, serif;
        color: #777;
    
        margin-top: -0.1em;
        margin-bottom: 0.2em;
    }

    /* ============== layout */

    .container {
        max-width: 1080px;
    }

    .white-bg {
        display: flex;
        justify-content: center;

        background-color: whitesmoke;
    }

    header {
        font-family: fredericka-the-greatest, serif;
        font-weight: 100;
        font-style: normal;
        font-size: x-large;
        text-align: center;
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

    /* ============== site title */

    header.title img {
        margin-top: 2em;
        width: 90%;
        max-width: 510px;
    }

    /* ============== top image */

    section.site-top img {
        margin: 2em 0 5em;
    }

    section.site-top img {
        display: block;
        width: 100%;
    }

    /* ============== headers */

    .anime img {
        height: 128px;
    }

    .black-and-white .anime img {
        height: 72px;
    }

    header img.h2 {
        height: 1.3em;
        margin-bottom: 2em;
    }

    /* ============== tiles */

    h2 {
        margin: 0 0 1.6em;
    }

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

    .about .en {
        font-size: 1.1rem;
    }

    .about article section {
        margin-bottom: 4em;
    }

    .about dt {
        font-weight: bold;
        font-size: 1rem;
    }

    .about dd {
        margin-inline-start: 0;
        margin-bottom: 1em;
    }

    @media only screen and (min-width: 840px) {
        .about {
            padding: 0;
        }

        article {
            display: flex;
            flex-wrap:wrap;
            justify-content: space-around;
            align-content: stretch;
        }

        .about > article > section {
            max-width: 42%;
        }
    }

</style>

<script>

import ExternalLinks from "./components/external-links.svelte";

</script>

<div class="white-bg">
    <div class="container">
        <header class="title">
            <h1>Mayumi Sasage</h1>
            <p class="subtitle">Illustrator &amp; Artist</p>
        </header>
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
                <header>
                    <div class="anime"><img src="images/anime-flowers.gif" alt="Icon of Flowers"></div>
                    <h2>Flowers</h2>
                </header>
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
                <header>
                    <h2>Foods</h2>
                </header>
                <ul class="tile">
                    <li class="landscape"><div class="frame"><img src="images/foods/2.jpg" alt=""></div></li>
                    <li class="landscape"><div class="frame"><img src="images/foods/3.jpg" alt=""></div></li>
                    <li class="landscape"><div class="frame"><img src="images/foods/4.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/foods/5.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/foods/6.jpg" alt=""></div></li>
                </ul>
            </section>
            <section class="lilly-and-cat">
                <header>
                    <h2>Lilly and Cat</h2>
                </header>
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
                <header>
                    <h2>Black and White</h2>
                </header>
                <ul class="tile">
                    <li class="landscape"><div class="frame"><img src="images/black-and-white/bw1.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/black-and-white/bw2.jpg" alt=""></div></li>
                    <li><div class="frame"><img src="images/black-and-white/bw3.jpg" alt=""></div></li>
                </ul>
            </section>
            <section class="about">
                <header>
                    <h2>About</h2>
                </header>
                <article>
                    <section class="en">
                        <p>
                            Mayumi Sasage is an illustrator and artist focused on the creation of illustrations with a poetic narrative inspired by nature and botanicals.
                            She is writing and illustrating a children's book and Oracle cards.
                            She explores mixed media such as hand drawing, printmaking and digital etc.
                            She utilizes color and line to convey mood and story.
                        </p>
                        <dl>
                            <dt>EDUCATION</dt>
                            <dd><em>1999</em>, Bachelor in textile design, Tokyo Zokei University, Tokyo/Japan.</dd>


                            <dt>EXPERIENCE</dt>
                            <dd><em>1999-2012</em>, Career as a shoe designer in Tokyo, Japan</dd>

                            <dd>
                                <em>2019-present</em>,  Freelance  illustrator based in San Francisco, USA
                            </dd>
                        </dl>
                    </section>
                    <section class="jp">
                        <p>
                            捧 真弓（ささげ まゆみ）はイラストレーター兼アーティストとして自然や植物、
                            人をテーマにした物語のイラスト作品を作成、
                            その他には絵本や本の挿絵を主に描いています。
                            彼女は人物(主に女性)と植物をモチーフとして幅広く使用し、
                            絵具や版画などを使った手描きのテクスチャとデジタルをミックスさせた表現を模索しています。
                            現在は45枚組のオラクルカードを制作中。
                        </p>
                        <dl>
                            <dt>1999</dt>
                            <dd>東京造形大学デザイン学科テキスタイルデザイン専攻卒業</dd>
                            <dt>1999-2012</dt>
                            <dd>シューズデザイナーとして数々のブランドのデザインを手がける</dd>
                            <dd>渡米後、2019年よりフリーのイラストレーターとして活動。サンフランシスコ在住</dd>
                        </dl>
                    </section>
                </article>
            </section>
        </main>
        <footer>
            <ExternalLinks/>
            <p>&copy; 2020 Mayumi Sasage. All rights reserved.</p>
        </footer>
    </div>
</div>
