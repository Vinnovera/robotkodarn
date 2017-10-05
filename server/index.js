import Path from 'path'
import Hapi from 'hapi'
import Inert from 'inert'
import mongoose from 'mongoose'
import base from './base'

import auth from './api/auth'
import workshops from './api/workshops'
import users from './api/users'
import invites from './api/invites'
import links from './api/links'
import parts from './api/parts'
import editor from './api/editor'
import registration from './api/registration'

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
  host: 'localhost', // Defaults to the operating system hostname when available
  port: process.env.PORT
})

/* Register webpack plugin
 * Only in development, since build is handled by build script in production.
 */
if (process.env.NODE_ENV === 'development') {
  // Locally disable rule since this is an exception
  require('./webpackRegistration').default(server) // eslint-disable-line global-require
}

const asyncHandler = require('hapi-es7-async-handler')

server.register([{
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
