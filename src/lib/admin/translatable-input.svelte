<script lang="ts">
    import type { TranslatableString, Lang } from '$lib/data';

    let {
        label,
        value = '',
        multiline = false,
        onchange,
    }: {
        label: string;
        value: TranslatableString;
        multiline?: boolean;
        onchange?: (value: TranslatableString) => void;
    } = $props();

    let activeLang = $state<Lang>('en');

    let enValue = $derived(typeof value === 'string' ? value : (value.en ?? ''));
    let jaValue = $derived(typeof value === 'string' ? '' : (value.ja ?? ''));

    function currentValue(): string {
        return activeLang === 'en' ? enValue : jaValue;
    }

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const newText = target.value;

        if (activeLang === 'en') {
            if (jaValue) {
                onchange?.({ en: newText, ja: jaValue });
            } else if (newText) {
                onchange?.(newText);
            } else {
                onchange?.('');
            }
        } else {
            const en = enValue;
            if (newText || en) {
                const obj: { en?: string; ja?: string } = {};
                if (en) obj.en = en;
                if (newText) obj.ja = newText;
                onchange?.(obj);
            } else {
                onchange?.('');
            }
        }
    }
</script>

<div class="space-y-1">
    <div class="flex items-center justify-between">
        <span class="block text-sm font-medium text-gray-700">{label}</span>
        <div class="flex rounded-md overflow-hidden border border-gray-300">
            <button
                type="button"
                class="px-2 py-0.5 text-xs {activeLang === 'en'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'}"
                onclick={() => { activeLang = 'en'; }}
            >
                EN
            </button>
            <button
                type="button"
                class="px-2 py-0.5 text-xs {activeLang === 'ja'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'}"
                onclick={() => { activeLang = 'ja'; }}
            >
                JA
            </button>
        </div>
    </div>

    {#if multiline}
        <textarea
            value={currentValue()}
            oninput={handleInput}
            rows="4"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="{label} ({activeLang})"
        ></textarea>
    {:else}
        <input
            type="text"
            value={currentValue()}
            oninput={handleInput}
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="{label} ({activeLang})"
        />
    {/if}

    {#if activeLang === 'en' && jaValue}
        <p class="text-xs text-gray-400 truncate">JA: {jaValue}</p>
    {:else if activeLang === 'ja' && enValue}
        <p class="text-xs text-gray-400 truncate">EN: {enValue}</p>
    {/if}
</div>
