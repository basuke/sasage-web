<script lang="ts">
    import type { Image } from '$lib/data';
    import ImageThumbnail from '$lib/admin/image-thumbnail.svelte';
    import ImageUpload from '$lib/admin/image-upload.svelte';
    import {
        filterImages,
        extractPrefixes,
        buildImageUsageMap,
        type Collections,
        type ImageUsage,
    } from '$lib/admin/image-filter';

    const PAGE_SIZE = 24;

    let allImages = $state<Image[]>([]);
    let collections = $state<Collections | null>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let searchQuery = $state('');
    let currentPage = $state(0);

    let usageMap = $derived(
        collections ? buildImageUsageMap(collections) : new Map<string, ImageUsage[]>(),
    );

    let filteredImages = $derived(filterImages(allImages, searchQuery));
    let prefixes = $derived(extractPrefixes(allImages));
    let totalPages = $derived(Math.ceil(filteredImages.length / PAGE_SIZE));
    let displayedImages = $derived(
        filteredImages.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    );
    let existingIds = $derived(allImages.map((img) => img.id));

    $effect(() => {
        // Reset page when filter changes
        searchQuery;
        currentPage = 0;
    });

    async function loadData() {
        try {
            const [imgRes, colRes] = await Promise.all([
                fetch('/api/admin/images'),
                fetch('/api/admin/collections'),
            ]);

            if (!imgRes.ok || !colRes.ok) {
                throw new Error('Failed to load data');
            }

            const [imgData, colData] = await Promise.all([imgRes.json(), colRes.json()]);
            allImages = imgData.images;
            collections = colData.collections;
        } catch (e) {
            error = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        loadData();
    });

    function handleUploadSuccess(image: Image) {
        allImages = [image, ...allImages];
    }

    async function handleDelete(id: string) {
        if (!confirm(`Delete image "${id}"? This cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/images/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`Delete failed (${res.status})`);
            allImages = allImages.filter((img) => img.id !== id);
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Delete failed');
        }
    }

    function setFilter(prefix: string) {
        searchQuery = prefix === '(root)' ? '' : prefix + '/';
    }
</script>

<div>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Images</h1>

    <section id="upload" class="mb-8">
        <h2 class="text-lg font-medium text-gray-700 mb-3">Upload New Image</h2>
        <ImageUpload {existingIds} onsuccess={handleUploadSuccess} />
    </section>

    {#if loading}
        <p class="text-gray-500">Loading images...</p>
    {:else if error}
        <p class="text-red-600">Error: {error}</p>
    {:else}
        <section>
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search by image ID..."
                    class="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-500">
                    {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
                </span>
            </div>

            {#if prefixes.length > 1}
                <div class="flex flex-wrap gap-1.5 mb-4">
                    <button
                        type="button"
                        class="px-2 py-0.5 text-xs rounded border {searchQuery === ''
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}"
                        onclick={() => { searchQuery = ''; }}
                    >
                        All
                    </button>
                    {#each prefixes as prefix}
                        <button
                            type="button"
                            class="px-2 py-0.5 text-xs rounded border {searchQuery === prefix + '/' || (prefix === '(root)' && searchQuery === '')
                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}"
                            onclick={() => setFilter(prefix)}
                        >
                            {prefix}
                        </button>
                    {/each}
                </div>
            {/if}

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {#each displayedImages as image (image.id)}
                    <ImageThumbnail
                        {image}
                        usages={usageMap.get(image.id) ?? []}
                        ondelete={handleDelete}
                    />
                {/each}
            </div>

            {#if filteredImages.length === 0}
                <p class="text-center text-gray-400 py-8">No images match your search.</p>
            {/if}

            {#if totalPages > 1}
                <div class="flex items-center justify-center gap-2 mt-6">
                    <button
                        type="button"
                        class="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        disabled={currentPage === 0}
                        onclick={() => { currentPage = currentPage - 1; }}
                    >
                        Previous
                    </button>
                    <span class="text-sm text-gray-600">
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                        type="button"
                        class="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        disabled={currentPage >= totalPages - 1}
                        onclick={() => { currentPage = currentPage + 1; }}
                    >
                        Next
                    </button>
                </div>
            {/if}
        </section>
    {/if}
</div>
