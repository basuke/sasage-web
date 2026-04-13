<script lang="ts">
    import type { Snippet } from 'svelte';
    import { page } from '$app/state';
    import Header from '$lib/header.svelte';
    import Footer from '$lib/footer.svelte';
    import '../app.css';

    let { children }: { children: Snippet } = $props();

    let isAdmin = $derived(page.url.pathname.startsWith('/admin'));
</script>

{#if isAdmin}
    {@render children()}
{:else}
    <div class="mx-auto flex flex-col h-screen text-gray-600">
        <Header />

        <main class="flex-auto">
            {@render children()}
        </main>

        <Footer />
    </div>
{/if}
