<script lang="ts">
    import { imagePath } from '$lib/data';
    import type { Image } from '$lib/data';
    import { filterImages } from './image-filter';

    let {
        open = false,
        images = [],
        excludeIds = [],
        onselect,
        onclose,
    }: {
        open: boolean;
        images: Image[];
        excludeIds?: string[];
        onselect?: (id: string) => void;
        onclose?: () => void;
    } = $props();

    let searchQuery = $state('');

    let excludeSet = $derived(new Set(excludeIds));

    let filtered = $derived(filterImages(images, searchQuery));

    function handleSelect(id: string) {
        if (excludeSet.has(id)) return;
        onselect?.(id);
    }

    function handleClose() {
        searchQuery = '';
        onclose?.();
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') handleClose();
    }
</script>

{#if open}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        role="dialog"
        aria-modal="true"
        aria-label="Select an image"
        onkeydown={handleKeydown}
    >
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div class="p-4 border-b border-gray-200 flex items-center gap-3">
                <h3 class="text-lg font-semibold text-gray-900 flex-shrink-0">Select Image</h3>
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search images..."
                    class="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                    type="button"
                    class="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
                    onclick={handleClose}
                >
                    &times;
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-4">
                {#if filtered.length === 0}
                    <p class="text-center text-gray-400 py-8">No images found.</p>
                {:else}
                    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {#each filtered as img (img.id)}
                            <button
                                type="button"
                                class="relative rounded-lg overflow-hidden border-2 transition-all
                                    {excludeSet.has(img.id)
                                        ? 'border-gray-300 opacity-40 cursor-not-allowed'
                                        : 'border-gray-200 hover:border-blue-400 cursor-pointer'}"
                                disabled={excludeSet.has(img.id)}
                                title={img.id}
                                onclick={() => handleSelect(img.id)}
                            >
                                <img
                                    src={imagePath(img.id, 'square')}
                                    alt={img.id}
                                    class="w-full aspect-square object-cover"
                                    loading="lazy"
                                />
                                {#if excludeSet.has(img.id)}
                                    <div class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
                                        <span class="text-xs text-gray-500 font-medium">Added</span>
                                    </div>
                                {/if}
                                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-1 py-0.5">
                                    <p class="text-white text-xs truncate font-mono">{img.id}</p>
                                </div>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>

            <div class="p-3 border-t border-gray-200 text-sm text-gray-500 text-right">
                {filtered.length} image{filtered.length !== 1 ? 's' : ''}
                {#if excludeIds.length > 0}
                    &middot; {excludeIds.length} already added
                {/if}
            </div>
        </div>
    </div>
{/if}
