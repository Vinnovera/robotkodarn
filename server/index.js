import Path from 'path'
import Hapi from 'hapi'
import Inert from 'inert'
import mongoose from 'mongoose'
import config from 'config'
import base from './base'
import auth from './api/auth'
import isLoggedIn from './api/isLoggedIn'
import workshops from './api/workshops'
import users from './api/users'
import links from './api/links'
import parts from './api/parts'
import usb from './api/usb'
import editor from './api/editor'

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
	port: process.env.PORT || 8000
})

const webpack = require('webpack')
const WebpackPlugin = require('hapi-webpack-plugin')
const wpconfig = require('../webpack/config.dev')

server.register({
	register: WebpackPlugin,
	options: {
		compiler: webpack(wpconfig),
		assets: {
			noInfo: true,
			publicPath: wpconfig.output.publicPath,
			quiet: true
		}
	}
}, (error) => {
	if (error) throw error;
})

server.register([
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
	register: isLoggedIn
},
{
	register: workshops
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
	register: usb
},
{
	register: editor
}
], (error) => {
	if (error) throw error

	server.start(() => {
		console.info('Sample stack listening at:', server.info.uri)
	})
})