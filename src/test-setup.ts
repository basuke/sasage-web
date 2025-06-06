import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock browser APIs that might not be available in test environment
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock IntersectionObserver
(global as any).IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock document methods for image preloading
Object.defineProperty(document, 'head', {
    writable: true,
    value: {
        appendChild: vi.fn(),
    },
});

Object.defineProperty(document, 'createElement', {
    writable: true,
    value: vi.fn().mockReturnValue({
        rel: '',
        as: '',
        href: '',
    }),
});

// Mock ResizeObserver
(global as any).ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Setup common data mocks for components
export const mockImages = {
    'test-image': {
        id: 'test-image',
        format: 'jpeg' as const,
        width: 800,
        height: 600,
        title: 'Test Image',
    },
    'wide-image': {
        id: 'wide-image',
        format: 'jpeg' as const,
        width: 1600,
        height: 800,
        title: 'Wide Image',
    },
    'square-image': {
        id: 'square-image',
        format: 'png' as const,
        width: 800,
        height: 800,
        title: { en: 'Square Image', ja: '正方形画像' },
    },
};

export const mockWorks = [
    {
        id: 'work-1',
        image: 'test-image',
        title: 'Test Work',
        images: ['test-image', 'wide-image'],
    },
    {
        id: 'work-2',
        image: 'square-image',
        title: { en: 'Multilingual Work', ja: '多言語作品' },
        images: ['square-image'],
    },
];
