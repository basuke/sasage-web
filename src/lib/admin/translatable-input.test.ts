import { describe, it, expect } from 'vitest';
import type { TranslatableString, Lang } from '$lib/data';

// Test the translatable input logic (en/ja switching, value output format)

interface TranslatableInputState {
    activeLang: Lang;
    value: TranslatableString;
}

function getEnValue(value: TranslatableString): string {
    return typeof value === 'string' ? value : (value.en ?? '');
}

function getJaValue(value: TranslatableString): string {
    return typeof value === 'string' ? '' : (value.ja ?? '');
}

function getCurrentValue(state: TranslatableInputState): string {
    return state.activeLang === 'en' ? getEnValue(state.value) : getJaValue(state.value);
}

function handleInput(state: TranslatableInputState, newText: string): TranslatableString {
    const enValue = getEnValue(state.value);
    const jaValue = getJaValue(state.value);

    if (state.activeLang === 'en') {
        if (jaValue) {
            return { en: newText, ja: jaValue };
        } else if (newText) {
            return newText;
        } else {
            return '';
        }
    } else {
        const en = enValue;
        if (newText || en) {
            const obj: { en?: string; ja?: string } = {};
            if (en) obj.en = en;
            if (newText) obj.ja = newText;
            return obj;
        } else {
            return '';
        }
    }
}

describe('TranslatableInput logic', () => {
    describe('getCurrentValue', () => {
        it('returns string value for EN tab when value is a string', () => {
            const state: TranslatableInputState = { activeLang: 'en', value: 'Hello' };
            expect(getCurrentValue(state)).toBe('Hello');
        });

        it('returns empty string for JA tab when value is a string', () => {
            const state: TranslatableInputState = { activeLang: 'ja', value: 'Hello' };
            expect(getCurrentValue(state)).toBe('');
        });

        it('returns EN value for EN tab when value is an object', () => {
            const state: TranslatableInputState = {
                activeLang: 'en',
                value: { en: 'Hello', ja: 'こんにちは' },
            };
            expect(getCurrentValue(state)).toBe('Hello');
        });

        it('returns JA value for JA tab when value is an object', () => {
            const state: TranslatableInputState = {
                activeLang: 'ja',
                value: { en: 'Hello', ja: 'こんにちは' },
            };
            expect(getCurrentValue(state)).toBe('こんにちは');
        });

        it('returns empty string for missing language key', () => {
            const state: TranslatableInputState = {
                activeLang: 'ja',
                value: { en: 'Hello' },
            };
            expect(getCurrentValue(state)).toBe('');
        });
    });

    describe('handleInput', () => {
        it('returns plain string when editing EN without JA value', () => {
            const state: TranslatableInputState = { activeLang: 'en', value: '' };
            expect(handleInput(state, 'Hello')).toBe('Hello');
        });

        it('returns object when editing EN with existing JA value', () => {
            const state: TranslatableInputState = {
                activeLang: 'en',
                value: { en: 'Old', ja: 'こんにちは' },
            };
            expect(handleInput(state, 'New')).toEqual({ en: 'New', ja: 'こんにちは' });
        });

        it('returns empty string when clearing EN without JA value', () => {
            const state: TranslatableInputState = { activeLang: 'en', value: 'Hello' };
            expect(handleInput(state, '')).toBe('');
        });

        it('returns object with only JA when clearing EN with existing JA', () => {
            const state: TranslatableInputState = {
                activeLang: 'en',
                value: { en: 'Hello', ja: 'こんにちは' },
            };
            expect(handleInput(state, '')).toEqual({ en: '', ja: 'こんにちは' });
        });

        it('returns object with JA when editing JA', () => {
            const state: TranslatableInputState = { activeLang: 'ja', value: '' };
            expect(handleInput(state, 'こんにちは')).toEqual({ ja: 'こんにちは' });
        });

        it('returns object with both langs when editing JA with existing EN', () => {
            const state: TranslatableInputState = {
                activeLang: 'ja',
                value: { en: 'Hello' },
            };
            expect(handleInput(state, 'こんにちは')).toEqual({ en: 'Hello', ja: 'こんにちは' });
        });

        it('returns empty string when clearing JA without EN value', () => {
            const state: TranslatableInputState = {
                activeLang: 'ja',
                value: { ja: 'こんにちは' },
            };
            expect(handleInput(state, '')).toBe('');
        });

        it('returns object with only EN when clearing JA with existing EN', () => {
            const state: TranslatableInputState = {
                activeLang: 'ja',
                value: { en: 'Hello', ja: 'こんにちは' },
            };
            expect(handleInput(state, '')).toEqual({ en: 'Hello' });
        });
    });
});
