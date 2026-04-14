import { describe, it, expect, vi } from 'vitest';

// Test confirm dialog callback logic

interface DialogConfig {
    open: boolean;
    onconfirm?: () => void;
    oncancel?: () => void;
}

function handleConfirm(config: DialogConfig) {
    config.onconfirm?.();
}

function handleCancel(config: DialogConfig) {
    config.oncancel?.();
}

function handleKeydown(config: DialogConfig, key: string) {
    if (key === 'Escape') handleCancel(config);
}

describe('ConfirmDialog logic', () => {
    it('calls onconfirm when confirmed', () => {
        const onconfirm = vi.fn();
        const config: DialogConfig = { open: true, onconfirm };
        handleConfirm(config);
        expect(onconfirm).toHaveBeenCalledOnce();
    });

    it('calls oncancel when cancelled', () => {
        const oncancel = vi.fn();
        const config: DialogConfig = { open: true, oncancel };
        handleCancel(config);
        expect(oncancel).toHaveBeenCalledOnce();
    });

    it('calls oncancel on Escape key', () => {
        const oncancel = vi.fn();
        const config: DialogConfig = { open: true, oncancel };
        handleKeydown(config, 'Escape');
        expect(oncancel).toHaveBeenCalledOnce();
    });

    it('does not call oncancel on non-Escape key', () => {
        const oncancel = vi.fn();
        const config: DialogConfig = { open: true, oncancel };
        handleKeydown(config, 'Enter');
        expect(oncancel).not.toHaveBeenCalled();
    });

    it('does not error when callbacks are undefined', () => {
        const config: DialogConfig = { open: true };
        expect(() => handleConfirm(config)).not.toThrow();
        expect(() => handleCancel(config)).not.toThrow();
    });
});
