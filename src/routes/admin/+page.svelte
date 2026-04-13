<script lang="ts">
    import type { Image, Work } from '$lib/data';

    let images = $state<Image[]>([]);
    let works = $state<Work[]>([]);
    let illustrationCount = $state(0);
    let loading = $state(true);
    let error = $state<string | null>(null);

    async function loadData() {
        try {
            const [imgRes, worksRes, colRes] = await Promise.all([
                fetch('/api/admin/images'),
                fetch('/api/admin/works'),
                fetch('/api/admin/collections'),
            ]);

            if (!imgRes.ok || !worksRes.ok || !colRes.ok) {
                throw new Error('Failed to load admin data');
            }

            const [imgData, worksData, colData] = await Promise.all([
                imgRes.json(),
                worksRes.json(),
                colRes.json(),
            ]);

            images = imgData.images;
            works = worksData.works;
            illustrationCount = colData.collections.illustrations.length;
        } catch (e) {
            error = e instanceof Error ? e.message : 'Unknown error';
        } finally {
            loading = false;
        }
    }

    $effect(() => {
        loadData();
    });

    const stats = $derived([
        { label: 'Total Images', value: images.length, href: '/admin/images' },
        { label: 'Works', value: works.length, href: '/admin/works' },
        { label: 'Illustrations', value: illustrationCount, href: '/admin/collections' },
    ]);
</script>

<div>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

    {#if loading}
        <p class="text-gray-500">Loading...</p>
    {:else if error}
        <p class="text-red-600">Error: {error}</p>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {#each stats as stat}
                <a
                    href={stat.href}
                    class="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <p class="text-sm text-gray-500">{stat.label}</p>
                    <p class="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </a>
            {/each}
        </div>

        <h2 class="text-lg font-medium text-gray-700 mb-3">Quick Actions</h2>
        <div class="flex gap-3">
            <a
                href="/admin/images#upload"
                class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
                Upload Image
            </a>
            <a
                href="/admin/images"
                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors"
            >
                Browse Images
            </a>
        </div>
    {/if}
</div>
