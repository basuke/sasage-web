import { readable, type Readable, type Subscriber } from 'svelte/store';
import { data, findImage, imagePath, type Image } from './data';

/**
 * Manages crossfade transition state for a slideshow.
 * When the store emits a new image, `previousImage` is set to the current
 * `image` and `image` is updated to the new value — both in the same
 * synchronous block so renderers can batch them in a single frame.
 */
export function createTransition(imageSource: Readable<Image>) {
    let image: Image | null = null;
    let previousImage: Image | null = null;
    let isFirstImage = true;
    let timeoutId: ReturnType<typeof setTimeout>;
    let listener: (() => void) | null = null;

    const unsub = imageSource.subscribe(($img) => {
        if (image === null) {
            image = $img;
            previousImage = $img;
        } else {
            const prev = image;
            timeoutId = setTimeout(() => {
                previousImage = prev;
                image = $img;
                isFirstImage = false;
                listener?.();
            }, 100);
        }
        listener?.();
    });

    return {
        get image() { return image; },
        get previousImage() { return previousImage; },
        get isFirstImage() { return isFirstImage; },
        onChange(fn: () => void) { listener = fn; },
        destroy() {
            unsub();
            clearTimeout(timeoutId);
            listener = null;
        },
    };
}

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
