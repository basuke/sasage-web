<script lang="ts">
    import { goto } from '$app/navigation';
    import { imagePath } from '$lib/data';
    import type { Image, TranslatableString } from '$lib/data';
    import TranslatableInput from '$lib/admin/translatable-input.svelte';
    import SortableImageList from '$lib/admin/sortable-image-list.svelte';
    import ImagePicker from '$lib/admin/image-picker.svelte';

    let allImages = $state<Image[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let saving = $state(false);
    let saveError = $state<string | null>(null);
    let showImagePicker = $state(false);
    let showCoverPicker = $state(false);

    let editId = $state('');
    let editTitle = $state<TranslatableString>('');
    let editSubtitle = $state<TranslatableString>('');
    let editCoverImage = $state<string | undefined>(undefined);
    let editImages = $state<string[]>([]);

    let imageMap = $derived<Record<string, Image>>(
        Object.fromEntries(allImages.map((img) => [img.id, img])),
    );

    let isValid = $derived(editId.trim() !== '' && editTitle !== '' && (typeof editTitle !== 'object' || (editTitle.en ?? '') !== ''));

    async function loadImages() {
        try {
            const res = await fetch('/api/admin/images');
            if (!res.ok) throw new Error('Failed to load images');
            const data = await res.json();
            allImages = data.images;
        } catch (e) {
            error = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        loadImages();
    });

    async function handleCreate() {
        if (!isValid || saving) return;
        saving = true;
        saveError = null;

        try {
            const body: Record<string, unknown> = {
                id: editId.trim(),
                title: editTitle,
                images: editImages,
            };

            if (editSubtitle && (typeof editSubtitle === 'string' ? editSubtitle : ((editSubtitle.en ?? '') + (editSubtitle.ja ?? '')))) {
                body.subtitle = editSubtitle;
            }
            if (editCoverImage) {
                body.image = editCoverImage;
            }

            const res = await fetch('/api/admin/works', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message ?? `Create failed (${res.status})`);
            }

            const data = await res.json();
            goto(`/admin/works/${data.work.id}`);
        } catch (e) {
            saveError = e instanceof Error ? e.message : 'Create failed';
        } finally {
            saving = false;
        }
    }

    function handleSelectCover(id: string) {
        editCoverImage = id;
        showCoverPicker = false;
    }

    function handleAddImage(id: string) {
        editImages = [...editImages, id];
        showImagePicker = false;
    }
</script>

<div>
    <div class="mb-4">
        <a href="/admin/works" class="text-blue-600 hover:underline text-sm">&larr; Back to works</a>
    </div>

    <h1 class="text-2xl font-semibold text-gray-800 mb-6">New Work</h1>

    {#if loading}
        <p class="text-gray-500">Loading...</p>
    {:else if error}
        <p class="text-red-600">Error: {error}</p>
    {:else}
        <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-1/3 space-y-4">
                <h2 class="text-sm font-medium text-gray-700">Cover Image</h2>
                {#if editCoverImage}
                    <div class="relative group rounded-lg overflow-hidden border border-gray-200">
                        <img
                            src={imagePath(editCoverImage, 'public')}
                            alt="Cover"
                            class="w-full h-auto"
                        />
                        <button
                            type="button"
                            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                                   px-2 py-1 rounded text-xs bg-red-500 text-white hover:bg-red-600"
                            onclick={() => { editCoverImage = undefined; }}
                        >
                            Remove
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 font-mono truncate">{editCoverImage}</p>
                {:else}
                    <div class="w-full aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <span class="text-gray-400 text-sm">No cover image</span>
                    </div>
                {/if}
                <button
                    type="button"
                    class="w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onclick={() => { showCoverPicker = true; }}
                >
                    {editCoverImage ? 'Change Cover' : 'Select Cover'}
                </button>
            </div>

            <div class="lg:w-2/3 space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="work-id">Work ID</label>
                    <input
                        id="work-id"
                        type="text"
                        bind:value={editId}
                        placeholder="e.g. my-new-work"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <p class="text-xs text-gray-400 mt-1">Unique identifier (lowercase, hyphens allowed)</p>
                </div>

                <div class="space-y-4">
                    <TranslatableInput
                        label="Title"
                        value={editTitle}
                        onchange={(v) => { editTitle = v; }}
                    />

                    <TranslatableInput
                        label="Subtitle"
                        value={editSubtitle}
                        multiline={true}
                        onchange={(v) => { editSubtitle = v; }}
                    />
                </div>

                <div>
                    <div class="flex items-center justify-between mb-3">
                        <h2 class="text-sm font-medium text-gray-700">
                            Images ({editImages.length})
                        </h2>
                        <button
                            type="button"
                            class="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            onclick={() => { showImagePicker = true; }}
                        >
                            + Add Image
                        </button>
                    </div>

                    <SortableImageList
                        imageIds={editImages}
                        allImages={imageMap}
                        onreorder={(ids) => { editImages = ids; }}
                        onremove={(id) => { editImages = editImages.filter((x) => x !== id); }}
                    />
                </div>

                {#if saveError}
                    <p class="text-sm text-red-600">{saveError}</p>
                {/if}

                <div class="pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        class="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isValid || saving}
                        onclick={handleCreate}
                    >
                        {saving ? 'Creating...' : 'Create Work'}
                    </button>
                </div>
            </div>
        </div>

        <ImagePicker
            open={showCoverPicker}
            images={allImages}
            onselect={handleSelectCover}
            onclose={() => { showCoverPicker = false; }}
        />

        <ImagePicker
            open={showImagePicker}
            images={allImages}
            excludeIds={editImages}
            onselect={handleAddImage}
            onclose={() => { showImagePicker = false; }}
        />
    {/if}
</div>
