<script lang="ts">
    import type { Image } from '$lib/data';

    let {
        existingIds = [],
        onsuccess,
    }: {
        existingIds?: string[];
        onsuccess?: (image: Image) => void;
    } = $props();

    const MAX_SIZE = 10 * 1024 * 1024;
    const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

    let dragActive = $state(false);
    let file = $state<File | null>(null);
    let customId = $state('');
    let uploading = $state(false);
    let progress = $state<'idle' | 'uploading' | 'success' | 'error'>('idle');
    let errorMessage = $state('');
    let previewUrl = $state<string | null>(null);

    let validationError = $derived.by(() => {
        if (!file) return '';
        if (!ACCEPTED_TYPES.includes(file.type)) return 'Only JPEG and PNG files are accepted.';
        if (file.size > MAX_SIZE) return `File exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB).`;
        return '';
    });

    let duplicateWarning = $derived(
        customId && existingIds.includes(customId)
            ? 'An image with this ID already exists and will be overwritten.'
            : '',
    );

    $effect(() => {
        if (file && !validationError) {
            const url = URL.createObjectURL(file);
            previewUrl = url;
            return () => URL.revokeObjectURL(url);
        } else {
            previewUrl = null;
            return undefined;
        }
    });

    $effect(() => {
        if (file && !customId) {
            const name = file.name.replace(/\.[^.]+$/, '');
            customId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
    });

    function selectFile(f: File) {
        file = f;
        customId = '';
        progress = 'idle';
        errorMessage = '';
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        dragActive = true;
    }

    function handleDragLeave(e: DragEvent) {
        e.preventDefault();
        dragActive = false;
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        dragActive = false;
        const f = e.dataTransfer?.files[0];
        if (f) selectFile(f);
    }

    function handleFileSelect(e: Event) {
        const input = e.target as HTMLInputElement;
        const f = input.files?.[0];
        if (f) selectFile(f);
    }

    function reset() {
        file = null;
        customId = '';
        progress = 'idle';
        errorMessage = '';
        previewUrl = null;
    }

    async function handleUpload() {
        if (!file || !customId || validationError) return;

        uploading = true;
        progress = 'uploading';
        errorMessage = '';

        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', customId);

        try {
            const response = await fetch('/api/admin/images', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(
                    (data && typeof data === 'object' && 'message' in data ? String(data.message) : null)
                    ?? `Upload failed (${response.status})`,
                );
            }

            const data = await response.json();
            progress = 'success';
            onsuccess?.(data.image);

            setTimeout(reset, 2000);
        } catch (e) {
            progress = 'error';
            errorMessage = e instanceof Error ? e.message : 'Upload failed';
        } finally {
            uploading = false;
        }
    }
</script>

<div
    class="border-2 border-dashed rounded-lg p-6 transition-colors
           {dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'}"
    role="region"
    aria-label="Image upload"
    ondragover={handleDragOver}
    ondragenter={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
>
    {#if !file}
        <div class="text-center">
            <p class="text-gray-500 mb-2">Drag & drop an image here, or</p>
            <label class="cursor-pointer text-blue-600 hover:text-blue-700 underline">
                browse files
                <input
                    type="file"
                    accept="image/jpeg,image/png"
                    class="hidden"
                    onchange={handleFileSelect}
                />
            </label>
            <p class="text-xs text-gray-400 mt-2">JPEG or PNG, max 10MB</p>
        </div>
    {:else}
        <div class="flex gap-4 items-start">
            {#if previewUrl}
                <img
                    src={previewUrl}
                    alt="Preview"
                    class="w-32 h-32 object-cover rounded border border-gray-200"
                />
            {/if}
            <div class="flex-1">
                {#if validationError}
                    <p class="text-red-600 text-sm mb-2">{validationError}</p>
                    <button
                        type="button"
                        class="text-sm text-gray-500 underline"
                        onclick={reset}
                    >
                        Choose a different file
                    </button>
                {:else}
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Image ID
                        <input
                            type="text"
                            bind:value={customId}
                            class="mt-1 block w-full border border-gray-300 rounded px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g. illustration/my-image"
                        />
                    </label>
                    {#if duplicateWarning}
                        <p class="text-amber-600 text-xs mt-1">{duplicateWarning}</p>
                    {/if}
                    <p class="text-xs text-gray-500 mt-1">
                        {file.name} ({(file.size / 1024).toFixed(0)} KB)
                    </p>

                    <div class="flex gap-2 mt-3">
                        <button
                            type="button"
                            class="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={uploading || !customId}
                            onclick={handleUpload}
                        >
                            {#if progress === 'uploading'}
                                Uploading...
                            {:else}
                                Upload
                            {/if}
                        </button>
                        <button
                            type="button"
                            class="px-4 py-1.5 bg-white border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50"
                            disabled={uploading}
                            onclick={reset}
                        >
                            Cancel
                        </button>
                    </div>
                {/if}
            </div>
        </div>

        {#if progress === 'success'}
            <p class="mt-3 text-green-600 text-sm">Upload successful!</p>
        {:else if progress === 'error'}
            <p class="mt-3 text-red-600 text-sm">{errorMessage}</p>
        {/if}
    {/if}
</div>
