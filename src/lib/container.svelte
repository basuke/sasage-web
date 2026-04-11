<script>
    let { className = '', children } = $props();
</script>

<div class="{className} xl:container xl:mx-auto">
    {@render children()}
</div>
