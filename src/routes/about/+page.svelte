<script lang="ts">
    import Container from '$lib/container.svelte';
    import { email, lang, agencyEmail } from '$lib/data';
    import Img from '$lib/img.svelte';

    const awards = [
        {
            text: "WorldIllustrationawards 2021: long list",
            url: "https://theaoi.com/wia/mayumi-sasage-lost-in-the-rain/",
        },
        {
            text: "3x3 International Illustration Show No.19 2022: Honorable Mention",
            url: "https://3x3mag.com/annuals/annual19/s/sasage-mayumi-91175",
        },
    ];

    const awardsEn = [
        ...awards,
    ];

    const awardsJa = [
        {
            text: "Gallery House Maya, 装画を描くコンペティション　vol.11 入選",
            url: "",
        },
        ...awards,
    ];

</script>

<svelte:head>
    <title>About Mayumi Sasage : Illustrator &amp; Artist</title>
</svelte:head>

<Container>
    <article class="px-3 max-w-xl mx-auto text-justify sm:px-0 lg:flex lg:max-w-full lg:text-lg lg:justify-center lg:px-4">
        <div class="hidden max-w-sm pr-8 lg:block">
            <div class="my-5 text-3xl">&nbsp;</div>
            <div><Img id="profile" square /></div>
        </div>
    
        <div class="max-w-xl mb-12">
            <h2 class="my-4 text-center text-2xl md:text-3xl">ABOUT</h2>
    
            <div class="my-12 px-20 lg:hidden"><Img id="profile" square /></div>
    
            {#if $lang === 'en'}
                <section class="space-y-6">
                    <p>
                        Sasage Mayumi is a Japanese illustrator based in the San Francisco Bay Area. She
                        graduated from Tokyo Zokei University with a bachelor’s degree in surface
                        design. After graduating, she worked as a shoe designer in Tokyo, Japan for 13
                        years for many brands. She has created a picture book and illustrations inspired
                        by Japanese traditional culture, art, and botanicals.
                    </p>
                    <p>
                        Mayumi has been especially dedicated to creating picture books in recent years.
                        She creates lyrical interplays of color and line in modern turns on traditional
                        Japanese aesthetics. Her work captures a magical world in a way that invites the
                        viewer to enter - and bring their imagination with them. She is interested and
                        engages in mixed media such as hand drawing, printmaking, and digital. When not
                        in her studio drawing, Mayumi loves taking care of plants, drawing with her
                        daughter, and sharing meals with friends and family.
                    </p>
                    <p>
                        She's represented by Essie White at <a
                            href="https://www.stormliteraryagency.com/"
                            class="underline"
                            target="_blank">Storm Literary Agency</a
                        >.
                    </p>
                </section>
            {:else if $lang === 'ja'}
                <section class="space-y-6">
                    <p>
                        サンフランシスコ・ベイエリアを拠点に活動するイラストレーターのササゲマユミです。
                        東京造形大学でテキスタイルデザインを専攻しました。
                        卒業後は東京で13年間、多くのブランドのシューズデザイナーとして働いていましたが、2012年にサンフランシスコに移住。
                        2020年よりフリーのイラストレーターとして活動しています。
                    </p>
                    <p>
                        人物画を中心に食べ物や植物のイラストを得意とし、アナログとデジタルをミックスさせて独自の世界観を作っています。
                        イラストレーションを見た人がその先の物語を想像できる様なイラストを目指しています。
                        タッチはカラフルなストーリー性のあるイラスト、和モダン、白黒の線画など。
                    </p>
                    <p>
                        最新のイラストはインスタに随時載せていますので、そちらもご覧ください。
                        お仕事のご依頼は<a href="mailto:{email}" class="underline">メール</a
                        >にてご連絡ください。
                    </p>
                </section>
            {/if}
    
            <h2 class="mt-12 mb-4 text-center text-2xl md:text-3xl">AWARDS</h2>
            <section class="text-left space-y-2 pl-2">
                {#each ($lang === 'ja' ? awardsJa : awardsEn) as award}
                    <li class="list-disc">
                        {#if award.url}
                            <a class="underline" href={award.url} target="_blank">
                                {award.text}
                            </a>
                        {:else}
                            {award.text}
                        {/if}
                    </li>
                {/each}
            </section>
    
            {#if $lang === 'en'}
                <h2 class="mt-12 mb-4 text-center text-2xl md:text-3xl">CONTACT</h2>
                <section class="text-left space-y-6">
                    <p>Always looking for new opportunities and exciting projects!</p>
                    <p>
                        For publishing/book enquiries, please contact <a
                            href="mailto:{agencyEmail}"
                            class="underline">{agencyEmail}</a
                        >
                    </p>
                    <p>
                        For illustration work or questions, please email me at <a
                            href="mailto:{email}"
                            class="underline">{email}</a
                        >
                    </p>
                    <p>Thanks!</p>
                </section>
            {/if}
        </div>
    </article>
</Container>
