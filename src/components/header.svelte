<script>

export let major = false;
export let title = undefined;
export let src = undefined;
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
        {#if src}
            <img class={major ? 'h1' : 'h2'} class:taller={/[gjpqy]/.test(title)} {src} alt={title}>
        {/if}
    {/if}
</header>

<style>

header {
    font-family: fredericka-the-greatest, serif;
    font-weight: 100;
    font-style: normal;
    font-size: x-large;
    text-align: center;
}

.anime img {
    height: 128px;
}

h1 {
    display: none;
}

img.h1 {
    margin-top: 2em;
    width: 90%;
    max-width: 510px;
}

h2 {
    display: none;
    margin: 0 0 1.6em;
}

img.h2 {
    height: 1.3em;
    margin-bottom: 2em;
}

img.h2.taller {
    height: 1.5em; /* because of "y", height is different :( */
}

</style>
