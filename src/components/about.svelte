<script>

import { fade } from 'svelte/transition';

export let lang = '';

</script>

<article>
    {#if lang === 'en'}
        <section transition:fade={{duration:100}} class="en">
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
    {:else if lang === 'ja'}
        <section transition:fade={{duration:100}} class="ja">
            <p>
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

.en {
    font-size: 1.1rem;
}

article > section {
    margin-bottom: 4em;
}

dt {
    font-weight: bold;
    font-size: 1rem;
}

dd {
    margin-inline-start: 0;
    margin-bottom: 1em;
}

@media only screen and (min-width: 840px) {
    article {
        display: flex;
        flex-wrap:wrap;
        justify-content: space-around;
        align-content: stretch;
    }

    article > section {
        max-width: 42%;
    }
}

</style>