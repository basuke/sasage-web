<script lang="ts">
    import Header from '$lib/header.svelte';
    import Footer from '$lib/footer.svelte';
    import '../app.css';
    import { data } from '../data';

    let lang: string = 'en';
</script>

<div class="mx-auto flex flex-col h-screen text-gray-600">
    <Header {data} />

    <main class="flex-auto">
        <slot />
    </main>

    <Footer bind:lang />
</div>
<slot />
