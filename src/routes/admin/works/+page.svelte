<script lang="ts">
    import type { Work } from '$lib/data';
    import { imagePath } from '$lib/data';

    let works = $state<Work[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    async function loadData() {
        try {
            const res = await fetch('/api/admin/works');
            if (!res.ok) throw new Error(`Failed to load works (${res.status})`);
            const data = await res.json();
            works = data.works;
        } catch (e) {
            error = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        loadData();
    });
</script>

<div>
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Works</h1>
        <a
            href="/admin/works/new"
            class="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
            + New Work
        </a>
    </div>

    {#if loading}
        <p class="text-gray-500">Loading works...</p>
    {:else if error}
        <p class="text-red-600">Error: {error}</p>
    {:else if works.length === 0}
        <p class="text-gray-400 text-center py-8">No works yet. Create your first work!</p>
    {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {#each works as work (work.id)}
                <a
                    href="/admin/works/{work.id}"
                    class="group block rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                    {#if work.image}
                        <img
                            src={imagePath(work.image, 'square')}
                            alt={work.id}
                            class="w-full aspect-square object-cover"
                            loading="lazy"
                        />
                    {:else}
                        <div class="w-full aspect-square bg-gray-100 flex items-center justify-center">
                            <span class="text-gray-400 text-sm">No cover</span>
                        </div>
                    {/if}
                    <div class="p-3">
                        <h3 class="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600">
                            {typeof work.title === 'string' ? work.title : (work.title.en || work.title.ja || work.id)}
                        </h3>
                        <p class="text-xs text-gray-500 mt-0.5">
                            {work.images.length} image{work.images.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>
