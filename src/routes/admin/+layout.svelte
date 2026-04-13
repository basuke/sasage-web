<script lang="ts">
    import type { Snippet } from 'svelte';
    import { page } from '$app/state';

    let { children }: { children: Snippet } = $props();

    const navItems = [
        { label: 'Dashboard', href: '/admin' },
        { label: 'Images', href: '/admin/images' },
        { label: 'Collections', href: '/admin/collections' },
        { label: 'Works', href: '/admin/works' },
    ];

    function isActive(href: string): boolean {
        if (href === '/admin') return page.url.pathname === '/admin';
        return page.url.pathname.startsWith(href);
    }
</script>

<div class="flex h-screen bg-gray-50">
    <aside class="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div class="p-4 border-b border-gray-200">
            <h1 class="text-lg font-semibold text-gray-800">Admin</h1>
        </div>

        <nav class="flex-1 p-2">
            {#each navItems as item}
                <a
                    href={item.href}
                    class="block px-3 py-2 rounded-md text-sm mb-1 {isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
                >
                    {item.label}
                </a>
            {/each}
        </nav>

        <div class="p-2 border-t border-gray-200">
            <a
                href="/"
                class="block px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
                &larr; Back to site
            </a>
        </div>
    </aside>

    <main class="flex-1 overflow-y-auto p-6">
        {@render children()}
    </main>
</div>
