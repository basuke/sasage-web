# What is this?

This is the source code of Mayumi Sasage's Website. https://mayumi-sasage.info

# Technologies used in this project

pnpm
node (18)

# How to run development environment?

> pnpm install
> pnpm dev

# How to deploy?

Pushing to origin/main invokes deployment to Cloudflare Pages. (via GitHub Action)

The site loads data from Cloudflare D1 at request time (with static JSON fallback when D1 is unavailable).

## D1 Database Setup

### Initial setup (one-time)

```bash
# 1. Create the D1 database
pnpm wrangler d1 create sasage-web-db

# 2. Copy the database_id from the output into wrangler.toml

# 3. Apply schema migrations
pnpm wrangler d1 migrations apply sasage-web-db --remote

# 4. Seed initial data from JSON files
pnpm tsx scripts/migrate-to-d1.ts > /tmp/seed.sql
pnpm wrangler d1 execute sasage-web-db --remote --file=/tmp/seed.sql
```

### Adding new migrations

```bash
# Create a new migration file
pnpm wrangler d1 migrations create sasage-web-db <migration-name>

# Edit the generated file in migrations/

# Apply to remote
pnpm wrangler d1 migrations apply sasage-web-db --remote

# Apply to local (for development)
pnpm wrangler d1 migrations apply sasage-web-db --local
```

### Local development with D1

```bash
# Start dev server with local D1 (SQLite-backed)
pnpm wrangler pages dev .svelte-kit/cloudflare --d1=DB

# Or use vite dev (falls back to static JSON, no D1 needed)
pnpm dev
```

### Bindings

The D1 binding is defined in `wrangler.toml` and automatically picked up by Cloudflare Pages. No manual dashboard configuration is needed.

# How to run tests?

This project includes comprehensive testing infrastructure:

> pnpm test # Run unit tests (Vitest) in interactive mode
> pnpm test:run # Run unit tests (Vitest) in CI mode  
> pnpm test:e2e # Run end-to-end tests (Playwright) - local only

Additional quality checks:

> pnpm check # TypeScript type checking
> pnpm lint # Code linting and formatting validation
> pnpm format # Apply code formatting

# How to update images?

Replace images in /images/ directory and run

> pnpm upload-images

The images are stored in Cloudflare Images.

# About Google Analytics

Google Analytics is used to track the access to this website. During the transition from UA to GA4, the management of analytics tags is moved to Google Tag Manager.

Here is the url: https://tagmanager.google.com/#/container/accounts/6056486588/containers/93230276/workspaces/3

# Cloudflare Images account id and api token

Put the following in .env file.

```
CLOUDFLARE_ACCOUNT_ID = <account id>;
CLOUDFLARE_IMAGES_API_TOKEN = <api token>;
```

# Admin authentication

The admin GUI at `/admin` and admin API at `/api/admin/*` are protected by
password authentication. Sessions are stored in D1 (production) or in memory
(dev), and the password is stored as a PBKDF2 hash in an environment variable.

## Local development

In dev mode, if `ADMIN_PASSWORD_HASH` is not set, a default password of
`admin` is used automatically. To use a custom dev password, add the hash to
your `.env` file:

```
ADMIN_PASSWORD_HASH=<salt_hex>:<hash_hex>
```

## Production setup

1. Generate a password hash:

    ```
    pnpm hash-password
    ```

    (Or pass the password as an argument: `pnpm hash-password 'my-password'`.)

2. In the Cloudflare Pages dashboard, open **Settings → Environment variables**
   and add a new variable:
    - Name: `ADMIN_PASSWORD_HASH`
    - Value: the `salt_hex:hash_hex` string from step 1
    - Type: **Secret** (encrypted)

3. Apply the sessions table migration to D1:

    ```
    wrangler d1 execute <database-name> --file=migrations/0002_sessions.sql --remote
    ```

To change the password later, repeat step 1 with a new password and update the
`ADMIN_PASSWORD_HASH` variable in Cloudflare Pages.
