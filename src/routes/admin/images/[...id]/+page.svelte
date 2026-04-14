<script lang="ts">
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { imagePath } from '$lib/data';
    import type { Image, TranslatableString } from '$lib/data';
    import TranslatableInput from '$lib/admin/translatable-input.svelte';
    import ConfirmDialog from '$lib/admin/confirm-dialog.svelte';
    import { buildImageUsageMap, type Collections, type ImageUsage } from '$lib/admin/image-filter';

    let image = $state<Image | null>(null);
    let collections = $state<Collections | null>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let saving = $state(false);
    let saveMessage = $state<string | null>(null);
    let showDeleteDialog = $state(false);
    let deleting = $state(false);

    let editTitle = $state<TranslatableString>('');
    let editDescription = $state<TranslatableString>('');

    let imageId = $derived(page.params.id);

    let usages = $derived.by<ImageUsage[]>(() => {
        if (!collections || !imageId) return [];
        const map = buildImageUsageMap(collections);
        return map.get(imageId) ?? [];
    });

    let isUsed = $derived(usages.length > 0);

    let hasChanges = $derived(
        image !== null &&
            (JSON.stringify(editTitle) !== JSON.stringify(image.title) ||
                JSON.stringify(editDescription) !== JSON.stringify(image.description ?? '')),
    );

    async function loadData() {
        try {
            const [imgRes, colRes] = await Promise.all([
                fetch(`/api/admin/images/${imageId}`),
                fetch('/api/admin/collections'),
            ]);

            if (!imgRes.ok) {
                if (imgRes.status === 404) throw new Error('Image not found');
                throw new Error(`Failed to load image (${imgRes.status})`);
            }
            if (!colRes.ok) throw new Error('Failed to load collections');

            const [imgData, colData] = await Promise.all([imgRes.json(), colRes.json()]);
            image = imgData.image;
            collections = colData.collections;
            editTitle = image!.title;
            editDescription = image!.description ?? '';
        } catch (e) {
            error = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        imageId;
        loading = true;
        error = null;
        loadData();
    });

    async function handleSave() {
        if (!image || saving) return;
        saving = true;
        saveMessage = null;

        try {
            const body: Record<string, TranslatableString> = { title: editTitle };
            if (
                editDescription &&
                (typeof editDescription === 'string'
                    ? editDescription
                    : (editDescription.en ?? '') + (editDescription.ja ?? ''))
            ) {
                body.description = editDescription;
            }

            const res = await fetch(`/api/admin/images/${imageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(`Save failed (${res.status})`);

            const data = await res.json();
            image = data.image;
            editTitle = image!.title;
            editDescription = image!.description ?? '';
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
            const res = await fetch(`/api/admin/images/${imageId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`Delete failed (${res.status})`);
            goto('/admin/images');
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Delete failed');
            deleting = false;
            showDeleteDialog = false;
        }
    }
</script>

<div>
    {#if loading}
        <p class="text-gray-500">Loading...</p>
    {:else if error}
        <div class="space-y-4">
            <p class="text-red-600">Error: {error}</p>
            <a href="/admin/images" class="text-blue-600 hover:underline text-sm">&larr; Back to images</a>
        </div>
    {:else if image}
        <div class="mb-4">
            <a href="/admin/images" class="text-blue-600 hover:underline text-sm">&larr; Back to images</a>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-1/2">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <img
                        src={imagePath(image.id, 'public')}
                        alt={image.id}
                        class="w-full h-auto"
                    />
                </div>
            </div>

            <div class="lg:w-1/2 space-y-6">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-800 mb-1">{image.id}</h1>
                    <div class="flex gap-3 text-sm text-gray-500">
                        <span>{image.width} &times; {image.height}</span>
                        <span>{image.format.toUpperCase()}</span>
                    </div>
                </div>

                <div class="space-y-4">
                    <TranslatableInput
                        label="Title"
                        value={editTitle}
                        onchange={(v) => { editTitle = v; }}
                    />

                    <TranslatableInput
                        label="Description"
                        value={editDescription}
                        multiline={true}
                        onchange={(v) => { editDescription = v; }}
                    />
                </div>

                {#if usages.length > 0}
                    <div>
                        <h3 class="text-sm font-medium text-gray-700 mb-2">Used in</h3>
                        <div class="flex flex-wrap gap-1.5">
                            {#each usages as usage}
                                <a
                                    href={usage.href}
                                    class="inline-block text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                                >
                                    {usage.label}
                                </a>
                            {/each}
                        </div>
                    </div>
                {/if}

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
                            class="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUsed}
                            title={isUsed ? 'Cannot delete: image is used in collections' : 'Delete image'}
                            onclick={() => { showDeleteDialog = true; }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <ConfirmDialog
            open={showDeleteDialog}
            title="Delete Image"
            message="Are you sure you want to delete &quot;{image.id}&quot;? This will remove it from Cloudflare and cannot be undone."
            confirmLabel={deleting ? 'Deleting...' : 'Delete'}
            destructive={true}
            onconfirm={handleDelete}
            oncancel={() => { showDeleteDialog = false; }}
        />
    {/if}
</div>
