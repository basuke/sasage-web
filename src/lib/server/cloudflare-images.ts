export interface CloudflareConfig {
    accountId: string;
    apiToken: string;
}

export interface ImageInfo {
    format: string;
    width: number;
    height: number;
}

export interface UploadResult {
    success: boolean;
    id: string;
    errors?: unknown[] | undefined;
}

function apiEndpoint(config: CloudflareConfig) {
    return `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/images/v1`;
}

function authHeaders(config: CloudflareConfig) {
    return { Authorization: `Bearer ${config.apiToken}` };
}

async function loadSharp() {
    // Use a variable to prevent bundlers from statically resolving sharp.
    // sharp is a native Node.js module that cannot run in Cloudflare Workers,
    // but admin API endpoints are dev-only (guarded by requireDev).
    const pkg = 'sharp';
    const mod = await import(/* @vite-ignore */ pkg);
    return mod.default as typeof import('sharp');
}

export async function getImageInfo(buffer: Uint8Array): Promise<ImageInfo> {
    const sharp = await loadSharp();
    const metadata = await sharp(buffer).metadata();
    return {
        format: metadata.format ?? 'unknown',
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
    };
}

export async function computeSha1(buffer: Uint8Array): Promise<string> {
    const crypto = await import('node:crypto');
    return crypto.createHash('sha1').update(buffer).digest('hex');
}

export async function uploadImage(
    config: CloudflareConfig,
    file: Blob,
    id: string,
): Promise<UploadResult> {
    const form = new FormData();
    form.append('id', id);
    form.append('file', file);

    const response = await fetch(apiEndpoint(config), {
        method: 'POST',
        headers: authHeaders(config),
        body: form,
    });

    const json = (await response.json()) as { success: boolean; errors?: unknown[] };
    return { success: json.success, id, errors: json.errors };
}

export async function deleteImage(config: CloudflareConfig, id: string): Promise<boolean> {
    const response = await fetch(`${apiEndpoint(config)}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(config),
    });

    const json = (await response.json()) as { success: boolean };
    return json.success;
}
