import Path from 'path'
import Hapi from 'hapi'
import Inert from 'inert'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import base from './base'

import auth from './api/auth'
import workshops from './api/workshops'
import users from './api/users'
import invites from './api/invites'
import links from './api/links'
import parts from './api/parts'
import editor from './api/editor'
import registration from './api/registration'

/*
 * Make environment variables available during development (found in .env)
 * Once uploaded to now, NODE_ENV will be set to production
 * through ".env.production"
 */
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: Path.join(__dirname, '../.env.development')
  })
}

mongoose.Promise = Promise
mongoose.connect(process.env.DATABASE_HOST)
mongoose.connection.on('error', console.error.bind(console, 'db error:'))

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(Path.dirname(__dirname), 'dist')
      }
    }
  }
})

server.connection({
  host: 'localhost',
  port: process.env.PORT
})

const webpack = require('webpack')
const WebpackPlugin = require('hapi-webpack-plugin')
const wpconfig = require('../webpack/config.dev')
const asyncHandler = require('hapi-es7-async-handler')

server.register([{
  register: WebpackPlugin,
  options: {
    compiler: webpack(wpconfig),
    assets: {
      noInfo: true,
      publicPath: wpconfig.output.publicPath,
      quiet: true
    }
  }
},
{
  register: asyncHandler
},
{
  register: Inert
},
{
  register: base
},
{
  register: auth
},
{
  register: registration
},
{
  register: workshops
},
{
  register: invites
},
{
  register: users
},
{
  register: links
},
{
  register: parts
},
{
  register: editor
}
], (error) => {
  if (error) {
    throw error
  }

  server.start(() => {
    console.info(`Server listening at: ${server.info.uri} 🚀`)
  })
})
