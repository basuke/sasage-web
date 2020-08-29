<script>

export let title = "";
export let anime = "";
export let subtitle = "";
export let major = false;

</script>

<header>
    {#if anime}
        <div class="anime"><img src={anime} alt="Icon of {title}"></div>
    {/if}
    {#if major}
        <h1>{title}</h1>
    {:else}
        <h2>{title}</h2>
    {/if}
    {#if subtitle}
        <p class="subtitle">{subtitle}</p>
    {/if}
</header>

<style>

header {
    text-align: center;
}

h1, h2 {
    font-family: fredericka-the-greatest, serif;
    font-style: normal;
    font-weight: 400;
}

h1 {
    font-size: 48px;
    text-transform: uppercase;

    margin-top: 0.8em;
    margin-bottom: 0;
}

h2 {
    font-size: 38px;
    margin: 0 0 1em;
}

p.subtitle {
    font-size: 23px;
    text-transform: uppercase;
    font-family: HelveticaNeue-Light, serif;
    color: #777;

    margin-top: -0.1em;
    margin-bottom: 0.2em;
}

.anime img {
    height: 128px;
}

</style>
