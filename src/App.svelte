<script>

import { Router, Link, Route } from "svelte-navigator";

import Header from './components/header.svelte';
import About from './components/about.svelte';
import ImageGrid from './components/image-grid.svelte';

import ImagePage from './pages/image-page.svelte';

export let data = {};

</script>

<Router>
    <div class="container mx-auto flex flex-col h-screen text-gray-600">
        <Header {data} />

        <main class="flex-auto">
            <Route path="/">
                <div id="Books">
                    <h2 class="my-4 text-center text-3xl">Books</h2>
                    <ImageGrid images={data.books} category="Books" />
                </div>

                <div id="Illustrations">
                    <h2 class="my-4 text-center text-3xl">Illustrations</h2>
                    <ImageGrid images={data.illustrations} category="Illustrations" />
                </div>

                <div id="About">
                    <h2 class="my-4 text-center text-3xl">About</h2>
                    <About />
                </div>
            </Route>

            <Route path="/images/*imageId" component={ImagePage} />

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
