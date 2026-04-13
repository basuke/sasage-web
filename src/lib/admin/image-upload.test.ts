import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ImageUpload from './image-upload.svelte';

vi.mock('$lib/data', () => ({
    imagePath: (id: string, variant: string) => `https://imagedelivery.net/HASH/${id}/${variant}`,
}));

function createMockFile(name: string, size: number, type: string): File {
    const buffer = new ArrayBuffer(size);
    return new File([buffer], name, { type });
}

describe('ImageUpload', () => {
    it('renders the drop zone with upload instructions', () => {
        render(ImageUpload);

        expect(screen.getByText(/drag & drop/i)).toBeTruthy();
        expect(screen.getByText('browse files')).toBeTruthy();
    });

    it('shows validation error for non-image file', async () => {
        render(ImageUpload);

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const textFile = createMockFile('document.txt', 1024, 'text/plain');

        await fireEvent.change(input, { target: { files: [textFile] } });

        expect(screen.getByText('Only JPEG and PNG files are accepted.')).toBeTruthy();
    });

    it('shows validation error for oversized file', async () => {
        render(ImageUpload);

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const largeFile = createMockFile('large.jpg', 11 * 1024 * 1024, 'image/jpeg');

        await fireEvent.change(input, { target: { files: [largeFile] } });

        expect(screen.getByText(/exceeds 10MB/)).toBeTruthy();
    });

    it('auto-generates ID from filename', async () => {
        render(ImageUpload);

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createMockFile('My Cool Image.jpg', 1024, 'image/jpeg');

        await fireEvent.change(input, { target: { files: [file] } });

        const idInput = screen.getByPlaceholderText(
            'e.g. illustration/my-image',
        ) as HTMLInputElement;
        expect(idInput.value).toBe('my-cool-image');
    });

    it('shows duplicate warning when ID already exists', async () => {
        render(ImageUpload, {
            props: { existingIds: ['my-image'] },
        });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createMockFile('my-image.jpg', 1024, 'image/jpeg');

        await fireEvent.change(input, { target: { files: [file] } });

        expect(screen.getByText(/already exists/)).toBeTruthy();
    });
});
