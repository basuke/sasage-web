<script>

const links = [
    {
        type: "fab fa-behance",
        url: "https://www.behance.net/mayumi-sasage/",
        target: "_blank",
    },
    { type: "fab fa-instagram", url: "https://www.instagram.com/mayumi.sasage/", target: "_blank" },
    {
        type: "fab fa-twitter",
        url: "https://twitter.com/SasageMayumi",
        target: "_blank",
    },
    { type: "far fa-envelope", url: "mailto:sasage.mayumi@gmail.com", target: "_self" },
];

</script>

<ul class="inline-flex">
    {#each links as link}
        <li class="px-2">
            <a href={link.url} target={link.target} rel="noreferrer">
                <i class="{link.type} fa-2x"></i>
            </a>
        </li>
    {/each}
</ul>

<style>

a i {
    color: darkgray;
    text-shadow: 0px 2px 2px silver;
    transition: color 0.5s ease;
}

a:hover i {
    color: turquoise;
    text-shadow: 0px 2px 2px silver;
}

</style>
