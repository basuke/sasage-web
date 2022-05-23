<script lang="ts">
    import { fly } from 'svelte/transition';
    import { scrollToTop, scrollTo } from '../utils';
    import { data, tagPage } from '../data';
    import { tick } from 'svelte';
    import { page } from '$app/stores';
    import ExternalLinks from './external-links.svelte';
    import Container from './container.svelte';
    import SlideShow from './slideshow.svelte';
    import { goto } from '$app/navigation';

    const sections = [
        { title: 'Books', href: '/#Books' },
        { title: 'Illustrations', href: '/#Illustrations' },
        { title: 'About / Contact', href: '/#About' },
    ];

    // top page detection

    $: isTopPage = $page.url.pathname === '/';

    function linkToTop(ev: Event) {
        ev.preventDefault();

        if (isTopPage) {
            scrollToTop();
        } else {
            goto('/');
            tick().then(scrollToTop);
        }

        tagPage('/');
    }

    function linkToAnchor(ev: Event) {
        const target = ev?.target;
        if (target instanceof HTMLElement) {
            const hash = target.href.split('#')[1];
            if (!hash) return;
        }

        ev.preventDefault();

        if (isTopPage) {
            scrollTo('#' + hash);
        } else {
            goto('/');
            tick().then(() => scrollTo('#' + hash));
        }

        tagPage('/' + hash);
    }

    // fixed header

    let y = 0;
    let navElem: HTMLElement;
    const margin = 20;

    $: navFixed = navElem ? y > navElem.offsetTop + navElem.offsetHeight + margin : false;
</script>

<svelte:window bind:scrollY={y} />

<header class="text-center">
    {#if isTopPage}
        <nav bind:this={navElem} class="relative">
            <Container>
                <h1 class="mt-3 text-4xl md:text-5xl font-light">MAYUMI SASAGE</h1>
                <p class="mb-4 text-2xl font-extralight">Illustrator &amp; Artist</p>
                <div class="mb-4 px-4 md:text-right"><ExternalLinks /></div>

                <div class="lg:hidden">
                    <SlideShow {data} images={data.topImages} />
                </div>

                <div class="hidden lg:block">
                    <SlideShow {data} images={data.topImagesWide} wide />
                </div>

                <ul class="my-3 flex justify-center text-xl font-light space-x-4 text-gray-500">
                    {#each sections as { title, href }}
                        <li>
                            <a on:click={linkToAnchor} class="hover:underline" {href}>{title}</a>
                        </li>
                    {/each}
                </ul>
            </Container>
        </nav>
    {:else}
        <div class="h-24"><!-- Fixedなヘッダーのためのスペーサー --></div>
    {/if}

    {#if navFixed || !isTopPage}
        <div
            transition:fly={{ y: -40 }}
            class="fixed left-0 top-0 w-full p-2 text-left bg-white bg-opacity-90 border-b"
        >
            <div class="hidden md:inline-block absolute right-3 top-2"><ExternalLinks /></div>
            <dic class="flex justify-center">
                <h1 class="text-2xl font-bold">
                    <a on:click={linkToTop} href="/">Mayumi Sasage</a>
                </h1>
            </dic>

            <ul class="mt-2 flex justify-center text-lg font-light space-x-4 text-gray-500">
                {#each sections as { title, href }}
                    <li>
                        <a on:click={linkToAnchor} class="hover:underline" {href}>{title}</a>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}

    {#if data.debug}
        <div
            class="px-2 py-1 fixed right-1 bottom-1 text-xs rounded bg-blue-400 bg-opacity-70 text-indigo-100"
        >
            <div class="sm:hidden inline-block">: &lt; 640px</div>
            <div class="md:hidden sm:inline-block hidden">sm: 640px</div>
            <div class="lg:hidden md:inline-block hidden">md: 768px</div>
            <div class="xl:hidden lg:inline-block hidden">lg: 1024px</div>
            <div class="2xl:hidden xl:inline-block hidden">xl: 1280px</div>
            <div class="2xl:inline-block hidden">2xl: 1536px</div>
        </div>
    {/if}
</header>

<style>
</style>
