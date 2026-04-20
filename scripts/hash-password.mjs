#!/usr/bin/env node
/**
 * Generate an ADMIN_PASSWORD_HASH for the admin authentication system.
 *
 * Usage:
 *   pnpm hash-password
 *   pnpm hash-password <password>
 *
 * The output is in `salt_hex:hash_hex` format (PBKDF2-SHA-256, 100k iterations),
 * matching the algorithm in src/lib/server/auth.ts. Paste the output into your
 * Cloudflare Pages environment variable `ADMIN_PASSWORD_HASH` (as a Secret).
 */

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const PBKDF2_ITERATIONS = 100_000;

function hexEncode(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

async function hashPassword(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits'],
    );
    const bits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: new Uint8Array(salt),
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256',
        },
        keyMaterial,
        256,
    );
    return `${hexEncode(salt)}:${hexEncode(bits)}`;
}

async function readPasswordInteractive() {
    const rl = createInterface({ input: stdin, output: stdout });
    try {
        const pw1 = await rl.question('Password: ');
        if (!pw1) {
            console.error('Password cannot be empty');
            process.exit(1);
        }
        const pw2 = await rl.question('Confirm:  ');
        if (pw1 !== pw2) {
            console.error('Passwords do not match');
            process.exit(1);
        }
        return pw1;
    } finally {
        rl.close();
    }
}

const argPassword = process.argv[2];
const password = argPassword ?? (await readPasswordInteractive());

const hash = await hashPassword(password);

console.log('');
console.log('ADMIN_PASSWORD_HASH value:');
console.log(hash);
console.log('');
console.log('Set this as the `ADMIN_PASSWORD_HASH` environment variable in');
console.log('Cloudflare Pages → Settings → Environment variables (as a Secret).');
