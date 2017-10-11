# Robotkodarn

## Description

Robotkodarn is a project made by students at [KYH](http://kyh.se/) and [Medieinstitutet](http://medieinstitutet.se/) together with Vinnovera. It is based on [primavera133/sample-stack](https://github.com/primavera133/sample-stack).

## Setup
To start project if you are running MongoDB from the cloud:

```bash
# Install dependencies
$ npm install

# Start project under development
$ npm run dev

```

If you are running MongoDB locally:

```bash
# Install dependencies
$ npm install

# Start mongo in a seperate window
$ npm run mongo:start

# Start project under development
$ npm run dev

```

If you prefer `yarn`, the app of course also work with that. Running everything locally, the app should be runnning at `localhost:8000`.

### Is `npm run mongo:start` not working? 🤔
If `npm run mongo:start` doesn't work, make sure you have a folder in the root directory /data/db with the correct permissions. Do this by:

```bash
# Create a directory with the correct permission
$ sudo mkdir -p /data/db && sudo chmod 777 /data/db
```

### Connecting to mongo shell from the terminal:
First make sure to download the mongo shell, see [mongodb.org](http://mongodb.org) for more info, or just install mong using [homebrew](https://brew.sh/index_se.html):

`brew install mongodb`

## Build
```bash
# Run build script to make project ready for production
$ npm run build
```

## Deploy

In this project, Robotkodarn is deployed using [Now](https://zeit.co/now). To deploy, make sure you have installed `now`. To install the latest version globally, run:

```bash
# Install the latest version of now
$ npm install -g now
```

When deploying, it's important to include the file  `.env.production`. This will make sure that the environment variables are available in the production environment. To include the file, first make sure it exists in the root level of your project. Then run:

```bash
# Include the .env.production file when deploying
$ now -E .env.production
```

That's it. Your project is now deployed! 🎉
