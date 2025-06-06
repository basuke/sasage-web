import { readable, type Readable } from 'svelte/store';
import { data, findImage, imagePath, type Image } from './data';

export function source(imageIds: string[], interval: number = 5000): Readable<Image> {
    const images: Image[] = imageIds
        .map((id) => findImage(data.images, id) as Image)
        .filter((n) => n);
    if (images.length < 2) {
        throw new Error('More than two valid image ids are required');
    }

    // Preload function for next image
    function preloadNextImage(nextIndex: number) {
        const nextImage = images[nextIndex];
        if (nextImage) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = imagePath(nextImage.id, 'mx960');
            document.head.appendChild(link);
        }
    }

    let index = 0;
    return readable(images[index], (set) => {
        // Preload the first next image
        if (typeof document !== 'undefined') {
            const nextIndex = (index + 1) % images.length;
            preloadNextImage(nextIndex);
        }

        const ticket = setInterval(() => {
            index = (index + 1) % images.length;
            const currentImage = images[index];
            if (currentImage) {
                set(currentImage);

                // Preload the next image after this one
                if (typeof document !== 'undefined') {
                    const nextIndex = (index + 1) % images.length;
                    preloadNextImage(nextIndex);
                }
            }
        }, interval);

        return () => clearInterval(ticket);
    });
}
