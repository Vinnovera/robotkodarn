# Robotkodarn
## A project made by students at KYH together with Vinnovera

Based on https://github.com/primavera133/sample-stack

---

## If running MongoDB locally:
1. Start mongo - `mongod` (do this in a separete terminal since it have to idle)
2. Start the app `yarn run dev` (or `npm run dev` if you prefer)
3. The app should now be running at localhost:8000

Note: If step 1 doesn't work, make sure you have a folder in the root directory /data/db with the correct permissions.

Do this by:

`sudo mkdir -p /data/db && sudo chmod 777 /data/db`

## If you want to run MongoDB from the cloud:
The config file is already set up for connecting to the cloud based db so just skip step 1

### Connecting ot the mongo shell from the terminal:
First make sure to download the mongo shell, see [mongodb.org](http://mongodb.org) for more info, or just install mong using [homebrew](https://brew.sh/index_se.html):

`brew install mongodb`