const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const InlineEnvironmentVariablesPlugin = require('inline-environment-variables-webpack-plugin')

module.exports = {
	devtool: 'source-map',
	entry: [
		'babel-polyfill',
		'./src/index'
	],
	output: {
		path: path.join(__dirname, '..', 'dist', 'client', 'static'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		function () {
			this.plugin('done', (stats) => {
				if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
					console.log(stats.compilation.errors)
					process.exit(1)
				}
			})
		},
		new Dotenv({
			path: '.env',
			safe: true // load .env.example
		}),
		new InlineEnvironmentVariablesPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		})
	],
	resolve: {
		alias: {}
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel-loader'],
				include: path.join(__dirname, '..', 'src')
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader?localIdentName=[local]-[hash:base64:10]'
			},
			{
				test: /\.(png|jpg|svg)$/,
				loader: 'url-loader'
			}
		]
	}
}
