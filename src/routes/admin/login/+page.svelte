<script lang="ts">
    let password = $state('');
    let errorMessage = $state('');
    let loading = $state(false);

    async function handleLogin(event: SubmitEvent) {
        event.preventDefault();
        errorMessage = '';
        loading = true;

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                window.location.href = '/admin';
            } else {
                const data = await res.json();
                errorMessage = data.message || 'Login failed';
            }
        } catch {
            errorMessage = 'Network error. Please try again.';
        } finally {
            loading = false;
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-sm w-full bg-white rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-semibold text-gray-800 text-center mb-6">Admin Login</h1>

        {#if errorMessage}
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {errorMessage}
            </div>
        {/if}

        <form onsubmit={handleLogin}>
            <label class="block text-sm font-medium text-gray-700 mb-2" for="password">
                Password
            </label>
            <input
                id="password"
                type="password"
                bind:value={password}
                required
                disabled={loading}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Enter admin password"
            />

            <button
                type="submit"
                disabled={loading || !password}
                class="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>

        <div class="mt-6 text-center">
            <a href="/" class="text-sm text-gray-500 hover:text-gray-700">&larr; Back to site</a>
        </div>
    </div>
</div>
