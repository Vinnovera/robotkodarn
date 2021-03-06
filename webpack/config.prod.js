const path = require('path')
const webpack = require('webpack')
const InlineEnvironmentVariablesPlugin = require('inline-environment-variables-webpack-plugin')

module.exports = {
	devtool: 'source-map',
	entry: [
		'babel-polyfill',
		'./src/index'
	],
	output: {
		path: path.resolve(__dirname, '../dist/client/static'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new InlineEnvironmentVariablesPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
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
