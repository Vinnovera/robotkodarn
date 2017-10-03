import Path from 'path'
import Hapi from 'hapi'
import Inert from 'inert'
import mongoose from 'mongoose'
import config from 'config'
import base from './base'

import auth from './api/auth'
import workshops from './api/workshops'
import users from './api/users'
import invites from './api/invites'
import links from './api/links'
import parts from './api/parts'
import editor from './api/editor'
import extensionid from './api/chrome'
import registration from './api/registration'

mongoose.Promise = Promise
mongoose.connect(config.get('database.host'))
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

if (process.env.NODE_ENV === 'development') {
  /* eslint-disable global-require */
  const webpack = require('webpack')
  const WebpackPlugin = require('hapi-webpack-plugin')
  const wpconfig = require('../webpack/config.dev')
  /* eslint-enable global-require */

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
  }], (error) => { throw error })
}

const asyncHandler = require('hapi-es7-async-handler')

// TODO: Move to other register
server.register([{
  register: asyncHandler
}], (error) => {
  if (error) {
    throw error
  }
})

server.register([{
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
},
{
  register: extensionid
}
], (error) => {
  if (error) {
    throw error
  }

  server.start(() => {
    console.info('Server listening at:', server.info.uri)
  })
})
