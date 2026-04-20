import { readable, type Readable, type Subscriber } from 'svelte/store';
import { findImage, imagePath, type Image, type ImageSet } from './data';

/**
 * Manages crossfade transition state for a slideshow using two alternating layers.
 *
 * Instead of destroying/recreating DOM elements (which causes flashes),
 * two persistent layers alternate: the new image is placed in the inactive
 * layer, then that layer becomes active. CSS opacity transitions handle
 * the crossfade — no setTimeout, no {#key} blocks needed.
 */
export function createTransition(imageSource: Readable<Image>) {
    let imageA: Image | null = null;
    let imageB: Image | null = null;
    let activeLayer: 'a' | 'b' = 'a';
    let isFirstImage = true;
    let listener: (() => void) | null = null;

    const unsub = imageSource.subscribe(($img) => {
        if (imageA === null) {
            // First image — both layers show the same image
            imageA = $img;
            imageB = $img;
            activeLayer = 'a';
        } else {
            // Place new image in the inactive layer, then switch
            if (activeLayer === 'a') {
                imageB = $img;
                activeLayer = 'b';
            } else {
                imageA = $img;
                activeLayer = 'a';
            }
            isFirstImage = false;
        }
        listener?.();
    });

    return {
        get imageA() {
            return imageA;
        },
        get imageB() {
            return imageB;
        },
        get activeLayer() {
            return activeLayer;
        },
        get isFirstImage() {
            return isFirstImage;
        },
        /** Returns the image currently being displayed (in the active layer). */
        get current() {
            return activeLayer === 'a' ? imageA : imageB;
        },
        /** Returns the image in the inactive layer (the one fading out). */
        get previous() {
            return activeLayer === 'a' ? imageB : imageA;
        },
        onChange(fn: () => void) {
            listener = fn;
        },
        destroy() {
            unsub();
            listener = null;
        },
    };
}

export function source(
    allImages: ImageSet,
    imageIds: string[],
    interval: number = 5000,
): Readable<Image> {
    const images: Image[] = imageIds
        .map((id) => findImage(allImages, id) as Image)
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
