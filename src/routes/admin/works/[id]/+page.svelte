<script lang="ts">
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { imagePath } from '$lib/data';
    import type { Image, Work, TranslatableString } from '$lib/data';
    import TranslatableInput from '$lib/admin/translatable-input.svelte';
    import ConfirmDialog from '$lib/admin/confirm-dialog.svelte';
    import SortableImageList from '$lib/admin/sortable-image-list.svelte';
    import ImagePicker from '$lib/admin/image-picker.svelte';

    let work = $state<Work | null>(null);
    let allImages = $state<Image[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let saving = $state(false);
    let saveMessage = $state<string | null>(null);
    let showDeleteDialog = $state(false);
    let deleting = $state(false);
    let showImagePicker = $state(false);
    let showCoverPicker = $state(false);

    let editTitle = $state<TranslatableString>('');
    let editSubtitle = $state<TranslatableString>('');
    let editCoverImage = $state<string | undefined>(undefined);
    let editImages = $state<string[]>([]);

    let workId = $derived(page.params.id);

    let imageMap = $derived<Record<string, Image>>(
        Object.fromEntries(allImages.map((img) => [img.id, img])),
    );

    let hasChanges = $derived(
        work !== null &&
            (JSON.stringify(editTitle) !== JSON.stringify(work.title) ||
                JSON.stringify(editSubtitle) !== JSON.stringify(work.subtitle ?? '') ||
                editCoverImage !== work.image ||
                JSON.stringify(editImages) !== JSON.stringify(work.images)),
    );

    async function loadData() {
        try {
            const [worksRes, imgRes] = await Promise.all([
                fetch('/api/admin/works'),
                fetch('/api/admin/images'),
            ]);

            if (!worksRes.ok || !imgRes.ok) throw new Error('Failed to load data');

            const [worksData, imgData] = await Promise.all([worksRes.json(), imgRes.json()]);
            allImages = imgData.images;

            const found = worksData.works.find((w: Work) => w.id === workId);
            if (!found) throw new Error('Work not found');

            work = found;
            editTitle = found.title;
            editSubtitle = found.subtitle ?? '';
            editCoverImage = found.image;
            editImages = [...found.images];
        } catch (e) {
            error = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        workId;
        loading = true;
        error = null;
        loadData();
    });

    async function handleSave() {
        if (!work || saving) return;
        saving = true;
        saveMessage = null;

        try {
            const body: Record<string, unknown> = {
                title: editTitle,
                images: editImages,
            };

            if (editSubtitle && (typeof editSubtitle === 'string' ? editSubtitle : ((editSubtitle.en ?? '') + (editSubtitle.ja ?? '')))) {
                body.subtitle = editSubtitle;
            }

            if (editCoverImage !== undefined) {
                body.image = editCoverImage;
            } else {
                body.image = null;
            }

            const res = await fetch(`/api/admin/works/${workId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(`Save failed (${res.status})`);

            const data = await res.json();
            work = data.work;
            editTitle = work!.title;
            editSubtitle = work!.subtitle ?? '';
            editCoverImage = work!.image;
            editImages = [...work!.images];
            saveMessage = 'Saved successfully';
            setTimeout(() => { saveMessage = null; }, 2000);
        } catch (e) {
            saveMessage = e instanceof Error ? e.message : 'Save failed';
        } finally {
            saving = false;
        }
    }

    async function handleDelete() {
        if (deleting) return;
        deleting = true;

        try {
            const res = await fetch(`/api/admin/works/${workId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`Delete failed (${res.status})`);
            goto('/admin/works');
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Delete failed');
            deleting = false;
            showDeleteDialog = false;
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
    {#if loading}
        <p class="text-gray-500">Loading...</p>
    {:else if error}
        <div class="space-y-4">
            <p class="text-red-600">Error: {error}</p>
            <a href="/admin/works" class="text-blue-600 hover:underline text-sm">&larr; Back to works</a>
        </div>
    {:else if work}
        <div class="mb-4">
            <a href="/admin/works" class="text-blue-600 hover:underline text-sm">&larr; Back to works</a>
        </div>

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
                <h1 class="text-2xl font-semibold text-gray-800">{work.id}</h1>

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

                <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        class="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!hasChanges || saving}
                        onclick={handleSave}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>

                    {#if saveMessage}
                        <span class="text-sm {saveMessage.includes('failed') ? 'text-red-600' : 'text-green-600'}">
                            {saveMessage}
                        </span>
                    {/if}

                    <div class="ml-auto">
                        <button
                            type="button"
                            class="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                            onclick={() => { showDeleteDialog = true; }}
                        >
                            Delete Work
                        </button>
                    </div>
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

        <ConfirmDialog
            open={showDeleteDialog}
            title="Delete Work"
            message="Are you sure you want to delete &quot;{work.id}&quot;? This cannot be undone."
            confirmLabel={deleting ? 'Deleting...' : 'Delete'}
            destructive={true}
            onconfirm={handleDelete}
            oncancel={() => { showDeleteDialog = false; }}
        />
    {/if}
</div>
