# What is this?

This is the source code of Mayumi Sasage's Website. https://mayumi-sasage.info

# Technologies used in this project

yarn
node (15 or later for M1 Mac)
firebase
firebase storage

# How to run development environment?

> yarn dev

# How to deploy?

Pushing to origin/main invokes deployment to the Firebase. (via GitHub Action)

# How to update images?

Replace images in /images/ directory and run 

> node scripts/upload.js

The iamges are cached in Firebase Storage. It takes a few minutes to be reflected with new image.

# serviceAccountKey.json

This file is required to upload images to Google Cloud Storage. It can be created and downloaded from the Cloud Console.

1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts/
2. Choose Sasage-website
3. Choose firebase-adminsdk
4. Select "Keys" tab
5. Create a new key and download JSON file.
6. Name it as `serviceAccountKey.json` and place it in the root of this project.
