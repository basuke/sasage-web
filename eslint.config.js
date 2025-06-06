import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte3';
import prettier from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js', '**/*.mjs', '**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
            },
        },
        rules: {
            // Basic rules
            'no-unused-vars': 'off', // Let TypeScript handle this
            'no-undef': 'off', // Let TypeScript handle this
            'prefer-const': 'error',
        },
    },
    // Skip Svelte files for now - TypeScript checking handles them
    // {
    //     files: ['**/*.svelte'],
    //     plugins: {
    //         svelte3: svelte,
    //     },
    //     processor: 'svelte3/svelte3',
    //     rules: {
    //         'no-undef': 'off',
    //         'no-unused-vars': 'off',
    //     },
    //     settings: {
    //         'svelte3/typescript': true,
    //     },
    // },
    {
        // Test files
        files: ['**/*.test.ts', '**/*.test.js', '**/test-setup.ts'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                vi: 'readonly',
                global: 'writable',
            },
        },
    },
    {
        // Configuration and script files
        files: ['*.config.js', '*.config.ts', '*.config.mjs', '*.config.cjs', 'scripts/**/*.mjs'],
        languageOptions: {
            globals: {
                process: 'readonly',
                __dirname: 'readonly',
                module: 'readonly',
                require: 'readonly',
            },
        },
    },
    {
        ignores: [
            'node_modules/**',
            '.svelte-kit/**',
            'build/**',
            'dist/**',
            'coverage/**',
            'playwright-report/**',
            'test-results/**',
            'lighthouse-results/**',
            '*.min.js',
            '**/*.svelte', // Skip Svelte files - TypeScript checking handles them
        ],
    },
    // Prettier config should be last to override formatting rules
    prettier,
];
