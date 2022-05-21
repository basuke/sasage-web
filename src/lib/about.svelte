<script>
    import { email, agencyEmail } from '../data';
    import Img from '$lib/img.svelte';

    export let lang = '';
    export let data = {};
</script>

<article
    class="px-3 max-w-xl mx-auto text-justify sm:px-0 lg:flex lg:max-w-full lg:text-lg lg:justify-center lg:px-4"
>
    <div class="hidden max-w-sm pr-8 lg:block">
        <h2 class="my-5 text-3xl">&nbsp;</h2>
        <div><Img id="profile" {data} square /></div>
    </div>

    <div class="max-w-xl mb-12">
        <h2 class="my-4 text-center text-2xl md:text-3xl">ABOUT</h2>

        <div class="my-12 px-20 lg:hidden"><Img id="profile" {data} square /></div>

        {#if lang === 'en'}
            <section>
                <p class="mb-6">
                    Sasage Mayumi is a Japanese illustrator based in the San Francisco Bay Area. She
                    graduated from Tokyo Zokei University with a bachelor’s degree in surface
                    design. After graduating, she worked as a shoe designer in Tokyo, Japan for 13
                    years for many brands. She has created a picture book and illustrations inspired
                    by Japanese traditional culture, art, and botanicals.
                </p>
                <p class="mb-6">
                    Mayumi has been especially dedicated to creating picture books in recent years.
                    She creates lyrical interplays of color and line in modern turns on traditional
                    Japanese aesthetics. Her work captures a magical world in a way that invites the
                    viewer to enter - and bring their imagination with them. She is interested and
                    engages in mixed media such as hand drawing, printmaking, and digital. When not
                    in her studio drawing, Mayumi loves taking care of plants, drawing with her
                    daughter, and sharing meals with friends and family.
                </p>
                <p class="mb-6">
                    She's represented by Essie White at <a
                        href="https://www.stormliteraryagency.com/"
                        class="underline"
                        target="_blank">Storm Literary Agency</a
                    >.
                </p>
            </section>

            <h2 class="mt-12 mb-4 text-center text-2xl md:text-3xl">CONTACT</h2>
            <section class="text-left">
                <p class="mb-6">Always looking for new opportunities and exciting projects!</p>
                <p class="mb-6">
                    For publishing/book enquiries, please contact <a
                        href="mailto:{agencyEmail}"
                        class="underline">{agencyEmail}</a
                    >
                </p>
                <p class="mb-6">
                    For illustration work or questions, please email me at <a
                        href="mailto:{email}"
                        class="underline">{email}</a
                    >
                </p>
                <p class="mb-6">Thanks!</p>
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
                    お仕事のご依頼は<a href="mailto:{email}" class="underline">メール</a
                    >にてご連絡ください。
                </p>
            </section>
        {/if}
    </div>
</article>
