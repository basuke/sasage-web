<script>

export let lang = '';

</script>

<div class="h-full mx-auto max-w-md px-6 flex flex-col justify-center items-center text-gray-500 font-light">
    <h1 class="mb-4 text-2xl text-red-400 text-center font-extralight">
        404<br>
        {#if lang === 'ja'}
            ページが見つかりません
        {:else}
            Sorry, Page not found
        {/if}
    </h1>
    <p class="text-justify">
        {#if lang === 'ja'}
            ご指定のページはこのウェブサイトには見つかりませんでした。URLをご確認の上、もう一度お試しください。
        {:else}
            The specified page was not found on this website. Please check the URL for mistakes and try again.
        {/if}
    </p>
</div>