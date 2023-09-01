# What is this?

This is the source code of Mayumi Sasage's Website. https://mayumi-sasage.info

# Technologies used in this project

yarn
node (18)

# How to run development environment?

> yarn
> yarn dev

# How to deploy?

Pushing to origin/main invokes deployment to Cloudflare Pages. (via GitHub Action)

# How to update images?

Replace images in /images/ directory and run

> node `scripts/upload.mjs`

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
