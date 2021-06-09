<script>

import { email } from '../app';

export let lang = '';

</script>

<article class="px-3 sm:px-0 max-w-xl mx-auto text-justify lg:max-w-2xl lg:text-lg">
    {#if lang === 'en'}
        <section>
            <p class="mb-6">
                Sasage Mayumi is a Japanese illustrator based in the San Francisco Bay Area.
                She graduated from Tokyo Zokei University with a bachelor’s degree in surface design.
                After graduating, she worked as a shoe designer in Tokyo, Japan for 13 years for many brands.
                She has created a picture book and illustrations inspired by Japanese traditional culture, art, and botanicals.
            </p>
            <p class="mb-6">
                Mayumi has been especially dedicated to creating picture books in recent years.
                She creates lyrical interplays of color and line in modern turns on traditional Japanese aesthetics.
                Her work captures a magical world in a way that invites the viewer to enter -
                and bring their imagination with them.
                She is interested and engages in mixed media such as hand drawing, printmaking, and digital.
                When not in her studio drawing, Mayumi loves taking care of plants, drawing with her daughter,
                and sharing meals with friends and family.
            </p>
        </section>
    {:else if lang === 'ja'}
        <section>
            <p class="mb-6">
                サンフランシスコ・ベイエリアを拠点に活動するイラストレーターのササゲマユミです。
                東京造形大学でテキスタイルデザインを専攻しました。
                卒業後は東京で13年間、多くのブランドのシューズデザイナーとして働いていましたが、2013年にサンフランシスコに移住。
                2020年よりフリーのイラストレーターとして活動しています。
            </p>
            <p class="mb-6">
                人物画を中心に食べ物や植物のイラストを得意とし、アナログとデジタルをミックスさせて独自の世界観を作っています。
                イラストレーションを見た人がその先の物語を想像できる様なイラストを目指しています。
                タッチはカラフルなストーリー性のあるイラスト、和モダン、白黒の線画など。
            </p>
            <p class="mb-6">
                最新のイラストはインスタに随時載せていますので、そちらもご覧ください。
                お仕事のご依頼は<a href="mailto:{email}" class="underline">メール</a>にてご連絡ください。
            </p>
        </section>
    {/if}
</article>
