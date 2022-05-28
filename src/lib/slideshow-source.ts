import { readable, type Readable } from 'svelte/store';
import { data, findImage, type Image } from '../data';

export function source(imageIds: string[], interval: number = 5000): Readable<Image> {
    const images: Image[] = imageIds
        .map((id) => findImage(data.images, id) as Image)
        .filter((n) => n);
    if (images.length < 2) {
        throw new Error('More than two valid image ids are required');
    }

    let index = 0;
    return readable(images[index], (set) => {
        const ticket = setInterval(() => {
            index = (index + 1) % images.length;
            set(images[index]);
        }, interval);

        return () => clearInterval(ticket);
    });
}
