<script>

export let major = false;
export let title = undefined;
export let subtitle = undefined;
export let anime = undefined;
export let style = undefined;

</script>

<header>
    <slot/>
    {#if title}
        {#if anime}
            <div class="anime"><img src={anime} alt="Icon of {title}" {style}></div>
        {/if}

        {#if major}
            <h1>{title}</h1>
        {:else}
            <h2>{title}</h2>
        {/if}
        {#if subtitle}
            <p class="subtitle">{subtitle}</p>
        {/if}
    {/if}
</header>

<style>

header {
    text-align: center;
}

.anime img {
    height: 128px;
}

</style>
