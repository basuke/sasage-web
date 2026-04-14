<script lang="ts">
    import { imagePath } from '$lib/data';

    let {
        imageIds,
        onreorder,
        onremove,
    }: {
        imageIds: string[];
        onreorder?: (ids: string[]) => void;
        onremove?: (id: string) => void;
    } = $props();

    let dragIndex = $state<number | null>(null);
    let dropIndex = $state<number | null>(null);

    function handleDragStart(e: DragEvent, index: number) {
        dragIndex = index;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', String(index));
        }
    }

    function handleDragOver(e: DragEvent, index: number) {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
        }
        dropIndex = index;
    }

    function handleDragLeave() {
        dropIndex = null;
    }

    function handleDrop(e: DragEvent, index: number) {
        e.preventDefault();
        if (dragIndex === null || dragIndex === index) {
            dragIndex = null;
            dropIndex = null;
            return;
        }

        const newIds = [...imageIds];
        const [moved] = newIds.splice(dragIndex, 1);
        newIds.splice(index, 0, moved!);
        onreorder?.(newIds);

        dragIndex = null;
        dropIndex = null;
    }

    function handleDragEnd() {
        dragIndex = null;
        dropIndex = null;
    }

    function handleRemove(id: string) {
        onremove?.(id);
    }
</script>

{#if imageIds.length === 0}
    <p class="text-sm text-gray-400 py-4 text-center">No images yet.</p>
{:else}
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {#each imageIds as id, i (id)}
            <div
                class="relative group rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all
                    {dragIndex === i ? 'opacity-40' : ''}
                    {dropIndex === i && dragIndex !== i ? 'border-blue-400 scale-105' : 'border-gray-200'}"
                draggable="true"
                role="listitem"
                ondragstart={(e) => handleDragStart(e, i)}
                ondragover={(e) => handleDragOver(e, i)}
                ondragleave={handleDragLeave}
                ondrop={(e) => handleDrop(e, i)}
                ondragend={handleDragEnd}
            >
                <img
                    src={imagePath(id, 'square')}
                    alt={id}
                    class="w-full aspect-square object-cover"
                    loading="lazy"
                />
                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-1 py-0.5">
                    <p class="text-white text-xs truncate font-mono">{id}</p>
                </div>
                {#if onremove}
                    <button
                        type="button"
                        class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity
                               w-5 h-5 rounded bg-red-500 text-white hover:bg-red-600 text-xs flex items-center justify-center"
                        title="Remove from collection"
                        onclick={() => handleRemove(id)}
                    >
                        &times;
                    </button>
                {/if}
                <div class="absolute top-1 left-1 w-5 h-5 rounded bg-black bg-opacity-50 text-white text-xs flex items-center justify-center">
                    {i + 1}
                </div>
            </div>
        {/each}
    </div>
{/if}
