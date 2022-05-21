<script>
    import Header from './components/header.svelte';
    import Footer from './components/footer.svelte';

    import TopPage from './pages/top-page.svelte';
    import CollectionPage from './pages/collection-page.svelte';
    import ImagePage from './pages/image-page.svelte';
    import NotFoundPage from './pages/not-found-page.svelte';
    import SignInPage from './pages/signin-page.svelte';

    export let data = {};

    let lang = 'en';
</script>

<Router primary={false}>
    <div class="mx-auto flex flex-col h-screen text-gray-600">
        <Header {data} />

        <main class="flex-auto">
            <Route path="/">
                <TopPage {data} {lang} />
            </Route>

            <Route path="/collections/:id" let:params>
                <CollectionPage {data} {lang} id={params.id} />
            </Route>

            <Route path="/images/*id" let:params>
                <ImagePage {data} {lang} id={params.id} />
            </Route>

            <Route path="/admin/signin">
                <SignInPage {data} />
            </Route>

            <Route>
                <NotFoundPage {lang} />
            </Route>
        </main>

        <Footer {data} bind:lang />
    </div>
</Router>

<style>
</style>
