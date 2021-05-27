<script>

import { Router, Route } from "svelte-navigator";

import Header from './components/header.svelte';
import ExternalLinks from './components/external-links.svelte';

import TopPage from './pages/top-page.svelte';
import CollectionPage from './pages/collection-page.svelte';
import ImagePage from './pages/image-page.svelte';
import NotFoundPage from './pages/not-found-page.svelte';

export let data = {};

let lang = "en";

</script>

<Router>
    <div class="container mx-auto flex flex-col h-screen text-gray-600">
        <Header {data} bind:lang />

        <main class="flex-auto">
            <Route path="/">
                <TopPage {data} {lang}/>
            </Route>

            <Route path="/collections/:id" let:params>
                <CollectionPage {data} {lang} id={params.id} />
            </Route>

            <Route path="/images/:id" let:params>
                <ImagePage {data} {lang} id={params.id} />
            </Route>

            <Route>
                <NotFoundPage/>
            </Route>
        </main>

        <footer class="text-center py-3">
            <ExternalLinks />
            <p class="text-xs sm:text-sm md:text-base py-4">&copy; 2020-2021 Mayumi Sasage. All rights reserved.</p>
        </footer>
    </div>
</Router>

<style>
</style>
