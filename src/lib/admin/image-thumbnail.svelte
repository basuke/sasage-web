<script lang="ts">
    import { imagePath } from '$lib/data';
    import type { Image } from '$lib/data';
    import type { ImageUsage } from './image-filter';

    let {
        image,
        usages = [],
        ondelete,
    }: {
        image: Image;
        usages?: ImageUsage[];
        ondelete?: (id: string) => void;
    } = $props();

    let imgError = $state(false);

    let isUsed = $derived(usages.length > 0);

    function handleDelete() {
        if (isUsed || !ondelete) return;
        ondelete(image.id);
    }
</script>

<div class="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white">
    {#if imgError}
        <div class="w-full aspect-square bg-gray-100 flex items-center justify-center">
            <span class="text-gray-400 text-xs">Failed to load</span>
        </div>
    {:else}
        <img
            src={imagePath(image.id, 'square')}
            alt={image.id}
            class="w-full aspect-square object-cover"
            loading="lazy"
            onerror={() => { imgError = true; }}
        />
    {/if}

    <a
        href="/admin/images/{image.id}"
        class="absolute inset-0 bottom-auto aspect-square bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all"
    >
        <span class="absolute bottom-0 left-0 right-0 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="block truncate font-mono">{image.id}</span>
            <span class="block">{image.width}&times;{image.height} &middot; {image.format}</span>
        </span>
    </a>

    {#if ondelete}
        <button
            type="button"
            class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity
                   w-6 h-6 rounded text-xs flex items-center justify-center
                   {isUsed
                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                       : 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'}"
            disabled={isUsed}
            title={isUsed ? 'Cannot delete: image is in use' : 'Delete image'}
            onclick={handleDelete}
        >
            &times;
        </button>
    {/if}

    {#if usages.length > 0}
        <div class="px-2 py-1 flex flex-wrap gap-1">
            {#each usages as usage}
                <a
                    href={usage.href}
                    class="inline-block text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 truncate max-w-full"
                    title={usage.label}
                >
                    {usage.label}
                </a>
            {/each}
        </div>
    {/if}
</div>
