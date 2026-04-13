import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import type { CloudflareConfig } from './cloudflare-images';

export function requireDev(): void {
    if (!dev) {
        throw error(403, 'Admin API is only available in development mode');
    }
}

export function getCloudflareConfig(): CloudflareConfig {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_IMAGES_API_TOKEN;

    if (!accountId || !apiToken) {
        throw error(500, 'Cloudflare credentials not configured');
    }

    return { accountId, apiToken };
}

export async function parseJsonBody(request: Request): Promise<Record<string, unknown>> {
    try {
        return (await request.json()) as Record<string, unknown>;
    } catch {
        throw error(400, 'Invalid JSON in request body');
    }
}
