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

    .about p {
        text-align: justify;
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
import Header from "./components/header.svelte";

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
