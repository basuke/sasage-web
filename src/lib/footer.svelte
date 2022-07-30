<script>
    import ExternalLinks from './external-links.svelte';
    import ToggleLang from './toggle-lang.svelte';
</script>

<footer class="text-center mt-3 py-3">
    <ExternalLinks />
    <p class="text-xs sm:text-sm md:text-base py-4">
        &copy; 2020-2022 Mayumi Sasage. All rights reserved.
    </p>
</footer>

<div class="sm:block text-right fixed right-4 bottom-4">
    <ToggleLang />
</div>
