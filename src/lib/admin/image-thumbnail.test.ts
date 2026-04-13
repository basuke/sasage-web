import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ImageThumbnail from './image-thumbnail.svelte';
import type { Image } from '$lib/data';
import type { ImageUsage } from './image-filter';

vi.mock('$lib/data', () => ({
    imagePath: (id: string, variant: string) => `https://imagedelivery.net/HASH/${id}/${variant}`,
}));

const mockImage: Image = {
    id: 'illustration/1',
    format: 'jpeg',
    width: 800,
    height: 600,
    title: 'Test Image',
};

describe('ImageThumbnail', () => {
    it('renders image with correct src from imagePath', () => {
        render(ImageThumbnail, { props: { image: mockImage } });

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://imagedelivery.net/HASH/illustration/1/square');
    });

    it('displays image ID and dimensions', () => {
        render(ImageThumbnail, { props: { image: mockImage } });

        expect(screen.getByText('illustration/1')).toBeTruthy();
        expect(screen.getByText(/800.*600.*jpeg/)).toBeTruthy();
    });

    it('calls ondelete when delete button is clicked on unused image', async () => {
        const handleDelete = vi.fn();
        render(ImageThumbnail, {
            props: { image: mockImage, usages: [], ondelete: handleDelete },
        });

        const deleteBtn = screen.getByTitle('Delete image');
        await fireEvent.click(deleteBtn);

        expect(handleDelete).toHaveBeenCalledWith('illustration/1');
    });

    it('disables delete button when image is used in collections', () => {
        const usages: ImageUsage[] = [{ label: 'topImages', href: '/admin/collections' }];
        const handleDelete = vi.fn();
        render(ImageThumbnail, {
            props: { image: mockImage, usages, ondelete: handleDelete },
        });

        const deleteBtn = screen.getByTitle('Cannot delete: image is used in collections');
        expect(deleteBtn).toBeDisabled();
    });

    it('renders usage labels as links', () => {
        const usages: ImageUsage[] = [
            { label: 'topImages', href: '/admin/collections' },
            { label: 'zine-2023', href: '/admin/works' },
        ];
        render(ImageThumbnail, { props: { image: mockImage, usages } });

        const links = screen.getAllByRole('link');
        const topImagesLink = links.find((l) => l.textContent === 'topImages');
        const workLink = links.find((l) => l.textContent === 'zine-2023');

        expect(topImagesLink).toHaveAttribute('href', '/admin/collections');
        expect(workLink).toHaveAttribute('href', '/admin/works');
    });
});
