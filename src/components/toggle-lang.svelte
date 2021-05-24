<script>

export let lang = '';

</script>

<div class="">
    <button class="border rounded-lg px-2" on:click={() => lang = 'en'}>en</button>
    <button class="border rounded-lg px-2" on:click={() => lang = 'ja'}>ja</button>
    current lang = {lang}
</div>
