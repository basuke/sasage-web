import { error } from '@sveltejs/kit';
import type { CloudflareConfig } from './cloudflare-images';

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
        const body = await request.json();

        if (typeof body !== 'object' || body === null || Array.isArray(body)) {
            throw error(400, 'Request body must be a JSON object');
        }

        return body as Record<string, unknown>;
    } catch (e) {
        if (e && typeof e === 'object' && 'status' in e) throw e;
        throw error(400, 'Invalid JSON in request body');
    }
}
