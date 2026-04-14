<script lang="ts">
    import type { Image } from '$lib/data';
    import SortableImageList from '$lib/admin/sortable-image-list.svelte';
    import ImagePicker from '$lib/admin/image-picker.svelte';

    type CollectionKey = 'topImages' | 'topImagesWide' | 'illustrations';

    const tabs: { key: CollectionKey; label: string }[] = [
        { key: 'topImages', label: 'Top Images' },
        { key: 'topImagesWide', label: 'Top Images (Wide)' },
        { key: 'illustrations', label: 'Illustrations' },
    ];

    let activeTab = $state<CollectionKey>('topImages');
    let loading = $state(true);
    let error = $state<string | null>(null);

    let allImages = $state<Image[]>([]);
    let topImages = $state<string[]>([]);
    let topImagesWide = $state<string[]>([]);
    let illustrations = $state<string[]>([]);

    let originalTopImages = $state<string[]>([]);
    let originalTopImagesWide = $state<string[]>([]);
    let originalIllustrations = $state<string[]>([]);

    let saving = $state<CollectionKey | null>(null);
    let saveStatus = $state<{ key: CollectionKey; message: string; success: boolean } | null>(null);

    let showPicker = $state(false);

    function currentIds(): string[] {
        if (activeTab === 'topImages') return topImages;
        if (activeTab === 'topImagesWide') return topImagesWide;
        return illustrations;
    }

    function originalIds(): string[] {
        if (activeTab === 'topImages') return originalTopImages;
        if (activeTab === 'topImagesWide') return originalTopImagesWide;
        return originalIllustrations;
    }

    let hasChanges = $derived(
        JSON.stringify(currentIds()) !== JSON.stringify(originalIds()),
    );

    async function loadData() {
        try {
            const [imgRes, colRes] = await Promise.all([
                fetch('/api/admin/images'),
                fetch('/api/admin/collections'),
            ]);

            if (!imgRes.ok || !colRes.ok) throw new Error('Failed to load data');

            const [imgData, colData] = await Promise.all([imgRes.json(), colRes.json()]);
            allImages = imgData.images;

            const col = colData.collections;
            topImages = [...col.topImages];
            topImagesWide = [...col.topImagesWide];
            illustrations = [...col.illustrations];
            originalTopImages = [...col.topImages];
            originalTopImagesWide = [...col.topImagesWide];
            originalIllustrations = [...col.illustrations];
        } catch (e) {
            error = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        loadData();
    });

    function handleReorder(ids: string[]) {
        if (activeTab === 'topImages') topImages = ids;
        else if (activeTab === 'topImagesWide') topImagesWide = ids;
        else illustrations = ids;
    }

    function handleRemove(id: string) {
        if (activeTab === 'topImages') topImages = topImages.filter((x) => x !== id);
        else if (activeTab === 'topImagesWide') topImagesWide = topImagesWide.filter((x) => x !== id);
        else illustrations = illustrations.filter((x) => x !== id);
    }

    function handleAddImage(id: string) {
        if (activeTab === 'topImages') topImages = [...topImages, id];
        else if (activeTab === 'topImagesWide') topImagesWide = [...topImagesWide, id];
        else illustrations = [...illustrations, id];
        showPicker = false;
    }

    async function handleSave() {
        if (saving) return;
        const key = activeTab;
        saving = key;
        saveStatus = null;

        try {
            const body: Record<string, string[]> = {};
            body[key] = currentIds();

            const res = await fetch('/api/admin/collections', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(`Save failed (${res.status})`);

            const data = await res.json();
            const col = data.collections;

            if (key === 'topImages') {
                topImages = [...col.topImages];
                originalTopImages = [...col.topImages];
            } else if (key === 'topImagesWide') {
                topImagesWide = [...col.topImagesWide];
                originalTopImagesWide = [...col.topImagesWide];
            } else {
                illustrations = [...col.illustrations];
                originalIllustrations = [...col.illustrations];
            }

            saveStatus = { key, message: 'Saved successfully', success: true };
            setTimeout(() => { saveStatus = null; }, 2000);
        } catch (e) {
            saveStatus = { key, message: e instanceof Error ? e.message : 'Save failed', success: false };
        } finally {
            saving = null;
        }
    }
</script>

<div>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Collections</h1>

    {#if loading}
        <p class="text-gray-500">Loading collections...</p>
    {:else if error}
        <p class="text-red-600">Error: {error}</p>
    {:else}
        <div class="border-b border-gray-200 mb-6">
            <nav class="flex gap-0 -mb-px">
                {#each tabs as tab}
                    <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium border-b-2 transition-colors
                            {activeTab === tab.key
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                        onclick={() => { activeTab = tab.key; }}
                    >
                        {tab.label}
                        <span class="ml-1 text-xs text-gray-400">
                            ({{ topImages: topImages.length, topImagesWide: topImagesWide.length, illustrations: illustrations.length }[tab.key]})
                        </span>
                    </button>
                {/each}
            </nav>
        </div>

        <div class="mb-4 flex items-center gap-3">
            <button
                type="button"
                class="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onclick={() => { showPicker = true; }}
            >
                + Add Image
            </button>

            <button
                type="button"
                class="px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasChanges || saving !== null}
                onclick={handleSave}
            >
                {saving === activeTab ? 'Saving...' : 'Save'}
            </button>

            {#if saveStatus && saveStatus.key === activeTab}
                <span class="text-sm {saveStatus.success ? 'text-green-600' : 'text-red-600'}">
                    {saveStatus.message}
                </span>
            {/if}

            {#if hasChanges}
                <span class="text-xs text-amber-600">Unsaved changes</span>
            {/if}
        </div>

        <SortableImageList
            imageIds={currentIds()}
            onreorder={handleReorder}
            onremove={handleRemove}
        />

        <ImagePicker
            open={showPicker}
            images={allImages}
            excludeIds={currentIds()}
            onselect={handleAddImage}
            onclose={() => { showPicker = false; }}
        />
    {/if}
</div>
