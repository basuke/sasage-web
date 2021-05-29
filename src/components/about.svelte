<script>

import { fade } from 'svelte/transition';

export let lang = '';

</script>

<article class="px-3 sm:px-0 max-w-xl mx-auto text-justify lg:max-w-2xl lg:text-lg">
    {#if lang === 'en'}
        <section>
            <p class="mb-6">
                Sasage Mayumi is a Japanese illustrator based in the San Francisco Bay Area. She graduated from Tokyo Zokei University with a bachelor’s degree in surface design. After graduating, she worked as a shoe designer in Tokyo, Japan for 13 years for many brands. She has created a picture book and illustrations inspired by Japanese traditional culture, art, and botanicals.
            </p>
            <p class="mb-6">
                Mayumi has been especially dedicated to creating picture books in recent years. She creates lyrical interplays of color and line in modern turns on traditional Japanese aesthetics,. Her work captures a magical world in a way that invites the viewer to enter - and bring their imagination with them. She is interested and engages in mixed media such as hand drawing, printmaking, and digital.When not in her studio drawing, Mayumi loves taking care of plants, drawing with her daughter, and sharing meals with friends and family.
            </p>
        </section>
    {:else if lang === 'ja'}
        <section>
            <p class="mb-6">
                捧 真弓（ささげ まゆみ）はイラストレーター兼アーティストとして自然や植物、
                人をテーマにした物語のイラスト作品を作成、
                その他には絵本や本の挿絵を主に描いています。
                彼女は人物(主に女性)と植物をモチーフとして幅広く使用し、
                絵具や版画などを使った手描きのテクスチャとデジタルをミックスさせた表現を模索しています。
            </p>
            <dl>
                <dt>1999</dt>
                <dd>東京造形大学デザイン学科テキスタイルデザイン専攻卒業</dd>
                <dt>1999-2012</dt>
                <dd>シューズデザイナーとして数々のブランドのデザインを手がける</dd>
                <dd>渡米後、2019年よりフリーのイラストレーターとして活動。サンフランシスコ在住</dd>
            </dl>
        </section>
    {/if}
</article>

<style>

dt {
    font-weight: bold;
    font-size: 1rem;
}

dd {
    margin-inline-start: 0;
    margin-bottom: 1em;
}

</style>