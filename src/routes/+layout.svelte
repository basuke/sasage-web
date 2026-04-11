<script lang="ts">
    import type { Snippet } from 'svelte';
    import Header from '$lib/header.svelte';
    import Footer from '$lib/footer.svelte';
    import '../app.css';

    let { children }: { children: Snippet } = $props();
</script>

<div class="mx-auto flex flex-col h-screen text-gray-600">
    <Header />

    <main class="flex-auto">
        {@render children()}
    </main>

    <Footer />
</div>
