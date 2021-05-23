<script>

import { Router, Link, Route } from "svelte-navigator";

import Header from './components/header.svelte';
import About from './components/about.svelte';

import ImagePage from './pages/image-page.svelte';

import { data, imagePath } from './app';

</script>

<Router>
    <div class="container mx-auto flex flex-col h-screen text-gray-700">
        <Header />

        <main class="flex-auto">
            <Route path="/">
                <h2 id="Books">Books</h2>
                <div class="flex flex-wrap">
                    {#each data.books as image}
                        <div class="w-1/2">
                            <Link to="/images/{image.name}"><img src={imagePath(image)} alt="books"></Link>
                        </div>
                    {/each}
                </div>

                <h2 id="Illustrations">Illustrations</h2>
                <div class="flex flex-wrap">
                    {#each data.illustrations as image}
                        <div class="w-1/2">
                            <Link to="/images/{image.name}"><img src={imagePath(image)} alt="illustratioins"></Link>
                        </div>
                    {/each}
                </div>
                <div>
                    <h2 id="About">About</h2>
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
