<script lang="ts">
    import Header from '$lib/header.svelte';
    import Footer from '$lib/footer.svelte';
    import '../app.css';
</script>

<div class="mx-auto flex flex-col h-screen text-gray-600">
    <Header />

    <main class="flex-auto">
        <slot />
    </main>

    <Footer />
</div>
