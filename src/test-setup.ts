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

// Mock document.head.appendChild for image preloading (preserve original for DOM operations)
const originalHeadAppendChild = document.head.appendChild.bind(document.head);
document.head.appendChild = vi.fn().mockImplementation((node: Node) => {
    return originalHeadAppendChild(node);
});

// Wrap document.createElement to support preloading mocks while preserving DOM functionality
const originalCreateElement = document.createElement.bind(document);
document.createElement = vi
    .fn()
    .mockImplementation((tagName: string, options?: ElementCreationOptions) => {
        return originalCreateElement(tagName, options);
    }) as unknown as typeof document.createElement;

// Mock URL.createObjectURL/revokeObjectURL for file preview
if (typeof URL.createObjectURL === 'undefined') {
    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
}
if (typeof URL.revokeObjectURL === 'undefined') {
    URL.revokeObjectURL = vi.fn();
}

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
