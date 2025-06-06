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
