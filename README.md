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