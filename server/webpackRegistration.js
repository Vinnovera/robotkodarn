const webpack = require('webpack')
const WebpackPlugin = require('hapi-webpack-plugin')
const wpconfig = require('../webpack/config.dev')

export default function webpackRegistration(server) {
	return (
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
		}])
	)
}
