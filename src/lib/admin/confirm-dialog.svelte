<script lang="ts">
    let {
        open = false,
        title = 'Confirm',
        message = 'Are you sure?',
        confirmLabel = 'Confirm',
        cancelLabel = 'Cancel',
        destructive = false,
        onconfirm,
        oncancel,
    }: {
        open: boolean;
        title?: string;
        message?: string;
        confirmLabel?: string;
        cancelLabel?: string;
        destructive?: boolean;
        onconfirm?: () => void;
        oncancel?: () => void;
    } = $props();

    function handleConfirm() {
        onconfirm?.();
    }

    function handleCancel() {
        oncancel?.();
    }

    function handleKeydown(e: KeyboardEvent) {
        if (open && e.key === 'Escape') handleCancel();
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
    >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 id="confirm-title" class="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p class="text-sm text-gray-600 mb-6">{message}</p>

            <div class="flex justify-end gap-3">
                <button
                    type="button"
                    class="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onclick={handleCancel}
                >
                    {cancelLabel}
                </button>
                <button
                    type="button"
                    class="px-4 py-2 text-sm rounded-md text-white {destructive
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'}"
                    onclick={handleConfirm}
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    </div>
{/if}
