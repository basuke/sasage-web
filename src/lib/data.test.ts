import { describe, it, expect, vi } from 'vitest';
import {
    findImage,
    findWork,
    imagePath,
    translated,
    type Image,
    type Work,
    type ImageSet,
} from './data';

describe('Data Utilities', () => {
    describe('findImage', () => {
        const mockImages: ImageSet = {
            'test-image': {
                id: 'test-image',
                format: 'jpeg',
                width: 800,
                height: 600,
                title: 'Test Image',
            },
            'another-image': {
                id: 'another-image',
                format: 'png',
                width: 1200,
                height: 800,
                title: { en: 'Another Image', ja: 'もう一つの画像' },
            },
        };

        it('should return image when found', () => {
            const result = findImage(mockImages, 'test-image');
            expect(result).toEqual(mockImages['test-image']);
        });

        it('should return null when image not found', () => {
            const result = findImage(mockImages, 'nonexistent');
            expect(result).toBeNull();
        });

        it('should handle empty image set', () => {
            const result = findImage({}, 'any-id');
            expect(result).toBeNull();
        });
    });

    describe('findWork', () => {
        const mockWorks: Work[] = [
            {
                id: 'work-1',
                title: 'First Work',
                images: ['image1', 'image2'],
            },
            {
                id: 'work-2',
                title: { en: 'Second Work', ja: '第二作品' },
                images: ['image3'],
            },
        ];

        it('should return work when found', () => {
            const result = findWork(mockWorks, 'work-1');
            expect(result).toEqual(mockWorks[0]);
        });

        it('should return undefined when work not found', () => {
            const result = findWork(mockWorks, 'nonexistent');
            expect(result).toBeUndefined();
        });

        it('should handle empty work array', () => {
            const result = findWork([], 'any-id');
            expect(result).toBeUndefined();
        });
    });

    describe('imagePath', () => {
        it('should generate correct path with default variant', () => {
            const result = imagePath('test-image');
            expect(result).toBe(
                'https://imagedelivery.net/3Z234PNqO8eVcjKwgURmyQ/test-image/public',
            );
        });

        it('should generate correct path with custom variant', () => {
            const result = imagePath('test-image', 'mx960');
            expect(result).toBe(
                'https://imagedelivery.net/3Z234PNqO8eVcjKwgURmyQ/test-image/mx960',
            );
        });

        it('should handle special characters in id', () => {
            const result = imagePath('test/image-with-special_chars');
            expect(result).toBe(
                'https://imagedelivery.net/3Z234PNqO8eVcjKwgURmyQ/test/image-with-special_chars/public',
            );
        });
    });

    describe('translated', () => {
        const mockObject = {
            title: 'Simple Title',
            description: {
                en: 'English description',
                ja: '日本語の説明',
            },
            content: {
                en: 'This is **bold** text with a [link](https://example.com)',
                ja: 'これは**太字**のテキストと[リンク](https://example.com)です',
            },
            multiline: {
                en: 'Line 1\nLine 2\nLine 3',
                ja: '行1\n行2\n行3',
            },
        };

        it('should return string value directly', () => {
            const result = translated(mockObject, 'title', 'en');
            expect(result).toBe('Simple Title');
        });

        it('should return English translation when available', () => {
            const result = translated(mockObject, 'description', 'en');
            expect(result).toBe('English description');
        });

        it('should return Japanese translation when available', () => {
            const result = translated(mockObject, 'description', 'ja');
            expect(result).toBe('日本語の説明');
        });

        it('should fallback to English when language not available', () => {
            const result = translated(mockObject, 'description', 'fr');
            expect(result).toBe('English description');
        });

        it('should render markdown to HTML', () => {
            const result = translated(mockObject, 'content', 'en');
            expect(result).toContain('<strong>bold</strong>');
            expect(result).toContain('<a href="https://example.com">link</a>');
        });

        it('should convert newlines to <br> tags', () => {
            const result = translated(mockObject, 'multiline', 'en');
            expect(result).toBe('Line 1<br>Line 2<br>Line 3');
        });

        it('should return empty string for undefined object', () => {
            const result = translated(undefined, 'title', 'en');
            expect(result).toBe('');
        });

        it('should return empty string for missing key', () => {
            const result = translated(mockObject, 'nonexistent', 'en');
            expect(result).toBe('');
        });

        it('should handle non-string values', () => {
            const objWithNumber = { count: 42 };
            const result = translated(objWithNumber, 'count', 'en');
            expect(result).toBe('');
        });
    });
});
