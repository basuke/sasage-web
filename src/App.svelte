<script>

import { Router, Link, Route } from "svelte-navigator";
import { imagePath } from "./app";

import Header from './components/header.svelte';
import About from './components/about.svelte';

import CollectionPage from './pages/collection-page.svelte';
import ImagePage from './pages/image-page.svelte';

export let data = {};

let lang = "en";

const books = data.collections.filter(collection => collection.book);
const illustrations = data.collections.find(collection => collection.id === 'illustrations');
console.log(illustrations);

</script>

<Router>
    <div class="container mx-auto flex flex-col h-screen text-gray-600">
        <Header {data} bind:lang />

        <main class="flex-auto">
            <Route path="/">
                <div id="Books">
                    <h2 class="my-4 text-center text-3xl">Books</h2>
                    <ul class="flex flex-wrap">
                        {#each books as collection}
                            <li class="w-full">
                                <Link to="/collection/{collection.id}">
                                    <img class="my-1 shadow-md" src={imagePath(collection.image)} alt={collection.title}>
                                </Link>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div id="Illustrations">
                    <h2 class="my-4 text-center text-3xl">Illustrations</h2>
                    <ul class="flex flex-wrap">
                        {#each illustrations.images as image}
                            <li class="w-full px-16">
                                <Link to="/image/{image}">
                                    <img class="my-8 shadow-lg" src={imagePath(image)} alt={image}>
                                </Link>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div id="About">
                    <h2 class="my-4 text-center text-3xl">About</h2>
                    <About {lang} />
                </div>
            </Route>

            <Route path="/collection/:id" let:params>
                <CollectionPage {data} {lang} id={params.id} />
            </Route>

            <Route path="/image/:id" let:params>
                <ImagePage {data} {lang} id={params.id} />
            </Route>

            <Route>
                <h1 class="text-9xl text-red-500 text-center">File not found</h1>
            </Route>
        </main>

        <footer class="text-center py-3">
            <p>&copy; 2020-2021 Mayumi Sasage. All rights reserved.</p>
        </footer>
    </div>
</Router>

<style>
</style>
