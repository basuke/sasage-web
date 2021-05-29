<script>

import { findCollection, findImage, imagePath, translated } from '../app';

import ImageGrid from '../components/image-grid.svelte';
import Img from '../components/img.svelte';
import Container from '../components/container.svelte';
import NotFoundPage from './not-found-page.svelte';

export let id;
export let data = {};
export let lang = 'en';

const collection = findCollection(data.collections, id);

const description = translated(collection, 'description', lang) ?? '';
const title = translated(collection, 'title', lang) ?? '';

const images = collection && 'images' in collection ? collection.images : [];

const toImage = id => findImage(data.images, id);
const isWide = image => image.width > image.height;
let columns = images.map(toImage).filter(n => n).every(isWide) ? 1 : undefined;
</script>

{#if !collection}
    <NotFoundPage />
{:else}
    <Container className="px-16">
        <div class="grid sm:grid-cols-2 gap-4 mb-8">
            <Img {data} {lang} id={collection.image} square />

            <div>
                <h2 class="my-3 text-center text-2xl font-bold">{title}</h2>
                <p class="leading-normal text-lg font-light">{description}</p>
            </div>
        </div>

        <ImageGrid {data} {lang} {images} {columns} />
    </Container>
{/if}
