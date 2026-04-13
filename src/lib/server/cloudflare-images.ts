import sharp from 'sharp';

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

export async function getImageInfo(buffer: Uint8Array): Promise<ImageInfo> {
    const metadata = await sharp(buffer).metadata();
    return {
        format: metadata.format ?? 'unknown',
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
    };
}

export async function computeSha1(buffer: Uint8Array): Promise<string> {
    const crypto = await import('crypto');
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
