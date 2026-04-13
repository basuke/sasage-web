import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getImageInfo, computeSha1, uploadImage, deleteImage } from './cloudflare-images';
import type { CloudflareConfig } from './cloudflare-images';

// Mock sharp
vi.mock('sharp', () => ({
    default: vi.fn().mockReturnValue({
        metadata: vi.fn().mockResolvedValue({
            format: 'jpeg',
            width: 800,
            height: 600,
        }),
    }),
}));

const mockConfig: CloudflareConfig = {
    accountId: 'test-account-id',
    apiToken: 'test-api-token',
};

describe('getImageInfo', () => {
    it('should extract image metadata', async () => {
        const buffer = new Uint8Array([0xff, 0xd8, 0xff]);
        const info = await getImageInfo(buffer);
        expect(info.format).toBe('jpeg');
        expect(info.width).toBe(800);
        expect(info.height).toBe(600);
    });
});

describe('computeSha1', () => {
    it('should compute SHA1 hash of buffer', async () => {
        const buffer = new Uint8Array(Buffer.from('test data'));
        const hash = await computeSha1(buffer);
        expect(hash).toMatch(/^[0-9a-f]{40}$/);
    });

    it('should return different hashes for different data', async () => {
        const hash1 = await computeSha1(new Uint8Array(Buffer.from('data1')));
        const hash2 = await computeSha1(new Uint8Array(Buffer.from('data2')));
        expect(hash1).not.toBe(hash2);
    });
});

describe('uploadImage', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('should upload successfully', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ success: true }),
        });

        const blob = new Blob(['test'], { type: 'image/jpeg' });
        const result = await uploadImage(mockConfig, blob, 'test/image-1');

        expect(result.success).toBe(true);
        expect(result.id).toBe('test/image-1');
        expect(fetch).toHaveBeenCalledWith(
            `https://api.cloudflare.com/client/v4/accounts/test-account-id/images/v1`,
            expect.objectContaining({
                method: 'POST',
                headers: { Authorization: 'Bearer test-api-token' },
            }),
        );
    });

    it('should return errors on failure', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ success: false, errors: [{ message: 'Upload failed' }] }),
        });

        const blob = new Blob(['test'], { type: 'image/jpeg' });
        const result = await uploadImage(mockConfig, blob, 'test/image-1');

        expect(result.success).toBe(false);
        expect(result.errors).toHaveLength(1);
    });
});

describe('deleteImage', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('should delete successfully', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ success: true }),
        });

        const result = await deleteImage(mockConfig, 'test/image-1');

        expect(result).toBe(true);
        expect(fetch).toHaveBeenCalledWith(
            `https://api.cloudflare.com/client/v4/accounts/test-account-id/images/v1/test/image-1`,
            expect.objectContaining({
                method: 'DELETE',
                headers: { Authorization: 'Bearer test-api-token' },
            }),
        );
    });

    it('should return false on failure', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ success: false }),
        });

        const result = await deleteImage(mockConfig, 'nonexistent');
        expect(result).toBe(false);
    });
});
