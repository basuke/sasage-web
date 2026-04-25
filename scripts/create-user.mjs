#!/usr/bin/env node
/**
 * Generate a SQL INSERT statement for a new admin user.
 *
 * Usage:
 *   pnpm create-user
 *   pnpm create-user <email>
 *   pnpm create-user <email> <password>
 *
 * The password is hashed with PBKDF2-SHA-256 (100k iterations), matching
 * the algorithm in src/lib/server/auth.ts. The generated SQL can be piped
 * to wrangler to insert into the `users` table:
 *
 *   pnpm create-user me@example.com | pnpm wrangler d1 execute sasage-web-db --remote --command "$(cat)"
 *
 * Or copy/paste the `wrangler d1 execute ...` command the script prints.
 *
 * Note: this script does not mask password input — it's an admin-only tool
 * run interactively in a trusted terminal.
 */

import { createInterface } from 'node:readline/promises';
import { stdin, stdout, stderr, argv, exit } from 'node:process';

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

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function isValidEmail(email) {
    // Basic shape check; D1 stores what we give it.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sqlEscape(value) {
    return value.replace(/'/g, "''");
}

async function readInteractive(initialEmail, initialPassword) {
    const rl = createInterface({ input: stdin, output: stderr });
    try {
        let email = initialEmail ?? '';
        if (!email) {
            email = await rl.question('Email: ');
        }
        email = normalizeEmail(email);
        if (!email) {
            stderr.write('Email cannot be empty\n');
            exit(1);
        }
        if (!isValidEmail(email)) {
            stderr.write(`Email does not look valid: ${email}\n`);
            exit(1);
        }

        let password = initialPassword ?? '';
        if (!password) {
            password = await rl.question('Password: ');
            if (!password) {
                stderr.write('Password cannot be empty\n');
                exit(1);
            }
            const confirm = await rl.question('Confirm:  ');
            if (password !== confirm) {
                stderr.write('Passwords do not match\n');
                exit(1);
            }
        }

        return { email, password };
    } finally {
        rl.close();
    }
}

const [, , argEmail, argPassword] = argv;
const { email, password } = await readInteractive(argEmail, argPassword);

const passwordHash = await hashPassword(password);
const createdAt = Date.now();

const sql =
    `INSERT INTO users (email, password_hash, created_at) VALUES ` +
    `('${sqlEscape(email)}', '${sqlEscape(passwordHash)}', ${createdAt});`;

// SQL on stdout so it can be piped to wrangler; progress on stderr.
stderr.write('\n');
stderr.write(`User email:    ${email}\n`);
stderr.write(`Password hash: ${passwordHash}\n`);
stderr.write('\nSQL to insert into the `users` table (run against D1):\n');
stderr.write('\n');
stdout.write(sql + '\n');
stderr.write('\n');
stderr.write('Apply with:\n');
stderr.write(
    `  pnpm wrangler d1 execute sasage-web-db --remote --command "${sql.replace(/"/g, '\\"')}"\n`,
);
stderr.write('\n');
stderr.write('For local dev, replace --remote with --local.\n');
stderr.write(
    'To replace an existing user first delete then re-create:\n' +
        `  pnpm wrangler d1 execute sasage-web-db --remote --command "DELETE FROM users WHERE email = '${sqlEscape(email)}'"\n`,
);
